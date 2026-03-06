package com.dmatch.userservice.controllers;

import com.dmatch.userservice.commons.ApiResponse;
import com.dmatch.userservice.dtos.CandidateProfileResponse;
import com.dmatch.userservice.dtos.CandidateProfileUpdateRequest;
import com.dmatch.userservice.dtos.UserResponse;
import com.dmatch.userservice.services.interfaces.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${app.api-prefix}")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/users/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        UserResponse user = userService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .message("Got current user")
                .data(user)
                .build());
    }

    // ==================== Candidate Profile ====================

    @GetMapping("/users/me/profile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<CandidateProfileResponse>> getMyProfile() {
        CandidateProfileResponse profile = userService.getMyProfile();
        return ResponseEntity.ok(ApiResponse.<CandidateProfileResponse>builder()
                .message("Got candidate profile")
                .data(profile)
                .build());
    }

    @PutMapping("/users/me/profile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<CandidateProfileResponse>> updateMyProfile(
            @Valid @RequestBody CandidateProfileUpdateRequest request) {
        CandidateProfileResponse profile = userService.updateMyProfile(request);
        return ResponseEntity.ok(ApiResponse.<CandidateProfileResponse>builder()
                .message("Updated candidate profile")
                .data(profile)
                .build());
    }

    // ==================== Admin ====================

    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        return ResponseEntity.ok().body(ApiResponse.<List<UserResponse>>builder()
                .message("Got all users")
                .data(userService.getAllUsers())
                .build());
    }

    @PutMapping("/admin/users/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> changeUserStatus(
            @PathVariable Long id) {
        UserResponse user = userService.changeUserStatus(id);
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .message("Updated user status")
                .data(user)
                .build());
    }
}