package com.example.cafe_pos.controller;

import com.example.cafe_pos.entity_new.SellerInfo;
import com.example.cafe_pos.entity_new.SourceSystem;
import com.example.cafe_pos.repository.SellerInfoRepository;
import com.example.cafe_pos.repository.SourceSystemRepository;
import com.example.cafe_pos.security.Permission;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/branches")
public class BranchController {

    private final SourceSystemRepository sourceSystemRepository;
    private final SellerInfoRepository sellerInfoRepository;

    public BranchController(SourceSystemRepository sourceSystemRepository,
                            SellerInfoRepository sellerInfoRepository) {
        this.sourceSystemRepository = sourceSystemRepository;
        this.sellerInfoRepository = sellerInfoRepository;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('" + Permission.SYSTEM_READ + "')")
    public List<Map<String, Object>> getAll(@RequestParam(required = false) Long sellerId) {
        List<SourceSystem> branches = sellerId != null
                ? sourceSystemRepository.findBySellerId(sellerId)
                : sourceSystemRepository.findAll();
        return branches.stream().map(this::toMap).collect(Collectors.toList());
    }

    private Map<String, Object> toMap(SourceSystem b) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", b.getId());
        m.put("systemNumber", b.getSystemNumber());
        m.put("systemType", b.getSystemType());
        m.put("branchName", b.getBranchName());
        m.put("cashierName", b.getCashierName());
        m.put("salesPersonName", b.getSalesPersonName());
        m.put("invoiceCounter", b.getInvoiceCounter());
        if (b.getSeller() != null) {
            Map<String, Object> seller = new LinkedHashMap<>();
            seller.put("id", b.getSeller().getId());
            seller.put("legalName", b.getSeller().getLegalName());
            seller.put("tin", b.getSeller().getTin());
            m.put("seller", seller);
        }
        return m;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('" + Permission.SYSTEM_WRITE + "')")
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        SourceSystem branch = new SourceSystem();
        branch.setSystemNumber((String) body.get("systemNumber"));
        branch.setSystemType((String) body.get("systemType"));
        branch.setBranchName((String) body.get("branchName"));
        branch.setCashierName((String) body.get("cashierName"));
        branch.setSalesPersonName((String) body.get("salesPersonName"));
        branch.setInvoiceCounter(1);

        if (body.containsKey("sellerId")) {
            Long sellerId = Long.valueOf(body.get("sellerId").toString());
            SellerInfo seller = sellerInfoRepository.findById(sellerId)
                    .orElseThrow(() -> new RuntimeException("Seller not found"));
            branch.setSeller(seller);
        }

        return ResponseEntity.ok(toMap(sourceSystemRepository.save(branch)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('" + Permission.SYSTEM_WRITE + "')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        SourceSystem branch = sourceSystemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        if (body.containsKey("systemNumber")) branch.setSystemNumber((String) body.get("systemNumber"));
        if (body.containsKey("systemType")) branch.setSystemType((String) body.get("systemType"));
        if (body.containsKey("branchName")) branch.setBranchName((String) body.get("branchName"));
        if (body.containsKey("cashierName")) branch.setCashierName((String) body.get("cashierName"));
        if (body.containsKey("salesPersonName")) branch.setSalesPersonName((String) body.get("salesPersonName"));
        if (body.containsKey("sellerId")) {
            Long sellerId = Long.valueOf(body.get("sellerId").toString());
            SellerInfo seller = sellerInfoRepository.findById(sellerId)
                    .orElseThrow(() -> new RuntimeException("Seller not found"));
            branch.setSeller(seller);
        }

        return ResponseEntity.ok(toMap(sourceSystemRepository.save(branch)));
    }
}
