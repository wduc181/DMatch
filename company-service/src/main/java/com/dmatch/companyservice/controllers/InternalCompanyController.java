package com.dmatch.companyservice.controllers;

import com.dmatch.companyservice.commons.ApiResponse;
import com.dmatch.companyservice.dtos.CompanyResponse;
import com.dmatch.companyservice.services.interfaces.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
