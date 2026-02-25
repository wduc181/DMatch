package com.dmatch.reviewservice.clients;

import com.dmatch.reviewservice.commons.ApiResponse;
import com.dmatch.reviewservice.dtos.CompanySummaryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "COMPANY-SERVICE", path = "${app.internal-prefix}/companies", fallback = CompanyServiceClientFallback.class)
public interface CompanyServiceClient {

    @GetMapping("/{id}")
    ApiResponse<CompanySummaryResponse> getCompanyById(@PathVariable("id") Long id);
}
