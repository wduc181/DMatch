package com.dmatch.filestorageservice.services.implementations;

import com.dmatch.filestorageservice.commons.FileTypeConstants;
import com.dmatch.filestorageservice.exceptions.FileStorageException;
import com.dmatch.filestorageservice.services.interfaces.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.IOException;
import java.time.Duration;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {

     private final S3Client s3Client;
     private final S3Presigner s3Presigner;

     @Value("${spring.cloud.aws.s3.bucket}")
     private String bucketName;

     @Override
     public String uploadFile(MultipartFile file, String folder) {
          if (file.isEmpty()) {
               throw new FileStorageException("File is empty!");
          }

          // Validate file type theo folder
          validateFileType(file, folder);

          // Validate file size theo folder
          validateFileSize(file, folder);

          String originalFilename = file.getOriginalFilename();
          String extension = "";
          if (originalFilename != null && originalFilename.contains(".")) {
               extension = originalFilename.substring(originalFilename.lastIndexOf("."));
          }

          String key = folder + "/" + UUID.randomUUID() + extension;

          try {
               PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                         .bucket(bucketName)
                         .key(key)
                         .contentType(file.getContentType())
                         .build();

               s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

               log.info("Uploaded file successfully: {}", key);
               return key;
          } catch (IOException e) {
               log.error("error upload file: {}", e.getMessage());
               throw new FileStorageException("Error upload file: " + e.getMessage());
          }
     }

     @Override
     public void deleteFile(String fileKey) {
          try {
               DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                         .bucket(bucketName)
                         .key(fileKey)
                         .build();

               s3Client.deleteObject(deleteObjectRequest);
               log.info("Deleted file successfully: {}", fileKey);
          } catch (Exception e) {
               log.error("Failed to delete file: {}", e.getMessage());
               throw new FileStorageException("Cannot delete file " + e.getMessage());
          }
     }

     @Override
     public String getPresignedUrl(String fileKey) {
          GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileKey)
                    .build();

          GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .getObjectRequest(getObjectRequest)
                    .signatureDuration(Duration.ofMinutes(15))
                    .build();

          return s3Presigner.presignGetObject(presignRequest).url().toString();
     }

     /**
      * Validate MIME type của file dựa theo folder đích.
      * Ví dụ: folder "avatars" chỉ chấp nhận ảnh, folder "cvs" chỉ chấp nhận document.
      */
     private void validateFileType(MultipartFile file, String folder) {
          String contentType = file.getContentType();
          Set<String> allowedTypes = FileTypeConstants.getAllowedTypes(folder);

          if (contentType == null || !allowedTypes.contains(contentType)) {
               throw new FileStorageException(
                         String.format("File type '%s' is not allowed for folder '%s'. Allowed types: %s",
                                   contentType, folder, allowedTypes));
          }
     }

     /**
      * Validate kích thước file dựa theo folder đích.
      * Ví dụ: avatar max 2MB, CV max 5MB, general max 10MB.
      */
     private void validateFileSize(MultipartFile file, String folder) {
          long maxSize = FileTypeConstants.getMaxSize(folder);

          if (file.getSize() > maxSize) {
               throw new FileStorageException(
                         String.format("File size %.2f MB exceeds the limit of %.2f MB for folder '%s'",
                                   file.getSize() / (1024.0 * 1024.0),
                                   maxSize / (1024.0 * 1024.0),
                                   folder));
          }
     }
}
