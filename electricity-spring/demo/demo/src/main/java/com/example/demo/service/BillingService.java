package com.example.demo.service;

import com.example.demo.model.Consumer;
import com.example.demo.model.Billing;
import com.example.demo.repository.BillingRepository;
import com.example.demo.repository.ConsumerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BillingService {

    @Autowired
    private BillingRepository billingRepository;

    @Autowired
    private ConsumerRepository consumerRepository;

    public float calculateBillAmount(int units) {
        float amount = 0;
        if (units <= 50) {
            amount = units * 3.5f;
        } else if (units <= 150) {
            amount = 50 * 3.5f + (units - 50) * 4.0f;
        } else if (units <= 250) {
            amount = 50 * 3.5f + 100 * 4.0f + (units - 150) * 5.2f;
        } else {
            amount = 50 * 3.5f + 100 * 4.0f + 100 * 5.2f + (units - 250) * 6.5f;
        }
        return amount;
    }

    public Billing generateBill(Consumer consumer) {
        float amount = calculateBillAmount(consumer.getUnits());
        consumerRepository.save(consumer);
        Billing bill = new Billing();
        bill.setConsumer(consumer);
        bill.setAmount(amount);
        return billingRepository.save(bill);
    }
}
