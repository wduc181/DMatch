package com.dmatch.companyservice.dtos;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanyCreateRequest {
    @NotBlank(message = "Company name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
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
    @Min(value = 1, message = "Employee size must be at least 1")
    private Integer employeeSize;

    @NotNull(message = "Owner ID is required")
    @JsonProperty("owner_id")
    @JsonAlias("ownerId")
    private Long ownerId;
}
