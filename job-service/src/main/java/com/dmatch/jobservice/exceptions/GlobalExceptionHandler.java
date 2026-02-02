package com.dmatch.jobservice.exceptions;

import com.dmatch.jobservice.commons.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleGeneralException(Exception e) {
        log.error("Internal Server Error: ", e);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.builder()
                .message("Internal Server Error. Please contact support.")
                .data(null)
                .build()
        );
    }

    @ExceptionHandler({DataNotFoundException.class})
    public ResponseEntity<ApiResponse<?>> handleNotFoundException(Exception e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.builder()
                .message(e.getMessage())
                .data(null)
                .build()
        );
    }

    @ExceptionHandler({InvalidBodyException.class, InvalidParamException.class})
    public ResponseEntity<ApiResponse<?>> handleBadRequestException(Exception e) {
        return ResponseEntity.badRequest().body(ApiResponse.builder()
                .message(e.getMessage())
                .data(null)
                .build()
        );
    }

    @ExceptionHandler({PermissionDeniedException.class})
    public ResponseEntity<ApiResponse<?>> handlePermissionException(Exception e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.builder()
                .message(e.getMessage())
                .data(null)
                .build()
        );
    }

    @ExceptionHandler({AccessDeniedException.class})
    public ResponseEntity<ApiResponse<?>> handleAccessDenied(AccessDeniedException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.builder()
                .message("Forbidden")
                .data(null)
                .build()
        );
    }

    @ExceptionHandler({AuthenticationException.class})
    public ResponseEntity<ApiResponse<?>> handleAuthentication(AuthenticationException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.builder()
                .message("Unauthorized")
                .data(null)
                .build()
        );
    }

    @ExceptionHandler({MethodArgumentNotValidException.class})
    public ResponseEntity<ApiResponse<?>> handleValidationException(MethodArgumentNotValidException e) {
        List<String> errorMessages = e.getBindingResult().getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .toList();

        return ResponseEntity.badRequest().body(ApiResponse.builder()
                .message(String.join(", ", errorMessages))
                .data(null)
                .build()
        );
    }
}