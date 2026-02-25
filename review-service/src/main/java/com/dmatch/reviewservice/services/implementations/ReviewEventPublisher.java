package com.dmatch.reviewservice.services.implementations;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewEventPublisher {

     private final KafkaTemplate<String, String> kafkaTemplate;

     @Value("${app.kafka.topics.review-created:review-created}")
     private String reviewCreatedTopic;

     public void publishReviewCreated(Long reviewId, Long userId, Long companyId, Long jobId, Integer rating) {
          String targetKey = companyId != null ? "company_" + companyId : "job_" + jobId;
          String message = String.format(
                    "{\"review_id\":%d,\"user_id\":%d,\"company_id\":%s,\"job_id\":%s,\"rating\":%d}",
                    reviewId, userId,
                    companyId != null ? companyId.toString() : "null",
                    jobId != null ? jobId.toString() : "null",
                    rating);
          kafkaTemplate.send(reviewCreatedTopic, targetKey, message);
          log.info("Published review-created event: reviewId={}, target={}", reviewId, targetKey);
     }
}
