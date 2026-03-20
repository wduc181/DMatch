package com.dmatch.companyservice.services.implementations;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ReviewCreatedEventConsumer {

     @KafkaListener(topics = "${app.kafka.topics.review-created:review-created}", groupId = "${spring.application.name}")
     public void consumeReviewCreatedEvent(String message) {
          if (message == null || message.isBlank()) {
               log.warn("Received blank message in review-created event");
               return;
          }

          try {
               log.info("Received review-created event: {}", message);
          } catch (Exception e) {
               log.warn("Failed to process review-created event: {}", e.getMessage());
          }
     }
}
