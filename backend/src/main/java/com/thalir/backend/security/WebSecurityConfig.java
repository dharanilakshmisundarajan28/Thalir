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
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
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

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",
                "http://localhost:3000",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Set-Cookie"));
        configuration.setAllowCredentials(true);
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

    /**
     * Explicitly declare the SecurityContextRepository so Spring Security
     * correctly saves the SecurityContext to the HTTP session after login.
     */
    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                // Tell Spring Security to store/load the SecurityContext from the session
                .securityContext(ctx -> ctx.securityContextRepository(securityContextRepository()))
                .authorizeHttpRequests(auth -> auth

                        // ── CORS preflight ────────────────────────────────────────────
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

                        // ── Auth endpoints (public) ───────────────────────────────────
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/test/**").permitAll()

                        // ════════════════════════════════════════════════════════════
                        // FERTILIZER MARKETPLACE (Provider → Farmer)
                        // ════════════════════════════════════════════════════════════

                        // Public: browse fertilizer products (no auth needed)
                        .requestMatchers(org.springframework.http.HttpMethod.GET,
                                "/api/fertilizer/products")
                        .permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET,
                                "/api/fertilizer/products/search")
                        .permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET,
                                "/api/fertilizer/products/category/**")
                        .permitAll()

                        // Provider: manage their own products
                        .requestMatchers(org.springframework.http.HttpMethod.GET,
                                "/api/fertilizer/products/my")
                        .hasRole("PROVIDER")
                        .requestMatchers(org.springframework.http.HttpMethod.POST,
                                "/api/fertilizer/products")
                        .hasRole("PROVIDER")
                        .requestMatchers(org.springframework.http.HttpMethod.PUT,
                                "/api/fertilizer/products/**")
                        .hasRole("PROVIDER")
                        .requestMatchers(org.springframework.http.HttpMethod.PATCH,
                                "/api/fertilizer/products/**")
                        .hasAnyRole("PROVIDER", "ADMIN")
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE,
                                "/api/fertilizer/products/**")
                        .hasAnyRole("PROVIDER", "ADMIN")

                        // Catch-all: any other GET on a specific product (by ID) — public
                        .requestMatchers(org.springframework.http.HttpMethod.GET,
                                "/api/fertilizer/products/**")
                        .permitAll()

                        // Farmer: fertilizer cart
                        .requestMatchers("/api/fertilizer/cart/**").hasRole("FARMER")

                        // Farmer: own fertilizer orders
                        .requestMatchers("/api/fertilizer/orders/checkout").hasRole("FARMER")
                        .requestMatchers("/api/fertilizer/orders/my/**").hasRole("FARMER")

                        // Provider/Admin: view and update all fertilizer orders
                        .requestMatchers(org.springframework.http.HttpMethod.GET,
                                "/api/fertilizer/orders")
                        .hasAnyRole("ADMIN", "PROVIDER")
                        .requestMatchers(org.springframework.http.HttpMethod.PATCH,
                                "/api/fertilizer/orders/**")
                        .hasAnyRole("ADMIN", "PROVIDER")

                        // ════════════════════════════════════════════════════════════
                        // FARM MARKETPLACE (Farmer → Consumer)
                        // ════════════════════════════════════════════════════════════

                        // Public: browse farm products
                        .requestMatchers(org.springframework.http.HttpMethod.GET,
                                "/api/farm/products")
                        .permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET,
                                "/api/farm/products/search")
                        .permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET,
                                "/api/farm/products/category/**")
                        .permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET,
                                "/api/farm/products/farmer/**")
                        .permitAll()

                        // Farmer: manage their own produce (/my must come before /**)
                        .requestMatchers(org.springframework.http.HttpMethod.GET,
                                "/api/farm/products/my")
                        .hasRole("FARMER")
                        .requestMatchers(org.springframework.http.HttpMethod.POST,
                                "/api/farm/products")
                        .hasRole("FARMER")
                        .requestMatchers(org.springframework.http.HttpMethod.PUT,
                                "/api/farm/products/**")
                        .hasRole("FARMER")
                        .requestMatchers(org.springframework.http.HttpMethod.PATCH,
                                "/api/farm/products/**")
                        .hasAnyRole("FARMER", "ADMIN")
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE,
                                "/api/farm/products/**")
                        .hasAnyRole("FARMER", "ADMIN")

                        // Catch-all: GET by ID is public
                        .requestMatchers(org.springframework.http.HttpMethod.GET,
                                "/api/farm/products/**")
                        .permitAll()

                        // Consumer: farm cart
                        .requestMatchers("/api/farm/cart/**").hasRole("CONSUMER")

                        // Consumer: own farm orders
                        .requestMatchers("/api/farm/orders/checkout").hasRole("CONSUMER")
                        .requestMatchers("/api/farm/orders/my/**").hasRole("CONSUMER")

                        // Farmer: received orders and status updates
                        .requestMatchers("/api/farm/orders/received").hasRole("FARMER")
                        .requestMatchers("/api/farmer/orders").hasRole("FARMER")
                        .requestMatchers(org.springframework.http.HttpMethod.PATCH,
                                "/api/farm/orders/**")
                        .hasRole("FARMER")

                        // ── Catch-all: everything else needs authentication ────────────
                        .anyRequest().authenticated());

        http.authenticationProvider(authenticationProvider());

        return http.build();
    }
}