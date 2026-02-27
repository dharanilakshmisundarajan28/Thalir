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
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.thalir.backend.security.jwt.AuthEntryPointJwt;
import com.thalir.backend.security.jwt.AuthTokenFilter;
import com.thalir.backend.security.services.UserDetailsServiceImpl;

@Configuration
@EnableMethodSecurity
public class WebSecurityConfig {

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
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
                .cors(cors -> {
                })
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // ── Public ────────────────────────────────────────────────
                        .requestMatchers("/api/auth/**").permitAll()
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
                        .requestMatchers("PATCH", "/api/farm/orders/*/status").hasRole("FARMER")

                        // ── Anything else requires authentication ─────────────────
                        .anyRequest().authenticated());

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}