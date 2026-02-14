package com.dmatch.authservice.exceptions;

public class ServiceUnavailableException extends RuntimeException {
     public ServiceUnavailableException(String message) {
          super(message);
     }
}
