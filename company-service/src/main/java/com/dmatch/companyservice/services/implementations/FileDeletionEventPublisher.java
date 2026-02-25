package com.dmatch.companyservice.services.implementations;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileDeletionEventPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;

    @Value("${app.kafka.topics.file-delete:file-delete-requested}")
    private String fileDeleteTopic;

    public void publishDeleteFile(String fileKey) {
        kafkaTemplate.send(fileDeleteTopic, fileKey);
        log.info("Published file delete event for key: {}", fileKey);
    }
}
