package com.dmatch.filestorageservice.services.implementations;

import com.dmatch.filestorageservice.services.interfaces.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileDeletionEventConsumer {

    private final FileStorageService fileStorageService;

    @KafkaListener(topics = "${app.kafka.topics.file-delete:file-delete-requested}", groupId = "${spring.application.name}")
    public void consumeDeleteFileEvent(String fileKey) {
        if (fileKey == null || fileKey.isBlank()) {
            log.warn("Received blank file key in delete-file event");
            return;
        }

        try {
            fileStorageService.deleteFile(fileKey);
        } catch (Exception e) {
            log.warn("Failed to delete file '{}' from Kafka event: {}", fileKey, e.getMessage());
        }
    }
}
