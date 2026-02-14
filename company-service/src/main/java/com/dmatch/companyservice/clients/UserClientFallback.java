package com.dmatch.companyservice.clients;

import com.dmatch.companyservice.commons.ApiResponse;
import com.dmatch.companyservice.dtos.InternalUserResponse;
import com.dmatch.companyservice.dtos.UserResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class UserClientFallback implements UserClient {

     @Override
     public ResponseEntity<ApiResponse<UserResponse>> getUserById(Long id) {
          log.warn("Fallback: User Service unavailable - getUserById({})", id);
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

     @Override
     public ResponseEntity<ApiResponse<UserResponse>> addCompanyRoleToUser(Long id) {
          log.warn("Fallback: User Service unavailable - addCompanyRoleToUser({})", id);
          ApiResponse<UserResponse> response = ApiResponse.<UserResponse>builder()
                    .message("User Service unavailable")
                    .data(null)
                    .build();
          return ResponseEntity.ok(response);
     }

     @Override
     public ResponseEntity<ApiResponse<UserResponse>> deleteCompanyRoleToUser(Long id) {
          log.warn("Fallback: User Service unavailable - deleteCompanyRoleToUser({})", id);
          ApiResponse<UserResponse> response = ApiResponse.<UserResponse>builder()
                    .message("User Service unavailable")
                    .data(null)
                    .build();
          return ResponseEntity.ok(response);
     }
}
