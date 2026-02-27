package com.thalir.backend.payload.response;

import lombok.Data;
import java.util.List;

@Data
public class LoginResponse {
    private Long userId;
    private String username;
    private List<String> roles;
    private String message;
}
