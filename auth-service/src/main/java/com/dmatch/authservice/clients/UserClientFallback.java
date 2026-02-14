package com.dmatch.authservice.clients;

import com.dmatch.authservice.commons.ApiResponse;
import com.dmatch.authservice.dtos.UserCreateRequest;
import com.dmatch.authservice.dtos.UserResponse;
import com.dmatch.authservice.dtos.InternalUserResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class UserClientFallback implements UserClient {

     @Override
     public ResponseEntity<ApiResponse<UserResponse>> createUser(UserCreateRequest userCreateRequest) {
          log.warn("Fallback: User Service unavailable - createUser");
          ApiResponse<UserResponse> response = ApiResponse.<UserResponse>builder()
                    .message("User Service unavailable")
                    .data(null)
                    .build();
          return ResponseEntity.ok(response);
     }

     @Override
     public ResponseEntity<ApiResponse<InternalUserResponse>> getUserByEmail(String email) {
          log.warn("Fallback: User Service unavailable - getUserByEmail({})", email);
          ApiResponse<InternalUserResponse> response = ApiResponse.<InternalUserResponse>builder()
                    .message("User Service unavailable")
                    .data(null)
                    .build();
          return ResponseEntity.ok(response);
     }
}
