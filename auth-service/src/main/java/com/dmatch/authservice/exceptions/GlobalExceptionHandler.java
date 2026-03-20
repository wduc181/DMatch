package com.dmatch.authservice.exceptions;

import com.dmatch.authservice.commons.ApiResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
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
@RequiredArgsConstructor
public class GlobalExceptionHandler {
    private final ObjectMapper objectMapper;

    @ExceptionHandler(InvalidBodyException.class)
    public ResponseEntity<ApiResponse<?>> handleInvalidBody(InvalidBodyException e) {
        return ResponseEntity.badRequest().body(ApiResponse.builder()
                .message(e.getMessage())
                .data(null)
                .build());
    }

    @ExceptionHandler(ServiceUnavailableException.class)
    public ResponseEntity<ApiResponse<?>> handleServiceUnavailable(ServiceUnavailableException e) {
        log.warn("Service unavailable: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(ApiResponse.builder()
                .message(e.getMessage())
                .data(null)
                .build());
    }

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<ApiResponse<?>> handleFeignException(FeignException e) {
        HttpStatusCode status = e.status() > 0
                ? HttpStatusCode.valueOf(e.status())
                : HttpStatus.SERVICE_UNAVAILABLE;

        return ResponseEntity.status(status).body(ApiResponse.builder()
                .message(extractFeignMessage(e))
                .data(null)
                .build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleGeneralException(Exception e) {
        log.error("Internal Server Error: ", e);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.builder()
                .message("Internal Server Error. Please contact support.")
                .data(null)
                .build());
    }

    @ExceptionHandler({ MethodArgumentNotValidException.class })
    public ResponseEntity<ApiResponse<?>> handleValidationException(MethodArgumentNotValidException e) {
        List<String> errorMessages = e.getBindingResult().getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .toList();

        return ResponseEntity.badRequest().body(ApiResponse.builder()
                .message(String.join(", ", errorMessages))
                .data(null)
                .build());
    }

    @ExceptionHandler({ PermissionDeniedException.class })
    public ResponseEntity<ApiResponse<?>> handlePermissionDeny(PermissionDeniedException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.builder()
                .message(e.getMessage())
                .data(null)
                .build());
    }

    @ExceptionHandler({ AccessDeniedException.class })
    public ResponseEntity<ApiResponse<?>> handleAccessDenied(AccessDeniedException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.builder()
                .message("Forbidden")
                .data(null)
                .build());
    }

    @ExceptionHandler({ AuthenticationException.class })
    public ResponseEntity<ApiResponse<?>> handleAuthentication(AuthenticationException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.builder()
                .message("Unauthorized")
                .data(null)
                .build());
    }

    private String extractFeignMessage(FeignException exception) {
        String content = exception.contentUTF8();
        if (content == null || content.isBlank()) {
            return exception.getMessage();
        }

        try {
            JsonNode root = objectMapper.readTree(content);
            JsonNode messageNode = root.get("message");
            if (messageNode != null && !messageNode.isNull() && !messageNode.asText().isBlank()) {
                return messageNode.asText();
            }
        } catch (Exception parseException) {
            log.debug("Failed to parse Feign error body", parseException);
        }

        return exception.getMessage();
    }
}
