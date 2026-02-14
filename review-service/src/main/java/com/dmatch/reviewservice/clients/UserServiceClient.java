package com.dmatch.reviewservice.clients;

import com.dmatch.reviewservice.commons.ApiResponse;
import com.dmatch.reviewservice.dtos.UserSummaryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "USER-SERVICE", fallback = UserServiceClientFallback.class)
public interface UserServiceClient {

    @GetMapping("${app.internal-prefix}/users/{id}")
    ApiResponse<UserSummaryResponse> getUserById(@PathVariable("id") Long id);

    @GetMapping("${app.internal-prefix}/users/by-email")
    ApiResponse<UserSummaryResponse> getUserByEmail(@RequestParam("email") String email);
}
