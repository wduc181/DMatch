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
          log.warn("Fallback: User Service không khả dụng - getUserById({})", id);
          return ApiResponse.<UserSummaryResponse>builder()
                    .message("User Service không khả dụng")
                    .data(UserSummaryResponse.builder()
                              .id(id)
                              .email("unavailable")
                              .fullName("User Info Unavailable")
                              .status("UNKNOWN")
                              .build())
                    .build();
     }

     @Override
     public ApiResponse<UserSummaryResponse> getUserByEmail(String email) {
          log.warn("Fallback: User Service không khả dụng - getUserByEmail({})", email);
          return ApiResponse.<UserSummaryResponse>builder()
                    .message("User Service không khả dụng")
                    .data(UserSummaryResponse.builder()
                              .id(null)
                              .email(email)
                              .fullName("User Info Unavailable")
                              .status("UNKNOWN")
                              .build())
                    .build();
     }
}
