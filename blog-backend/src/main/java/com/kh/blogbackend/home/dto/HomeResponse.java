package com.kh.blogbackend.home.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HomeResponse {

    private HeroSection hero;
    private List<RecentPost> recentPosts;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HeroSection {
        private String blogTitle;
        private String blogDescription;
        private String name;
        private String bio;
        private String image;
        private String github;
        private String blog;
        private String email;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentPost {
        private Long id;
        private String title;
        private String content;
        private String thumbnail;
        private LocalDateTime createdAt;
        private List<String> tags;
        private Long views;
    }
}