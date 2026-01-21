package com.dmatch.userservice.dtos;

import com.dmatch.userservice.entities.Role;
import com.dmatch.userservice.entities.User;
import lombok.Builder;
import lombok.Data;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
public class InternalUserResponse {
    private Long id;
    private String email;
    private String password;
    private String status;
    private List<String> roles;

    private static List<String> mapRoles(Set<Role> roles) {
        if (roles == null || roles.isEmpty()) {
            return Collections.emptyList();
        }
        return roles.stream()
                .map(Role::getName)
                .collect(Collectors.toList());
    }

    public static InternalUserResponse fromUser(User user) {
        return InternalUserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .status(user.getStatus().toString())
                .password(user.getPassword())
                .roles(mapRoles(user.getRoles()))
                .build();
    }
}