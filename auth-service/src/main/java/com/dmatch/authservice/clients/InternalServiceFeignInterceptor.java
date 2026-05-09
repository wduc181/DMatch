package com.dmatch.authservice.clients;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class InternalServiceFeignInterceptor implements RequestInterceptor {

    @Value("${app.internal-service-key}")
    private String internalServiceKey;

    @Override
    public void apply(RequestTemplate template) {
        template.header("X-Internal-Key", internalServiceKey);
    }
}
