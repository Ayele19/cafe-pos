package com.example.cafe_pos.service;

import com.example.cafe_pos.dto.external.ExternalInvoiceDTO;
import com.example.cafe_pos.entity_new.DocumentDetails;
import com.example.cafe_pos.entity_new.Order;
import com.example.cafe_pos.entity_new.ReferenceDetails;
import com.example.cafe_pos.entity_new.SourceSystem;
import com.example.cafe_pos.mapper.ExternalInvoiceMapper;
import com.example.cafe_pos.repository.OrderRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final SourceSystemService sourceSystemService;
    private final TaxApiService taxApiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public OrderService(OrderRepository orderRepository,
                        SourceSystemService sourceSystemService,
                        TaxApiService taxApiService) {
        this.orderRepository = orderRepository;
        this.sourceSystemService = sourceSystemService;
        this.taxApiService = taxApiService;
    }

    // =============================
    // MAIN METHOD (SEND TO MOR + SAVE)
    // =============================
    @Transactional
    public Map<String, Object> processOrderAndSaveIfMORSuccess(Order order) {

        Map<String, Object> response = new HashMap<>();

        try {
            // 1️⃣ Lock counter row
            SourceSystem src = sourceSystemService.findByIdForUpdate(1L);
            order.setSourceSystem(src);

            // 2️⃣ Generate document number
            int counter = (src.getInvoiceCounter() != null ? src.getInvoiceCounter() : 1);
            String documentNumber = String.valueOf(counter);
            order.setDocumentNumber(documentNumber);

            // 3️⃣ Set order reference inside items
            if (order.getItems() != null) {
                order.getItems().forEach(item -> item.setOrder(order));
            }

            // 4️⃣ Prepare DocumentDetails (MOR REQUIRED FORMAT)
            DocumentDetails doc = new DocumentDetails();
            doc.setDocumentNumber(documentNumber);
            doc.setType("INV");

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy'T'00:00:00");
            doc.setDate(LocalDateTime.now().format(formatter));

            order.setDocumentDetails(doc);
            doc.setOrder(order);

            // 5️⃣ Reference details (null safe)
            if (order.getReferenceDetails() == null) {
                order.setReferenceDetails(new ReferenceDetails());
            }
            order.getReferenceDetails().setPreviousIrn("");
            order.getReferenceDetails().setRelatedDocument(null);

            // 6️⃣ Convert to MOR DTO
            ExternalInvoiceDTO dto = ExternalInvoiceMapper.toExternalInvoiceDTO(order);

            if (dto.getSourceSystem() != null) {
                dto.getSourceSystem().setInvoiceCounter(documentNumber);
            }

            // 7️⃣ SEND TO MOR API
            String morRawResponse = taxApiService.sendInvoice(dto);

            // 8️⃣ Parse MOR JSON safely (NO GSON!)
            JsonNode morJson = objectMapper.readTree(morRawResponse);

            boolean success = morJson.has("statusCode") &&
                    morJson.get("statusCode").asInt() == 200 &&
                    morJson.has("message") &&
                    "SUCCESS".equalsIgnoreCase(morJson.get("message").asText());

            if (success) {
                JsonNode body = morJson.get("body");

                String irn = body.has("irn") ? body.get("irn").asText() : null;
                String signedQR = body.has("signedQR") ? body.get("signedQR").asText() : null;
                String status = body.has("status") ? body.get("status").asText() : "A";

                // 9️⃣ Save success data
                order.setIrn(irn);
                order.setInvoiceStatus(status);

                // 🔟 Increment counter ONLY on success
                src.setInvoiceCounter(counter + 1);
                sourceSystemService.save(src);

                orderRepository.save(order);

                // 1️⃣1️⃣ Return structured response to frontend
                response.put("success", true);
                response.put("message", "Invoice sent to MOR successfully");
                response.put("irn", irn);
                response.put("signedQR", signedQR);
                response.put("documentNumber", documentNumber);
                response.put("morBody", body);

            } else {
                // MOR FAILED
                order.setInvoiceStatus("F");
                orderRepository.save(order);

                response.put("success", false);
                response.put("message", "MOR registration failed");
                response.put("morResponse", morJson);
            }

        } catch (Exception e) {
            order.setInvoiceStatus("F");
            orderRepository.save(order);

            response.put("success", false);
            response.put("message", "Exception while sending to MOR");
            response.put("error", e.getMessage());
        }

        return response;
    }

    // =============================
    // GET ALL ORDERS
    // =============================
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
