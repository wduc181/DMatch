package com.dmatch.jobservice.clients;

import com.dmatch.jobservice.commons.ApiResponse;
import com.dmatch.jobservice.dtos.CompanyResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "company-service", path = "${app.internal-prefix}/companies", fallback = CompanyClientFallback.class)
public interface CompanyClient {

    @GetMapping("/{id}")
    ResponseEntity<ApiResponse<CompanyResponse>> getCompanyById(
            @PathVariable Long id);

    /**
     * Batch fetch companies by IDs — dùng cho enrichment company info vào
     * JobResponse.
     */
    @GetMapping("/batch")
    ResponseEntity<ApiResponse<List<CompanyResponse>>> getCompaniesByIds(
            @RequestParam("ids") List<Long> ids);
}
