package com.dmatch.reviewservice.clients;

import com.dmatch.reviewservice.commons.ApiResponse;
import com.dmatch.reviewservice.dtos.CompanySummaryResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class CompanyServiceClientFallback implements CompanyServiceClient {

     @Override
     public ApiResponse<CompanySummaryResponse> getCompanyById(Long id) {
          log.warn("Fallback: Company Service unavailable - getCompanyById({})", id);
          return ApiResponse.<CompanySummaryResponse>builder()
                    .message("Company Service unavailable")
                    .data(null)
                    .build();
     }
}
