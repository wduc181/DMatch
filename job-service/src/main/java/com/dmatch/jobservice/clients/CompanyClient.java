package com.dmatch.jobservice.clients;

import com.dmatch.jobservice.commons.ApiResponse;
import com.dmatch.jobservice.dtos.CompanyResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "company-service", path = "${app.api-prefix}/companies", fallback = CompanyClientFallback.class)
public interface CompanyClient {

    @GetMapping("/{id}")
    ResponseEntity<ApiResponse<CompanyResponse>> getCompanyById(
            @PathVariable Long id);
}
