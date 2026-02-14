package com.dmatch.jobservice.clients;

import com.dmatch.jobservice.commons.ApiResponse;
import com.dmatch.jobservice.dtos.CompanyResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class CompanyClientFallback implements CompanyClient {

     @Override
     public ResponseEntity<ApiResponse<CompanyResponse>> getCompanyById(Long id) {
          log.warn("Fallback: Company Service không khả dụng - getCompanyById({})", id);
          ApiResponse<CompanyResponse> response = ApiResponse.<CompanyResponse>builder()
                    .message("Company Service không khả dụng")
                    .data(null)
                    .build();
          return ResponseEntity.ok(response);
     }
}
