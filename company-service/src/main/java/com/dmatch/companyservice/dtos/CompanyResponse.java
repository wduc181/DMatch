package com.dmatch.companyservice.dtos;

import com.dmatch.companyservice.entities.Company;
import com.fasterxml.jackson.annotation.JsonProperty;
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

    @JsonProperty("logo_key")
    private String logoKey;

    @JsonProperty("logo_url")
    private String logoUrl;

    @JsonProperty("cover_key")
    private String coverKey;

    @JsonProperty("cover_url")
    private String coverUrl;

    private String website;
    private String industry;

    @JsonProperty("employee_size")
    private Integer employeeSize;

    @JsonProperty("owner_id")
    private Long ownerId;

    @JsonProperty("open_jobs")
    private Integer openJobs;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;

    public static CompanyResponse fromCompany(Company company) {
        return CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .description(company.getDescription())
                .address(company.getAddress())
                .logoKey(company.getLogoKey())
                .coverKey(company.getCoverKey())
                .website(company.getWebsite())
                .industry(company.getIndustry())
                .employeeSize(company.getEmployeeSize())
                .ownerId(company.getOwnerId())
                .createdAt(company.getCreatedAt())
                .updatedAt(company.getUpdatedAt())
                .build();
    }
}
