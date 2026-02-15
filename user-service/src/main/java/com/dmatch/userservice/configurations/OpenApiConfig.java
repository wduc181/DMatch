package com.dmatch.userservice.configurations;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

     @Bean
     public OpenAPI customOpenAPI(
               @Value("${openapi.service.title}") String serviceTitle,
               @Value("${openapi.service.version}") String serviceVersion,
               @Value("${openapi.service.url}") String url) {

          return new OpenAPI()
                    .servers(List.of(new Server().url(url)))
                    .info(new Info().title(serviceTitle)
                              .description("API documentation for " + serviceTitle)
                              .version(serviceVersion)
                              .license(new License().name("Apache 2.0").url("http://springdoc.org")));
     }
}
