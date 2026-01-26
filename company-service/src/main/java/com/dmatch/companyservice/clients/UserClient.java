package com.dmatch.companyservice.clients;

import com.dmatch.companyservice.dtos.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "user-service", path = "/internal/users")
public interface UserClient {
    @GetMapping("/{id}")
    ResponseEntity<UserResponse> getUserById(
            @PathVariable Long id
    );

    @PostMapping("/{id}/company")
    ResponseEntity<UserResponse> addCompanyRoleToUser(
            @PathVariable Long id
    );

    @DeleteMapping("/{id}/company")
    ResponseEntity<UserResponse> deleteCompanyRoleToUser(
            @PathVariable Long id
    );
}
