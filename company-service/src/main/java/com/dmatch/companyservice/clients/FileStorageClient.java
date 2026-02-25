package com.dmatch.companyservice.clients;

import com.dmatch.companyservice.commons.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "file-storage-service", path = "/internal/files", fallback = FileStorageClientFallback.class)
public interface FileStorageClient {

    @GetMapping("/presigned-url")
    ResponseEntity<ApiResponse<String>> getPresignedUrl(@RequestParam("file_key") String fileKey);
}
