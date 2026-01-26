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
    public ResponseEntity<UserResponse> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @GetMapping("/admin/users")
    public ResponseEntity<ApiResponse<?>> getAllUsers() {
        return ResponseEntity.ok().body(ApiResponse.builder()
                .message("Got all users")
                .data(userService.getAllUsers())
                .build());
    }

    @PutMapping("/admin/users/{id}/status")
    public ResponseEntity<UserResponse> changeUserStatus(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(userService.changeUserStatus(id));
    }
}