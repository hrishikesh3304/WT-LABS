package com.example.demo.controller;

import com.example.demo.model.Consumer;
import com.example.demo.repository.ConsumerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consumer")
public class ConsumerController {

    @Autowired
    private ConsumerRepository repo;

    @GetMapping
    public List<Consumer> getConsumers() { return repo.findAll(); }

    @PostMapping("/add")
    public Consumer addConsumer(@RequestBody Consumer consumer) { return repo.save(consumer); }


}
