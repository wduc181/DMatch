package com.dmatch.authservice.clients;

import com.dmatch.authservice.commons.ApiResponse;
import com.dmatch.authservice.dtos.UserCreateRequest;
import com.dmatch.authservice.dtos.UserResponse;
import com.dmatch.authservice.dtos.InternalUserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "user-service", path = "/internal/users")
public interface UserClient {

    @PostMapping
        ResponseEntity<ApiResponse<UserResponse>> createUser(
            @RequestBody UserCreateRequest userCreateRequest
    );

    @GetMapping("/by-email")
        ResponseEntity<ApiResponse<InternalUserResponse>> getUserByEmail(
            @RequestParam("email") String email
    );
}