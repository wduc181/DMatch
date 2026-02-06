package com.dmatch.companyservice.clients;

import com.dmatch.companyservice.commons.ApiResponse;
import com.dmatch.companyservice.dtos.InternalUserResponse;
import com.dmatch.companyservice.dtos.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "user-service", path = "/internal/users")
public interface UserClient {
    @GetMapping("/{id}")
    ResponseEntity<ApiResponse<UserResponse>> getUserById(
            @PathVariable Long id
    );

    @GetMapping("/by-email")
    ResponseEntity<ApiResponse<InternalUserResponse>> getUserByEmail(
            @RequestParam String email
    );

    @PostMapping("/{id}/company")
    ResponseEntity<ApiResponse<UserResponse>> addCompanyRoleToUser(
            @PathVariable Long id
    );

    @DeleteMapping("/{id}/company")
    ResponseEntity<ApiResponse<UserResponse>> deleteCompanyRoleToUser(
            @PathVariable Long id
    );
}
