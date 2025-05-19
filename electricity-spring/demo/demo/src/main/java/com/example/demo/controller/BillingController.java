package com.example.demo.controller;

import com.example.demo.model.Billing;
import com.example.demo.model.Consumer;
import com.example.demo.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BillingController {

    @Autowired
    private BillingService billingService;

    @PostMapping("/generate-bill")
    public Billing generateBill(@RequestBody Consumer consumer) {
        return billingService.generateBill(consumer);
    }
}
