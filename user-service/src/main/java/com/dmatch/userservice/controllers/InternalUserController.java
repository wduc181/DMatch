package com.dmatch.userservice.controllers;

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
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody UserCreateRequest userCreateRequest
    ) {
        return ResponseEntity.ok(userService.createUser(userCreateRequest));
    }

    @GetMapping("/by-email")
    public ResponseEntity<InternalUserResponse> getUserByEmail(
            @RequestParam String email
    ) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping("/{id}/company")
    public ResponseEntity<UserResponse> addCompanyRoleToUser(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(userService.addCompanyRoleToUser(id));
    }
}
