package com.dmatch.companyservice.controllers;

import com.dmatch.companyservice.commons.ApiResponse;
import com.dmatch.companyservice.dtos.CompanyResponse;
import com.dmatch.companyservice.services.interfaces.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${app.internal-prefix}/companies")
@RequiredArgsConstructor
public class InternalCompanyController {

     private final CompanyService companyService;

     @GetMapping("/{id}")
     public ResponseEntity<ApiResponse<CompanyResponse>> getCompanyById(@PathVariable Long id) {
          CompanyResponse company = companyService.getCompanyById(id);
          return ResponseEntity.ok(ApiResponse.<CompanyResponse>builder()
                    .message("Got company by id")
                    .data(company)
                    .build());
     }

     /**
      * Batch fetch companies by IDs — dùng cho job-service enrichment.
      * GET /internal/api/v1/companies/batch?ids=1,2,3
      */
     @GetMapping("/batch")
     public ResponseEntity<ApiResponse<List<CompanyResponse>>> getCompaniesByIds(
               @RequestParam("ids") List<Long> ids) {
          List<CompanyResponse> companies = companyService.getCompaniesByIds(ids);
          return ResponseEntity.ok(ApiResponse.<List<CompanyResponse>>builder()
                    .message("Got companies by ids")
                    .data(companies)
                    .build());
     }
}
