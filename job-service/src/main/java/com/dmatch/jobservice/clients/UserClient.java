package com.dmatch.jobservice.clients;

import com.dmatch.jobservice.commons.ApiResponse;
import com.dmatch.jobservice.dtos.InternalUserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "user-service", path = "${app.internal-prefix}/users", fallback = UserClientFallback.class)
public interface UserClient {

    @GetMapping("/by-email")
    ResponseEntity<ApiResponse<InternalUserResponse>> getUserByEmail(
            @RequestParam String email);
}
