package com.dmatch.companyservice.clients;

import com.dmatch.companyservice.commons.ApiResponse;
import com.dmatch.companyservice.dtos.InternalUserResponse;
import com.dmatch.companyservice.dtos.UserResponse;
import com.dmatch.companyservice.exceptions.ServiceUnavailableException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class UserClientFallback implements UserClient {

     @Override
     public ResponseEntity<ApiResponse<UserResponse>> getUserById(Long id) {
          log.warn("Fallback: User Service unavailable - getUserById({})", id);
          throw new ServiceUnavailableException("User Service unavailable. Please try again later.");
     }

     @Override
     public ResponseEntity<ApiResponse<InternalUserResponse>> getUserByEmail(String email) {
          log.warn("Fallback: User Service unavailable - getUserByEmail({})", email);
          throw new ServiceUnavailableException("User Service unavailable. Please try again later.");
     }

     @Override
     public ResponseEntity<ApiResponse<UserResponse>> addCompanyRoleToUser(Long id) {
          log.warn("Fallback: User Service unavailable - addCompanyRoleToUser({})", id);
          throw new ServiceUnavailableException("User Service unavailable. Please try again later.");
     }

     @Override
     public ResponseEntity<ApiResponse<UserResponse>> deleteCompanyRoleToUser(Long id) {
          log.warn("Fallback: User Service unavailable - deleteCompanyRoleToUser({})", id);
          throw new ServiceUnavailableException("User Service unavailable. Please try again later.");
     }
}
