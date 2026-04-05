package com.foodorder.backend.dto;

import com.foodorder.backend.model.Role;

public class AuthResponse {
     String token;
     String fullName;
     String email;
     Role role;

    public AuthResponse(String token, String fullName, String email, Role role) {
        this.token = token;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }
}
