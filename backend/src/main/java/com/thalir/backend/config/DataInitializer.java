package com.thalir.backend.config;

import com.thalir.backend.model.ERole;
import com.thalir.backend.model.Role;
import com.thalir.backend.model.User;
import com.thalir.backend.repository.RoleRepository;
import com.thalir.backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DataInitializer {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        try {
            // Initialize roles
            initializeRole(ERole.ROLE_FARMER);
            initializeRole(ERole.ROLE_CONSUMER);
            initializeRole(ERole.ROLE_PROVIDER);
            initializeRole(ERole.ROLE_ADMIN);

            // Initialize default users
            initializeUser("admin", "admin@thalir.com", "password123", ERole.ROLE_ADMIN);
            initializeUser("farmer", "farmer@thalir.com", "password123", ERole.ROLE_FARMER);
            initializeUser("consumer", "consumer@thalir.com", "password123", ERole.ROLE_CONSUMER);
            initializeUser("provider", "provider@thalir.com", "password123", ERole.ROLE_PROVIDER);

            System.out.println("✅ Database initialized with default roles and users");
        } catch (Exception e) {
            System.err.println("⚠️ Database initialization skipped (data may already exist): " + e.getMessage());
        }
    }

    private void initializeRole(ERole roleName) {
        try {
            if (roleRepository.findByName(roleName).isEmpty()) {
                Role role = new Role();
                role.setName(roleName);
                roleRepository.save(role);
                System.out.println("✅ Created role: " + roleName);
            } else {
                System.out.println("ℹ️ Role already exists: " + roleName);
            }
        } catch (Exception e) {
            System.err.println("⚠️ Could not initialize role " + roleName + ": " + e.getMessage());
        }
    }

    private void initializeUser(String username, String email, String password, ERole roleName) {
        try {
            if (!userRepository.existsByUsername(username)) {
                User user = new User(username, email, passwordEncoder.encode(password));
                Role role = roleRepository.findByName(roleName)
                        .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
                user.setRoles(Set.of(role));
                userRepository.save(user);
                System.out.println("✅ Created user: " + username + " with role: " + roleName);
            } else {
                System.out.println("ℹ️ User already exists: " + username);
            }
        } catch (Exception e) {
            System.err.println("⚠️ Could not initialize user " + username + ": " + e.getMessage());
        }
    }
}
