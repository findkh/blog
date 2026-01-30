package com.kh.blogbackend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "blog")
public class BlogProperties {
    private String profileImageUrl;
    private String imageUrl;
    private String imagePath;
}
