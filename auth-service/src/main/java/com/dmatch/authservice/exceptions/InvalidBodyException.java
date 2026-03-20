package com.dmatch.authservice.exceptions;

public class InvalidBodyException extends RuntimeException {
    public InvalidBodyException(String message) {
        super(message);
    }
}