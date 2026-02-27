package com.thalir.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.thalir.backend.security.services.UserDetailsServiceImpl; 

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableMethodSecurity
public class WebSecurityConfig {

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    // authentication entry point is handled by default; no JWT needed

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true); // allow cookies for session-based auth
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                // we use HTTP session for authentication; security context stored automatically
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(auth -> auth
                        // allow all OPTIONS (CORS preflight) on any path
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

                        // ── Public ────────────────────────────────────────────────
                        .requestMatchers("GET", "POST", "OPTIONS", "/api/auth/**").permitAll()
                        .requestMatchers("/api/test/**").permitAll()

                        // ════════════════════════════════════════════════════════
                        // FERTILIZER MARKETPLACE (Provider → Farmer)
                        // ════════════════════════════════════════════════════════

                        // Products: GET is public, mutations need PROVIDER
                        .requestMatchers("GET", "/api/fertilizer/products/**").permitAll()
                        .requestMatchers("POST", "/api/fertilizer/products").hasRole("PROVIDER")
                        .requestMatchers("PUT", "/api/fertilizer/products/**").hasRole("PROVIDER")
                        .requestMatchers("PATCH", "/api/fertilizer/products/**").hasAnyRole("PROVIDER", "ADMIN")
                        .requestMatchers("DELETE", "/api/fertilizer/products/**").hasAnyRole("PROVIDER", "ADMIN")
                        .requestMatchers("GET", "/api/fertilizer/products/my").hasRole("PROVIDER")

                        // Cart: FARMER only
                        .requestMatchers("/api/fertilizer/cart/**").hasRole("FARMER")

                        // Orders: FARMER routes first (more specific), then PROVIDER/ADMIN
                        .requestMatchers("/api/fertilizer/orders/checkout").hasRole("FARMER")
                        .requestMatchers("/api/fertilizer/orders/my/**").hasRole("FARMER")
                        .requestMatchers("/api/fertilizer/orders/**").hasAnyRole("ADMIN", "PROVIDER")

                        // ════════════════════════════════════════════════════════
                        // FARM MARKETPLACE (Farmer → Consumer)
                        // ════════════════════════════════════════════════════════

                        // Products: GET is public, mutations need FARMER
                        .requestMatchers("GET", "/api/farm/products/**").permitAll()
                        .requestMatchers("POST", "/api/farm/products").hasRole("FARMER")
                        .requestMatchers("PUT", "/api/farm/products/**").hasRole("FARMER")
                        .requestMatchers("PATCH", "/api/farm/products/**").hasAnyRole("FARMER", "ADMIN")
                        .requestMatchers("DELETE", "/api/farm/products/**").hasAnyRole("FARMER", "ADMIN")
                        .requestMatchers("GET", "/api/farm/products/my").hasRole("FARMER")

                        // Cart: CONSUMER only
                        .requestMatchers("/api/farm/cart/**").hasRole("CONSUMER")

                        // Orders: CONSUMER routes first, then FARMER
                        .requestMatchers("/api/farm/orders/checkout").hasRole("CONSUMER")
                        .requestMatchers("/api/farm/orders/my/**").hasRole("CONSUMER")
                        .requestMatchers("/api/farm/orders/received").hasRole("FARMER")
                        .requestMatchers("/api/farmer/orders").hasRole("FARMER")
                        .requestMatchers("PATCH", "/api/farm/orders/*/status").hasRole("FARMER")

                        // ── Anything else requires authentication ─────────────────
                        .anyRequest().authenticated());

        http.authenticationProvider(authenticationProvider());
        // JWT filter removed; authentication handled via session

        return http.build();
    }
}