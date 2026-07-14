package com.example.cafe_pos.controller;

import com.example.cafe_pos.dto.OrderRequestDTO;
import com.example.cafe_pos.entity_new.Order;
import com.example.cafe_pos.entity_new.TransactionType;
import com.example.cafe_pos.repository.TransactionTypeRepository;
import com.example.cafe_pos.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;
    private final TransactionTypeRepository transactionTypeRepository;

    public OrderController(OrderService orderService,
                           TransactionTypeRepository transactionTypeRepository) {
        this.orderService = orderService;
        this.transactionTypeRepository = transactionTypeRepository;
    }

    // =============================
    // REGISTER ORDER (SEND TO MOR)
    // =============================
   @PostMapping
public ResponseEntity<?> registerOrder(@RequestBody OrderRequestDTO dto) {
    try {
        // Map TransactionType string to Entity
        TransactionType transactionTypeEntity = transactionTypeRepository
                .findByType(dto.getTransactionType())
                .orElseThrow(() ->
                        new RuntimeException("Invalid transaction type: " + dto.getTransactionType())
                );

        // Map DTO → Entity
        Order order = new Order();
        order.setTransactionType(transactionTypeEntity);
        order.setBuyerInfo(dto.getBuyerDetails());
        order.setSellerInfo(dto.getSellerDetails());
        order.setDocumentDetails(dto.getDocumentDetails());
        order.setItems(dto.getItemList());
        order.setPaymentDetails(dto.getPaymentDetails());
        order.setReferenceDetails(dto.getReferenceDetails());
        order.setSourceSystem(dto.getSourceSystem());
        order.setValueDetails(dto.getValueDetails());
        order.setVersion(dto.getVersion());

        Map<String, Object> result = orderService.processOrderAndSaveIfMORSuccess(order);

        return ResponseEntity.ok(result);

    } catch (Exception e) {
        return ResponseEntity.status(500).body(
                Map.of(
                        "success", false,
                        "message", "Error processing order",
                        "error", e.getMessage()
                )
        );
    }
}

    // =============================
    // GET ALL ORDERS
    // =============================
    @GetMapping
    public ResponseEntity<?> getAllOrders() {
        try {
            return ResponseEntity.ok(orderService.getAllOrders());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of(
                            "success", false,
                            "message", "Error fetching orders",
                            "error", e.getMessage()
                    )
            );
        }
    }
}
