package org.example.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Email or Username is required")
        String usernameOrEmail,

        @NotBlank(message = "Password is required")
        String password
) {
}