package com.dmatch.filestorageservice.services.interfaces;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

     /**
      * Upload file lên S3 storage.
      *
      * @param file   file cần upload
      * @param folder thư mục đích trên S3 (ví dụ: "avatars", "cvs", "company-logos")
      * @return URL public của file đã upload
      */
     String uploadFile(MultipartFile file, String folder);

     /**
      * Xóa file trên S3 storage theo key.
      *
      * @param fileKey key của file trên S3
      */
     void deleteFile(String fileKey);

     /**
      * Tạo presigned URL để download file.
      *
      * @param fileKey key của file trên S3
      * @return URL tạm thời để download
      */
     String getPresignedUrl(String fileKey);
}
