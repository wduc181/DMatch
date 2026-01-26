package com.dmatch.companyservice.controllers;

import com.dmatch.companyservice.commons.ApiResponse;
import com.dmatch.companyservice.dtos.CompanyCreateRequest;
import com.dmatch.companyservice.dtos.CompanyResponse;
import com.dmatch.companyservice.dtos.CompanyUpdateRequest;
import com.dmatch.companyservice.services.interfaces.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${app.api-prefix}/companies")
@RequiredArgsConstructor
public class CompanyController {
    private final CompanyService companyService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CompanyResponse>>> getAllCompanies(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        Page<CompanyResponse> companies = companyService.getAllCompanies(page, limit);
        return ResponseEntity.ok().body(ApiResponse.<Page<CompanyResponse>>builder()
                .message("Got companies successfully")
                .data(companies)
                .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CompanyResponse>> getCompanyById(
            @PathVariable Long id
    ) {
        CompanyResponse company = companyService.getCompanyById(id);
        return ResponseEntity.ok(ApiResponse.<CompanyResponse>builder()
                .message("Got company with id = " + id + " successfully")
                .data(company)
                .build()
        );
    }

        @PostMapping
        public ResponseEntity<ApiResponse<CompanyResponse>> createCompany(
            @Valid @RequestBody CompanyCreateRequest request
        ) {
            CompanyResponse response = companyService.createCompany(request, request.getOwnerId());
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<CompanyResponse>builder()
                            .message("Created company successfully")
                            .data(response)
                            .build()
            );
        }

        @GetMapping("/by-owner/{ownerId}")
        public ResponseEntity<ApiResponse<CompanyResponse>> getCompanyByOwnerId(
            @PathVariable Long ownerId
        ) {
            CompanyResponse company = companyService.getCompanyByOwnerId(ownerId);
            return ResponseEntity.ok(ApiResponse.<CompanyResponse>builder()
                            .message("Got company successfully")
                            .data(company)
                            .build()
            );
        }

        @PutMapping("/by-owner/{ownerId}")
        public ResponseEntity<ApiResponse<CompanyResponse>> updateCompanyByOwnerId(
            @PathVariable Long ownerId,
            @Valid @RequestBody CompanyUpdateRequest request
        ) {
            CompanyResponse company = companyService.updateCompany(ownerId, request);
            return ResponseEntity.ok(ApiResponse.<CompanyResponse>builder()
                            .message("Updated company successfully")
                            .data(company)
                            .build()
            );
        }

        @DeleteMapping("/by-owner/{ownerId}")
        public ResponseEntity<ApiResponse<Void>> deleteCompanyByOwnerId(
            @PathVariable Long ownerId
        ) {
            companyService.deleteCompany(ownerId);
            return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .message("Deleted company successfully")
                    .data(null)
                    .build()
            );
        }
}