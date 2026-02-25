package com.dmatch.companyservice.services.implementations;

import com.dmatch.companyservice.clients.UserClient;
import com.dmatch.companyservice.dtos.CompanyCreateRequest;
import com.dmatch.companyservice.dtos.CompanyResponse;
import com.dmatch.companyservice.dtos.CompanyUpdateRequest;
import com.dmatch.companyservice.dtos.InternalUserResponse;
import com.dmatch.companyservice.entities.Company;
import com.dmatch.companyservice.exceptions.DataNotFoundException;
import com.dmatch.companyservice.exceptions.InvalidParamException;
import com.dmatch.companyservice.exceptions.PermissionDeniedException;
import com.dmatch.companyservice.repositories.CompanyRepository;
import com.dmatch.companyservice.services.interfaces.CompanyService;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyServiceImpl implements CompanyService {
    private final CompanyRepository companyRepository;
    private final UserClient userClient;
    private final FileDeletionEventPublisher fileDeletionEventPublisher;

    @Override
    @Transactional
    public CompanyResponse createCompany(CompanyCreateRequest request, Long ownerId) {
        if (ownerId == null) {
            throw new InvalidParamException("owner_id is required");
        }
        validateOwnerAccess(ownerId);

        if (companyRepository.existsByOwnerId(ownerId)) {
            throw new InvalidParamException("User already owns a company. Cannot create another one.");
        }

        Company company = Company.builder()
                .name(request.getName())
                .description(request.getDescription())
                .address(request.getAddress())
                .logoKey(request.getLogoKey())
                .website(request.getWebsite())
                .employeeSize(request.getEmployeeSize())
                .ownerId(ownerId)
                .build();

        companyRepository.save(company);
        userClient.addCompanyRoleToUser(ownerId);
        return CompanyResponse.fromCompany(company);
    }

    @Override
    @Transactional
    public CompanyResponse updateCompany(Long ownerId, CompanyUpdateRequest request) {
        if (ownerId == null) {
            throw new InvalidParamException("owner_id is required");
        }
        validateOwnerAccess(ownerId);
        Company company = companyRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new DataNotFoundException("Company not found for user id: " + ownerId));

        company.setName(request.getName());
        company.setDescription(request.getDescription());
        company.setAddress(request.getAddress());
        company.setWebsite(request.getWebsite());
        company.setEmployeeSize(request.getEmployeeSize());

        String oldLogoKey = company.getLogoKey();
        String newLogoKey = request.getLogoKey();
        if (oldLogoKey != null && !oldLogoKey.isBlank()
                && (newLogoKey == null || !oldLogoKey.equals(newLogoKey))) {
            deleteFileQuietly(oldLogoKey);
        }
        company.setLogoKey(newLogoKey);

        companyRepository.save(company);

        return CompanyResponse.fromCompany(company);
    }

    @Override
    public CompanyResponse getCompanyByOwnerId(Long ownerId) {
        if (ownerId == null) {
            throw new InvalidParamException("owner_id is required");
        }
        validateOwnerAccess(ownerId);
        Company company = companyRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new DataNotFoundException("No company registered for this user"));
        return CompanyResponse.fromCompany(company);
    }

    @Override
    public CompanyResponse getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Company not found with id: " + id));
        return CompanyResponse.fromCompany(company);
    }

    @Override
    public Page<CompanyResponse> getAllCompanies(int page, int limit) {
        int pageNo = page < 1 ? 0 : page - 1;

        Pageable pageable = PageRequest.of(
                pageNo,
                limit,
                Sort.by("createdAt").descending()
        );
        return companyRepository.findAll(pageable)
                .map(CompanyResponse::fromCompany);
    }

    @Override
    @Transactional
    public void deleteCompany(Long ownerId) {
        if (ownerId == null) {
            throw new InvalidParamException("owner_id is required");
        }
        validateOwnerAccess(ownerId);
        Company company = companyRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new DataNotFoundException("Company not found"));

        if (company.getLogoKey() != null && !company.getLogoKey().isBlank()) {
            deleteFileQuietly(company.getLogoKey());
        }

        companyRepository.delete(company);
        userClient.deleteCompanyRoleToUser(ownerId);
    }

    private void validateOwnerAccess(Long ownerId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new PermissionDeniedException("Unauthenticated");
        }

        if (isAdmin(authentication)) {
            return;
        }

        String email = authentication.getName();
        if (email == null || email.isBlank()) {
            throw new PermissionDeniedException("Invalid authentication subject");
        }

        InternalUserResponse user = getUserByEmailOrThrow(email);
        if (user.getId() == null || !user.getId().equals(ownerId)) {
            throw new PermissionDeniedException("You are not the owner of this company");
        }
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_ADMIN"));
    }

    private InternalUserResponse getUserByEmailOrThrow(String email) {
        try {
            var userResponse = userClient.getUserByEmail(email).getBody();
            if (userResponse == null || userResponse.getData() == null) {
                throw new DataNotFoundException("User not found with email: " + email);
            }
            return userResponse.getData();
        } catch (FeignException e) {
            throw new DataNotFoundException("User not found with email: " + email);
        }
    }

     //Catch exception để không ảnh hưởng flow chính khi file-storage-service không khả dụng.
    private void deleteFileQuietly(String fileKey) {
        try {
            fileDeletionEventPublisher.publishDeleteFile(fileKey);
        } catch (Exception e) {
            // Log warning nhưng không throw
            log.warn("Failed to publish delete-file event for key '{}': {}", fileKey, e.getMessage());
        }
    }
}