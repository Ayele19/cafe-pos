package com.example.cafe_pos.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve all images from uploads/menu folder
        registry.addResourceHandler("/images/menu/**")
                .addResourceLocations("file:C:/Users/hp/projects/cafe_pos/cafe_pos/uploads/menu/");
    }
}
