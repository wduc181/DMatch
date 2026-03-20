package com.dmatch.authservice.services.implementations;

import com.dmatch.authservice.clients.UserClient;
import com.dmatch.authservice.commons.ApiResponse;
import com.dmatch.authservice.dtos.*;
import com.dmatch.authservice.entities.AuthCredential;
import com.dmatch.authservice.exceptions.InvalidBodyException;
import com.dmatch.authservice.exceptions.PermissionDeniedException;
import com.dmatch.authservice.exceptions.ServiceUnavailableException;
import com.dmatch.authservice.repositories.AuthCredentialRepository;
import com.dmatch.authservice.services.interfaces.AuthService;
import com.dmatch.authservice.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserClient userClient;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthCredentialRepository authCredentialRepository;

    @Override
    @Transactional
    public UserResponse register(AuthRegisterRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        if (authCredentialRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new InvalidBodyException("Email already exists");
        }

        AuthCredential credential = authCredentialRepository.save(AuthCredential.builder()
                .email(normalizedEmail)
                .hashedPassword(passwordEncoder.encode(request.getPassword()))
                .build());

        try {
            ApiResponse<UserResponse> response = userClient.createUser(
                    new UserCreateRequest(normalizedEmail, request.getFullName())
            ).getBody();

            if (response == null || response.getData() == null) {
                throw new ServiceUnavailableException("User Service unavailable. Please try again later.");
            }
            return response.getData();
        } catch (RuntimeException exception) {
            authCredentialRepository.deleteById(credential.getId());
            throw exception;
        }
    }

    @Override
    public AuthResponse login(AuthLoginRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        AuthCredential credential = authCredentialRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new PermissionDeniedException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), credential.getHashedPassword())) {
            throw new PermissionDeniedException("Invalid username or password");
        }

        ApiResponse<InternalUserResponse> response = userClient.getUserByEmail(normalizedEmail).getBody();
        InternalUserResponse user = response == null ? null : response.getData();

        if (user == null) {
            throw new ServiceUnavailableException("User Service unavailable. Please try again later.");
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

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
