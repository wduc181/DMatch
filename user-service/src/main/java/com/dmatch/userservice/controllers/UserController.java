package com.dmatch.userservice.controllers;

import com.dmatch.userservice.commons.ApiResponse;
import com.dmatch.userservice.dtos.UserResponse;
import com.dmatch.userservice.services.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${app.api-prefix}")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/users/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        UserResponse user = userService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .message("Got current user")
                .data(user)
                .build());
    }

    @GetMapping("/admin/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        return ResponseEntity.ok().body(ApiResponse.<List<UserResponse>>builder()
                .message("Got all users")
                .data(userService.getAllUsers())
                .build());
    }

    @PutMapping("/admin/users/{id}/status")
    public ResponseEntity<ApiResponse<UserResponse>> changeUserStatus(
            @PathVariable Long id
    ) {
        UserResponse user = userService.changeUserStatus(id);
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .message("Updated user status")
                .data(user)
                .build());
    }
}