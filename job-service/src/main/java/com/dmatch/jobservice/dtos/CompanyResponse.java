package com.dmatch.jobservice.dtos;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CompanyResponse {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("owner_id")
    @JsonAlias({ "ownerId" })
    private Long ownerId;

    @JsonProperty("logo_key")
    @JsonAlias({ "logoKey" })
    private String logoKey;

    @JsonProperty("logo_url")
    @JsonAlias({ "logoUrl" })
    private String logoUrl;
}
