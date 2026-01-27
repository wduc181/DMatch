package com.dmatch.userservice.controllers;

import com.dmatch.userservice.commons.ApiResponse;
import com.dmatch.userservice.dtos.UserCreateRequest;
import com.dmatch.userservice.dtos.InternalUserResponse;
import com.dmatch.userservice.dtos.UserResponse;
import com.dmatch.userservice.services.interfaces.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${app.internal-prefix}/users")
@RequiredArgsConstructor
public class InternalUserController {
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @Valid @RequestBody UserCreateRequest userCreateRequest
    ) {
        UserResponse user = userService.createUser(userCreateRequest);
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .message("Created user successfully")
                .data(user)
                .build());
    }

    @GetMapping("/by-email")
    public ResponseEntity<ApiResponse<InternalUserResponse>> getUserByEmail(
            @RequestParam String email
    ) {
        InternalUserResponse user = userService.getUserByEmail(email);
        return ResponseEntity.ok(ApiResponse.<InternalUserResponse>builder()
                .message("Got user by email")
                .data(user)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(
            @PathVariable Long id
    ) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .message("Got user by id")
                .data(user)
                .build());
    }

    @PostMapping("/{id}/company")
    public ResponseEntity<ApiResponse<UserResponse>> addCompanyRoleToUser(
            @PathVariable Long id
    ) {
        UserResponse user = userService.addCompanyRoleToUser(id);
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .message("Added company role to user")
                .data(user)
                .build());
    }

    @DeleteMapping("/{id}/company")
    public ResponseEntity<ApiResponse<UserResponse>> deleteCompanyRoleToUser(
            @PathVariable Long id
    ) {
        UserResponse user = userService.deleteCompanyRoleToUser(id);
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .message("Deleted company role from user")
                .data(user)
                .build());
    }
}
