package com.dmatch.companyservice.dtos;

import com.dmatch.companyservice.entities.Company;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class CompanyInternalResponse {
    private Long id;
    private String name;
    private String logoUrl;
    private String address;
    private String website;

    public CompanyInternalResponse fromCompany(Company company) {
        return CompanyInternalResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .logoUrl(company.getLogoUrl())
                .address(company.getAddress())
                .website(company.getWebsite())
                .build();
    }
}