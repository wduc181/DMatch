package com.dmatch.companyservice.services.interfaces;

import com.dmatch.companyservice.dtos.CompanyCreateRequest;
import com.dmatch.companyservice.dtos.CompanyResponse;
import com.dmatch.companyservice.dtos.CompanyUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CompanyService {
    CompanyResponse createCompany(CompanyCreateRequest request, Long ownerId);

    CompanyResponse updateCompany(Long ownerId, CompanyUpdateRequest request);

    CompanyResponse getCompanyByOwnerId(Long ownerId);

    CompanyResponse getCompanyById(Long id);

    Page<CompanyResponse> getAllCompanies(int page, int limit,
                                         String keyword, String location,
                                         Integer minSize, Integer maxSize);

    void deleteCompany(Long ownerId);

    List<CompanyResponse> getCompaniesByIds(List<Long> ids);
}