package com.dmatch.reviewservice.clients;

import com.dmatch.reviewservice.commons.ApiResponse;
import com.dmatch.reviewservice.dtos.CompanySummaryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "COMPANY-SERVICE", fallback = CompanyServiceClientFallback.class)
public interface CompanyServiceClient {

    @GetMapping("${app.api-prefix}/companies/{id}")
    ApiResponse<CompanySummaryResponse> getCompanyById(@PathVariable("id") Long id);
}
