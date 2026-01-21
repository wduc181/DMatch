package com.dmatch.authservice.services.interfaces;

import com.dmatch.authservice.dtos.AuthLoginRequest;
import com.dmatch.authservice.dtos.AuthRegisterRequest;
import com.dmatch.authservice.dtos.AuthResponse;
import com.dmatch.authservice.dtos.UserResponse;

public interface AuthService {
    public UserResponse register (AuthRegisterRequest registerRequest);
    public AuthResponse login (AuthLoginRequest loginRequest);
}
