package com.dmatch.userservice.dtos;

import com.dmatch.userservice.entities.Role;
import com.dmatch.userservice.entities.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String fullName;
    private String status;
    private List<String> roles;
    private LocalDateTime createdAt;

    private static List<String> mapRoles(Set<Role> roles) {
        if (roles == null || roles.isEmpty()) {
            return Collections.emptyList();
        }
        return roles.stream()
                .map(Role::getName)
                .collect(Collectors.toList());
    }

    public static UserResponse fromUser(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .status(user.getStatus().toString())
                .roles(mapRoles(user.getRoles()))
                .createdAt(user.getCreatedAt())
                .build();
    }
}
