package com.dmatch.userservice.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserCreateDTO {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(max = 255, message = "Hashed password must not exceed 255 characters")
    private String password;

    @Size(max = 255, message = "Full name must not exceed 255 characters")
    @JsonProperty("fullname")
    private String fullName;

    @NotBlank(message = "Role is required")
    private String role;
}
