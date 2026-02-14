package com.dmatch.authservice.services.implementations;

import com.dmatch.authservice.clients.UserClient;
import com.dmatch.authservice.commons.ApiResponse;
import com.dmatch.authservice.dtos.*;
import com.dmatch.authservice.exceptions.PermissionDeniedException;
import com.dmatch.authservice.exceptions.ServiceUnavailableException;
import com.dmatch.authservice.services.interfaces.AuthService;
import com.dmatch.authservice.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserClient userClient;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public UserResponse register(AuthRegisterRequest request) {
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        UserCreateRequest userCreateRequest = UserCreateRequest.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .fullName(request.getFullName())
                .role("USER")
                .build();

        ApiResponse<UserResponse> response = userClient.createUser(userCreateRequest).getBody();
        if (response == null || response.getData() == null) {
            throw new ServiceUnavailableException("User Service unavailable. Please try again later.");
        }
        return response.getData();
    }

    @Override
    public AuthResponse login(AuthLoginRequest request) {
        ApiResponse<InternalUserResponse> response = userClient.getUserByEmail(request.getEmail()).getBody();
        InternalUserResponse user = response == null ? null : response.getData();

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new PermissionDeniedException("Invalid username or password");
        }

        var roles = user.getRoles();
        if (roles == null || roles.isEmpty()) {
            roles = java.util.List.of("USER");
        }
        String token = jwtUtil.generateToken(user.getEmail(), roles);

        return AuthResponse.builder()
                .accessToken(token)
                .build();
    }
}
