package com.dmatch.authservice.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateRequest {
    private String email;

    @JsonProperty("fullname")
    private String fullName;
}
