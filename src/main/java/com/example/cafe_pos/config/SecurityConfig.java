package com.example.cafe_pos.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())   // 🔥 مهم جدا
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/system/invoiceCounter").permitAll()
            .requestMatchers("/api/orders/**").permitAll() // 👈 ADD THIS
            .requestMatchers("/admin").hasRole("admin")
            .requestMatchers("/pos").hasRole("cashier")
            .anyRequest().permitAll()
        )
        .oauth2Login();

    return http.build();
}
}