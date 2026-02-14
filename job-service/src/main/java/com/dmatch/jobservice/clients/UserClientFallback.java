package com.dmatch.jobservice.clients;

import com.dmatch.jobservice.commons.ApiResponse;
import com.dmatch.jobservice.dtos.InternalUserResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class UserClientFallback implements UserClient {

     @Override
     public ResponseEntity<ApiResponse<InternalUserResponse>> getUserByEmail(String email) {
          log.warn("Fallback: User Service không khả dụng - getUserByEmail({})", email);
          ApiResponse<InternalUserResponse> response = ApiResponse.<InternalUserResponse>builder()
                    .message("User Service không khả dụng")
                    .data(null)
                    .build();
          return ResponseEntity.ok(response);
     }
}
