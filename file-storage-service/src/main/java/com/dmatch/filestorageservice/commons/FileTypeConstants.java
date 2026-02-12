package com.dmatch.filestorageservice.commons;

import java.util.Map;
import java.util.Set;

/**
 * Danh sách các loại file được phép upload, phân loại theo folder.
 * - Ảnh: avatar, company-logos
 * - Document: cvs, documents
 * - General: cho phép cả ảnh và document
 */
public final class FileTypeConstants {

     private FileTypeConstants() {
     }

     // ===== MIME types =====
     public static final Set<String> IMAGE_TYPES = Set.of(
               "image/jpeg",
               "image/png",
               "image/webp"
     );

     public static final Set<String> DOCUMENT_TYPES = Set.of(
               "application/pdf",
               "application/msword",
               "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
     );

     // ===== Kích thước tối đa theo folder (bytes) =====
     public static final long MAX_IMAGE_SIZE = 2 * 1024 * 1024;       // 2MB
     public static final long MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;    // 5MB
     public static final long MAX_GENERAL_SIZE = 10 * 1024 * 1024;    // 10MB

     /**
      * Mapping folder → allowed MIME types.
      * Folder không có trong map sẽ cho phép cả ảnh và document.
      */
     public static final Map<String, Set<String>> FOLDER_ALLOWED_TYPES = Map.of(
               "avatars", IMAGE_TYPES,
               "company-logos", IMAGE_TYPES,
               "cvs", DOCUMENT_TYPES,
               "documents", DOCUMENT_TYPES
     );

     /**
      * Mapping folder → max file size (bytes).
      */
     public static final Map<String, Long> FOLDER_MAX_SIZE = Map.of(
               "avatars", MAX_IMAGE_SIZE,
               "company-logos", MAX_IMAGE_SIZE,
               "cvs", MAX_DOCUMENT_SIZE,
               "documents", MAX_DOCUMENT_SIZE
     );

     /**
      * Lấy danh sách MIME types được phép cho folder.
      * Folder không xác định → cho phép cả ảnh và document.
      */
     public static Set<String> getAllowedTypes(String folder) {
          Set<String> types = FOLDER_ALLOWED_TYPES.get(folder);
          if (types != null) {
               return types;
          }
          // General: cho phép cả ảnh và document
          return Set.of(
                    "image/jpeg", "image/png", "image/webp",
                    "application/pdf", "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          );
     }

     /**
      * Lấy max file size cho folder (bytes).
      * Folder không xác định → dùng MAX_GENERAL_SIZE.
      */
     public static long getMaxSize(String folder) {
          return FOLDER_MAX_SIZE.getOrDefault(folder, MAX_GENERAL_SIZE);
     }
}
