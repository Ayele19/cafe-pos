package com.example.cafe_pos.controller;

import com.example.cafe_pos.dto.OrderRequestDTO;
import com.example.cafe_pos.entity_new.*;
import com.example.cafe_pos.repository.*;
import com.example.cafe_pos.security.Permission;
import com.example.cafe_pos.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private static final Logger log = LoggerFactory.getLogger(OrderController.class);

    private final OrderService orderService;
    private final TransactionTypeRepository transactionTypeRepository;
    private final SellerInfoRepository sellerInfoRepository;
    private final BuyerInfoRepository buyerInfoRepository;
    private final CashierRepository cashierRepository;
    private final SourceSystemRepository sourceSystemRepository;

    public OrderController(OrderService orderService,
                           TransactionTypeRepository transactionTypeRepository,
                           SellerInfoRepository sellerInfoRepository,
                           BuyerInfoRepository buyerInfoRepository,
                           CashierRepository cashierRepository,
                           SourceSystemRepository sourceSystemRepository) {
        this.orderService = orderService;
        this.transactionTypeRepository = transactionTypeRepository;
        this.sellerInfoRepository = sellerInfoRepository;
        this.buyerInfoRepository = buyerInfoRepository;
        this.cashierRepository = cashierRepository;
        this.sourceSystemRepository = sourceSystemRepository;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('" + Permission.ORDER_CREATE + "')")
    public ResponseEntity<?> registerOrder(@RequestBody OrderRequestDTO dto,
                                           JwtAuthenticationToken authentication) {
        try {
            String username = authentication.getToken().getClaimAsString("preferred_username");

            // Resolve branch: cashier gets their assigned branch; admin passes sourceSystemId in DTO
            SourceSystem branch;
            Cashier cashier = cashierRepository.findByUsername(username).orElse(null);
            if (cashier != null) {
                branch = cashier.getSourceSystem();
            } else if (dto.getSourceSystemId() != null) {
                branch = sourceSystemRepository.findById(dto.getSourceSystemId())
                        .orElseThrow(() -> new RuntimeException("Branch not found: " + dto.getSourceSystemId()));
            } else {
                // Admin fallback: use branch id=1
                branch = sourceSystemRepository.findById(1L)
                        .orElseThrow(() -> new RuntimeException("No default branch found"));
            }

            TransactionType transactionTypeEntity = transactionTypeRepository
                    .findByType(dto.getTransactionType())
                    .orElseThrow(() -> new RuntimeException("Invalid transaction type: " + dto.getTransactionType()));

            // Resolve seller — use branch's linked seller if available (authoritative for cashier)
            // Fall back to DTO SellerDetails only for admin when branch has no seller linked
            SellerInfo resolvedSeller;
            if (branch.getSeller() != null) {
                resolvedSeller = branch.getSeller();
            } else {
                SellerInfo sellerInfo = dto.getSellerDetails();
                if (sellerInfo == null || sellerInfo.getTin() == null) {
                    throw new RuntimeException("Seller TIN is required — link a seller to the branch or provide SellerDetails");
                }
                resolvedSeller = sellerInfoRepository
                        .findFirstByTin(sellerInfo.getTin())
                        .map(existing -> {
                            existing.setLegalName(sellerInfo.getLegalName());
                            existing.setEmail(sellerInfo.getEmail());
                            existing.setPhone(sellerInfo.getPhone());
                            existing.setRegion(sellerInfo.getRegion());
                            existing.setWereda(sellerInfo.getWereda());
                            existing.setCity(sellerInfo.getCity());
                            existing.setHouseNumber(sellerInfo.getHouseNumber());
                            existing.setVatNumber(sellerInfo.getVatNumber());
                            existing.setSubCity(sellerInfo.getSubCity());
                            existing.setLocality(sellerInfo.getLocality());
                            return sellerInfoRepository.save(existing);
                        })
                        .orElseGet(() -> sellerInfoRepository.save(sellerInfo));
            }

            Order order = new Order();
            order.setTransactionType(transactionTypeEntity);

            // Resolve buyer
            BuyerInfo buyerInfo = dto.getBuyerDetails();
            if (buyerInfo != null) {
                BuyerInfo resolvedBuyer;
                if (buyerInfo.getTin() != null && !buyerInfo.getTin().isBlank()) {
                    resolvedBuyer = buyerInfoRepository.findFirstByTin(buyerInfo.getTin())
                            .map(existing -> {
                                existing.setLegalName(buyerInfo.getLegalName());
                                existing.setEmail(buyerInfo.getEmail());
                                existing.setPhone(buyerInfo.getPhone());
                                existing.setRegion(buyerInfo.getRegion());
                                existing.setWereda(buyerInfo.getWereda());
                                existing.setCity(buyerInfo.getCity());
                                existing.setHouseNumber(buyerInfo.getHouseNumber());
                                existing.setVatNumber(buyerInfo.getVatNumber());
                                existing.setZone(buyerInfo.getZone());
                                existing.setKebele(buyerInfo.getKebele());
                                existing.setIdNumber(buyerInfo.getIdNumber());
                                existing.setIdType(buyerInfo.getIdType());
                                existing.setCountry(buyerInfo.getCountry());
                                return buyerInfoRepository.save(existing);
                            })
                            .orElseGet(() -> buyerInfoRepository.save(buyerInfo));
                } else if (buyerInfo.getPhone() != null && !buyerInfo.getPhone().isBlank()) {
                    resolvedBuyer = buyerInfoRepository.findFirstByPhone(buyerInfo.getPhone())
                            .map(existing -> {
                                existing.setLegalName(buyerInfo.getLegalName());
                                existing.setEmail(buyerInfo.getEmail());
                                existing.setRegion(buyerInfo.getRegion());
                                existing.setCity(buyerInfo.getCity());
                                existing.setCountry(buyerInfo.getCountry());
                                return buyerInfoRepository.save(existing);
                            })
                            .orElseGet(() -> buyerInfoRepository.save(buyerInfo));
                } else {
                    resolvedBuyer = buyerInfoRepository.save(buyerInfo);
                }
                order.setBuyerInfo(resolvedBuyer);
            }

            order.setSellerInfo(resolvedSeller);
            order.setDocumentDetails(dto.getDocumentDetails());
            order.setItems(dto.getItemList());
            order.setPaymentDetails(dto.getPaymentDetails());
            order.setReferenceDetails(dto.getReferenceDetails());
            order.setValueDetails(dto.getValueDetails());
            order.setVersion(dto.getVersion());

            Map<String, Object> result = orderService.processOrderAndSaveIfMORSuccess(order, branch);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error processing order", e);
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Error processing order",
                    "error", e.getMessage() != null ? e.getMessage() : e.getClass().getName(),
                    "cause", e.getCause() != null ? e.getCause().getMessage() : "none"
            ));
        }
    }

    @GetMapping
    @PreAuthorize("hasAuthority('" + Permission.ORDER_READ + "')")
    public ResponseEntity<?> getAllOrders(JwtAuthenticationToken authentication) {
        try {
            String username = authentication.getToken().getClaimAsString("preferred_username");
            // Cashiers see only their own branch's orders
            Cashier cashier = cashierRepository.findByUsername(username).orElse(null);
            List<Order> orders;
            if (cashier != null) {
                String cashierName = cashier.getSourceSystem().getCashierName();
                orders = orderService.getOrdersByCashier(cashierName);
            } else {
                orders = orderService.getAllOrders();
            }
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Error fetching orders",
                    "error", e.getMessage()
            ));
        }
    }
}
