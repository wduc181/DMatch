package com.dmatch.authservice.dtos;

import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class AuthLoginRequest {
    private String email;
    private String password;
}
