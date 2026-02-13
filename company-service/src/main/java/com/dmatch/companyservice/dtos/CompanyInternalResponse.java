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
    private String logoKey;
    private String address;
    private String website;

    public CompanyInternalResponse fromCompany(Company company) {
        return CompanyInternalResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .logoKey(company.getLogoKey())
                .address(company.getAddress())
                .website(company.getWebsite())
                .build();
    }
}