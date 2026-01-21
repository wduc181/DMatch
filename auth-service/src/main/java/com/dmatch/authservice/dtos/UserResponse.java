package com.dmatch.authservice.dtos;

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
    private String fullName;
    private String status;
    private List<String> roles;
    private LocalDateTime createdAt;
}
