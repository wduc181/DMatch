package com.dmatch.jobservice.service.implementations;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobEventPublisher {

     private final KafkaTemplate<String, String> kafkaTemplate;

     @Value("${app.kafka.topics.job-created:job-created}")
     private String jobCreatedTopic;

     public void publishJobCreated(Long jobId, Long companyId, String title) {
          String message = String.format("{\"job_id\":%d,\"company_id\":%d,\"title\":\"%s\"}", jobId, companyId, title);
          kafkaTemplate.send(jobCreatedTopic, String.valueOf(jobId), message);
          log.info("Published job-created event: jobId={}, companyId={}", jobId, companyId);
     }
}
