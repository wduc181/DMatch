package com.dmatch.companyservice.dtos;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;

    @JsonProperty("full_name")
    @JsonAlias("fullName")
    private String fullName;

    private String status;
    private List<String> roles;

    @JsonProperty("created_at")
    @JsonAlias("createdAt")
    private LocalDateTime createdAt;
}
