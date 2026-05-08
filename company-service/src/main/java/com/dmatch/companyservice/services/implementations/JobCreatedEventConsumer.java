package com.dmatch.companyservice.services.implementations;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class JobCreatedEventConsumer {

     @KafkaListener(topics = "${app.kafka.topics.job-created:job-created}", groupId = "${spring.application.name}")
     public void consumeJobCreatedEvent(String message) {
          if (message == null || message.isBlank()) {
               log.warn("Received blank message in job-created event");
               return;
          }

          try {
               log.info("Received job-created event: {}", message);
          } catch (Exception e) {
               log.warn("Failed to process job-created event: {}", e.getMessage());
          }
     }
}
