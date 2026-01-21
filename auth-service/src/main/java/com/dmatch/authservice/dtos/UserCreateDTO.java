package com.dmatch.authservice.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UserCreateDTO {
    private String email;

    private String password;

    @JsonProperty("fullname")
    private String fullName;

    private String role;
}
