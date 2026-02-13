package com.dmatch.filestorageservice.controllers;

import com.dmatch.filestorageservice.commons.ApiResponse;
import com.dmatch.filestorageservice.dtos.FileUploadResponse;
import com.dmatch.filestorageservice.services.interfaces.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("${app.api-prefix}/files")
@RequiredArgsConstructor
public class FileStorageController {

     private final FileStorageService fileStorageService;

     @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
     @PreAuthorize("isAuthenticated()")
     public ResponseEntity<ApiResponse<FileUploadResponse>> uploadFile(
               @RequestParam("file") MultipartFile file,
               @RequestParam(value = "folder", defaultValue = "general") String folder) {

          String fileKey = fileStorageService.uploadFile(file, folder);

          FileUploadResponse responseData = FileUploadResponse.builder()
                    .fileName(file.getOriginalFilename())
                    .fileKey(fileKey)
                    .fileType(file.getContentType())
                    .fileSize(file.getSize())
                    .build();

          return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<FileUploadResponse>builder()
                    .message("Upload file successfully")
                    .data(responseData)
                    .build());
     }

     @DeleteMapping
     @PreAuthorize("isAuthenticated()")
     public ResponseEntity<ApiResponse<Void>> deleteFile(@RequestParam("file_key") String fileKey) {
          fileStorageService.deleteFile(fileKey);

          return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .message("Delete file successfully")
                    .data(null)
                    .build());
     }

     @GetMapping("/presigned-url")
     @PreAuthorize("isAuthenticated()")
     public ResponseEntity<ApiResponse<String>> getPresignedUrl(@RequestParam("file_key") String fileKey) {
          String presignedUrl = fileStorageService.getPresignedUrl(fileKey);

          return ResponseEntity.ok(ApiResponse.<String>builder()
                    .message("Created presigned URL")
                    .data(presignedUrl)
                    .build());
     }
}
