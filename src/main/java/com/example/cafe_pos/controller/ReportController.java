package com.example.cafe_pos.controller;

import com.example.cafe_pos.entity_new.Order;
import com.example.cafe_pos.repository.OrderRepository;
import com.example.cafe_pos.security.Permission;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final OrderRepository orderRepository;

    public ReportController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping("/sales/summary")
    @PreAuthorize("hasAuthority('" + Permission.SYSTEM_READ + "')")
    public Map<String, Object> getSalesSummary(
            @RequestParam(required = false) Long branchId,
            @RequestParam(required = false) String cashierName) {

        List<Order> orders = orderRepository.findAll();

        // Filter by branch
        if (branchId != null) {
            orders = orders.stream()
                    .filter(o -> o.getSourceSystem() != null && branchId.equals(o.getSourceSystem().getId()))
                    .collect(Collectors.toList());
        }
        // Filter by cashier
        if (cashierName != null && !cashierName.isBlank()) {
            orders = orders.stream()
                    .filter(o -> o.getSourceSystem() != null
                            && cashierName.equals(o.getSourceSystem().getCashierName()))
                    .collect(Collectors.toList());
        }
        // Only successful orders
        List<Order> successful = orders.stream()
                .filter(o -> !"F".equals(o.getInvoiceStatus()))
                .collect(Collectors.toList());

        long totalOrders = successful.size();
        double totalRevenue = successful.stream()
                .mapToDouble(o -> o.getValueDetails() != null
                        ? (o.getValueDetails().getTotalValue() != null
                            ? o.getValueDetails().getTotalValue().doubleValue() : 0)
                        : 0)
                .sum();

        // By branch
        Map<Long, Map<String, Object>> byBranchMap = new LinkedHashMap<>();
        for (Order o : successful) {
            if (o.getSourceSystem() == null) continue;
            Long bid = o.getSourceSystem().getId();
            byBranchMap.computeIfAbsent(bid, k -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("branchId", bid);
                m.put("systemNumber", o.getSourceSystem().getSystemNumber());
                m.put("branchName", o.getSourceSystem().getBranchName());
                m.put("orders", 0L);
                m.put("revenue", 0.0);
                return m;
            });
            Map<String, Object> m = byBranchMap.get(bid);
            m.put("orders", (Long) m.get("orders") + 1);
            double rev = o.getValueDetails() != null && o.getValueDetails().getTotalValue() != null
                    ? o.getValueDetails().getTotalValue().doubleValue() : 0;
            m.put("revenue", (Double) m.get("revenue") + rev);
        }

        // By cashier
        Map<String, Map<String, Object>> byCashierMap = new LinkedHashMap<>();
        for (Order o : successful) {
            if (o.getSourceSystem() == null) continue;
            String cname = o.getSourceSystem().getCashierName();
            if (cname == null) cname = "Unknown";
            byCashierMap.computeIfAbsent(cname, k -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("cashierName", k);
                m.put("orders", 0L);
                m.put("revenue", 0.0);
                return m;
            });
            Map<String, Object> m = byCashierMap.get(cname);
            m.put("orders", (Long) m.get("orders") + 1);
            double rev = o.getValueDetails() != null && o.getValueDetails().getTotalValue() != null
                    ? o.getValueDetails().getTotalValue().doubleValue() : 0;
            m.put("revenue", (Double) m.get("revenue") + rev);
        }

        // By date (using documentDetails.date)
        Map<String, Map<String, Object>> byDateMap = new LinkedHashMap<>();
        for (Order o : successful) {
            String date = o.getDocumentDetails() != null ? o.getDocumentDetails().getDate() : "Unknown";
            if (date != null && date.length() >= 10) date = date.substring(0, 10);
            byDateMap.computeIfAbsent(date, k -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("date", k);
                m.put("orders", 0L);
                m.put("revenue", 0.0);
                return m;
            });
            Map<String, Object> m = byDateMap.get(date);
            m.put("orders", (Long) m.get("orders") + 1);
            double rev = o.getValueDetails() != null && o.getValueDetails().getTotalValue() != null
                    ? o.getValueDetails().getTotalValue().doubleValue() : 0;
            m.put("revenue", (Double) m.get("revenue") + rev);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalOrders", totalOrders);
        result.put("totalRevenue", totalRevenue);
        result.put("byBranch", new ArrayList<>(byBranchMap.values()));
        result.put("byCashier", new ArrayList<>(byCashierMap.values()));
        result.put("byDate", new ArrayList<>(byDateMap.values()));
        return result;
    }
}
