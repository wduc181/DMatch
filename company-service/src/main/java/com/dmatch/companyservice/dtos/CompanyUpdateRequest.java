package com.dmatch.companyservice.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanyUpdateRequest {
    @NotBlank(message = "Company name cannot be blank")
    @Size(max = 255)
    private String name;

    private String description;

    private String address;

    @JsonProperty("logo_key")
    private String logoKey;

    @JsonProperty("cover_key")
    private String coverKey;

    private String website;

    private String industry;

    @JsonProperty("employee_size")
    @Min(value = 1)
    private Integer employeeSize;
}
