package com.dmatch.reviewservice.clients;

import com.dmatch.reviewservice.commons.ApiResponse;
import com.dmatch.reviewservice.dtos.UserSummaryResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class UserServiceClientFallback implements UserServiceClient {

     @Override
     public ApiResponse<UserSummaryResponse> getUserById(Long id) {
          log.warn("Fallback: User Service unavailable - getUserById({})", id);
          return ApiResponse.<UserSummaryResponse>builder()
                    .message("User Service unavailable")
                    .data(null)
                    .build();
     }

     @Override
     public ApiResponse<UserSummaryResponse> getUserByEmail(String email) {
          log.warn("Fallback: User Service unavailable - getUserByEmail({})", email);
          return ApiResponse.<UserSummaryResponse>builder()
                    .message("User Service unavailable")
                    .data(null)
                    .build();
     }
}
