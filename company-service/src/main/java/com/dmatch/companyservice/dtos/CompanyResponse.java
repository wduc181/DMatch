package com.dmatch.companyservice.dtos;

import com.dmatch.companyservice.entities.Company;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyResponse {
    private Long id;
    private String name;
    private String description;
    private String address;
    private String logoUrl;
    private String website;
    private Integer employeeSize;
    private Long ownerId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CompanyResponse fromCompany(Company company) {
        return CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .description(company.getDescription())
                .address(company.getAddress())
                .logoUrl(company.getLogoUrl())
                .website(company.getWebsite())
                .employeeSize(company.getEmployeeSize())
                .ownerId(company.getOwnerId())
                .createdAt(company.getCreatedAt())
                .updatedAt(company.getUpdatedAt())
                .build();
    }
}
