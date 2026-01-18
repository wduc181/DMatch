package com.dmatch.userservice.controllers;

import com.dmatch.userservice.commons.ApiResponse;
import com.dmatch.userservice.dtos.UserCreateDTO;
import com.dmatch.userservice.reponses.InternalUserResponse;
import com.dmatch.userservice.reponses.UserResponse;
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
            @Valid @RequestBody UserCreateDTO userCreateDTO
    ) {
        UserResponse userResponse = userService.createUser(userCreateDTO);
        return ResponseEntity.ok().body(ApiResponse.<UserResponse>builder()
                .message("User Created")
                .data(userResponse)
                .build()
        );
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
}
