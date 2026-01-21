package com.dmatch.authservice.services.implementations;

import com.dmatch.authservice.clients.UserClient;
import com.dmatch.authservice.dtos.*;
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

        UserCreateDTO userCreateDTO = UserCreateDTO.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .fullName(request.getFullName())
                .role("USER")
                .build();

        return userClient.createUser(userCreateDTO).getBody();
    }

    @Override
    public AuthResponse login(AuthLoginRequest request) {
        InternalUserResponse user = userClient.getUserByEmail(request.getEmail()).getBody();

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        String role = user.getRoles().isEmpty() ? "USER" : user.getRoles().get(0);
        String token = jwtUtil.generateToken(user.getEmail(), role);

        return AuthResponse.builder()
                .accessToken(token)
                .build();
    }
}
