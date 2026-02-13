package com.dmatch.filestorageservice.controllers;

import com.dmatch.filestorageservice.commons.ApiResponse;
import com.dmatch.filestorageservice.services.interfaces.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Internal endpoints cho service-to-service communication (không yêu cầu JWT).
 * Chỉ được gọi bởi các service khác qua Feign Client.
 */
@RestController
@RequestMapping("${app.internal-prefix}/files")
@RequiredArgsConstructor
public class InternalFileStorageController {

     private final FileStorageService fileStorageService;

     @DeleteMapping
     public ResponseEntity<ApiResponse<Void>> deleteFile(@RequestParam("file_key") String fileKey) {
          fileStorageService.deleteFile(fileKey);

          return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .message("Delete file successfully")
                    .data(null)
                    .build());
     }

     @GetMapping("/presigned-url")
     public ResponseEntity<ApiResponse<String>> getPresignedUrl(@RequestParam("file_key") String fileKey) {
          String presignedUrl = fileStorageService.getPresignedUrl(fileKey);

          return ResponseEntity.ok(ApiResponse.<String>builder()
                    .message("Created presigned URL")
                    .data(presignedUrl)
                    .build());
     }
}
