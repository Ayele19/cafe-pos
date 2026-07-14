package com.example.cafe_pos.service;

import com.example.cafe_pos.entity_new.SourceSystem;
import com.example.cafe_pos.repository.SourceSystemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class SourceSystemService {

    private final SourceSystemRepository sourceSystemRepository;

    public SourceSystemService(SourceSystemRepository sourceSystemRepository) {
        this.sourceSystemRepository = sourceSystemRepository;
    }

    // ===================== FIND BY ID =====================
    public SourceSystem findById(Long id) {
        return sourceSystemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SourceSystem not found with id " + id));
    }

    // ===================== FIND BY ID WITH PESSIMISTIC LOCK =====================
    @Transactional
    public SourceSystem findByIdForUpdate(Long id) {
        return sourceSystemRepository.findByIdForUpdate(id)
                .orElseThrow(() -> new RuntimeException("SourceSystem not found with id " + id));
    }

    // ===================== SAVE =====================
    @Transactional
    public SourceSystem save(SourceSystem sourceSystem) {
        return sourceSystemRepository.save(sourceSystem);
    }

    // ===================== UPDATE =====================
    @Transactional
    public SourceSystem update(Long id, SourceSystem updatedSource) {
        SourceSystem existing = findById(id);

        existing.setSystemNumber(updatedSource.getSystemNumber());
        existing.setSystemType(updatedSource.getSystemType());
        existing.setCashierName(updatedSource.getCashierName());
        existing.setSalesPersonName(updatedSource.getSalesPersonName());

        if (updatedSource.getInvoiceCounter() != null) {
            existing.setInvoiceCounter(updatedSource.getInvoiceCounter());
        }

        return save(existing);
    }

    // ===================== DELETE =====================
    @Transactional
    public void deleteById(Long id) {
        SourceSystem existing = findById(id);
        sourceSystemRepository.delete(existing);
    }

    // ===================== GET CURRENT INVOICE COUNTER =====================
    @Transactional(readOnly = true)
    public int getInvoiceCounter(Long sourceSystemId) {
        SourceSystem src = findById(sourceSystemId); // Just fetch, no increment
        return src.getInvoiceCounter() != null ? src.getInvoiceCounter() : 0;
    }

    // ===================== INCREMENT INVOICE COUNTER =====================
    @Transactional
    public int incrementInvoiceCounter(Long sourceSystemId) {
        SourceSystem src = findByIdForUpdate(sourceSystemId); // Lock row for concurrency
        int nextCounter = (src.getInvoiceCounter() == null) ? 1 : src.getInvoiceCounter() + 1;
        src.setInvoiceCounter(nextCounter);
        save(src);
        return nextCounter;
    }

    // ===================== FIND MAX INVOICE COUNTER =====================
    public Optional<Integer> findMaxInvoiceCounter(String someColumn) {
        return sourceSystemRepository.findMaxInvoiceCounter(someColumn);
    }
}
