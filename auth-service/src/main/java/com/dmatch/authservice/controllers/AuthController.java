package com.dmatch.authservice.controllers;

import com.dmatch.authservice.commons.ApiResponse;
import com.dmatch.authservice.dtos.AuthLoginRequest;
import com.dmatch.authservice.dtos.AuthResponse;
import com.dmatch.authservice.dtos.AuthRegisterRequest;
import com.dmatch.authservice.dtos.UserResponse;
import com.dmatch.authservice.services.interfaces.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${app.api-prefix}/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @RequestBody AuthRegisterRequest request
    ) {
        UserResponse user = authService.register(request);
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .message("Registered successfully")
                .data(user)
                .build());
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @RequestBody AuthLoginRequest request
    ) {
        AuthResponse auth = authService.login(request);
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .message("Logged in successfully")
                .data(auth)
                .build());
    }
}