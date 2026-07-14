package com.example.cafe_pos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@SpringBootApplication
@EnableMethodSecurity 
public class CafeposApplication {

	public static void main(String[] args) {
		SpringApplication.run(CafeposApplication.class, args);
	}

}
