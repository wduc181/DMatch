package com.dmatch.authservice.clients;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class InternalServiceFeignInterceptor implements RequestInterceptor {

    @Value("${app.internal-service-key}")
    private String internalServiceKey;

    @PostConstruct
    void validateInternalServiceKey() {
        if (internalServiceKey == null || internalServiceKey.isBlank()) {
            throw new IllegalStateException("app.internal-service-key must be configured");
        }
    }

    @Override
    public void apply(RequestTemplate template) {
        template.header("X-Internal-Key", internalServiceKey);
    }
}
