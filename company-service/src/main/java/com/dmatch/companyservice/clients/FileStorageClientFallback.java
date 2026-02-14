package com.dmatch.companyservice.clients;

import com.dmatch.companyservice.commons.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class FileStorageClientFallback implements FileStorageClient {

     @Override
     public ResponseEntity<ApiResponse<Void>> deleteFile(String fileKey) {
          log.warn("Fallback: File Storage Service không khả dụng - deleteFile({})", fileKey);
          ApiResponse<Void> response = ApiResponse.<Void>builder()
                    .message("File Storage Service không khả dụng")
                    .data(null)
                    .build();
          return ResponseEntity.ok(response);
     }

     @Override
     public ResponseEntity<ApiResponse<String>> getPresignedUrl(String fileKey) {
          log.warn("Fallback: File Storage Service không khả dụng - getPresignedUrl({})", fileKey);
          ApiResponse<String> response = ApiResponse.<String>builder()
                    .message("File Storage Service không khả dụng")
                    .data(null)
                    .build();
          return ResponseEntity.ok(response);
     }
}
