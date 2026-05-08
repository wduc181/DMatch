package com.dmatch.jobservice.clients;

import com.dmatch.jobservice.commons.ApiResponse;
import com.dmatch.jobservice.dtos.CompanyResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
public class CompanyClientFallback implements CompanyClient {

     @Override
     public ResponseEntity<ApiResponse<CompanyResponse>> getCompanyById(Long id) {
          log.warn("Fallback: Company Service unavailable - getCompanyById({})", id);
          ApiResponse<CompanyResponse> response = ApiResponse.<CompanyResponse>builder()
                    .message("Company Service unavailable")
                    .data(null)
                    .build();
          return ResponseEntity.ok(response);
     }

     @Override
     public ResponseEntity<ApiResponse<List<CompanyResponse>>> getCompaniesByIds(List<Long> ids) {
          log.warn("Fallback: Company Service unavailable - getCompaniesByIds({})", ids);
          ApiResponse<List<CompanyResponse>> response = ApiResponse.<List<CompanyResponse>>builder()
                    .message("Company Service unavailable")
                    .data(List.of())
                    .build();
          return ResponseEntity.ok(response);
     }
}
