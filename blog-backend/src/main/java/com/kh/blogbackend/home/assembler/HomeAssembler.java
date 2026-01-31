package com.kh.blogbackend.home.assembler;

import com.kh.blogbackend.home.dto.HomeResponse;
import com.kh.blogbackend.post.entity.Post;
import com.kh.blogbackend.profile.entity.Profile;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class HomeAssembler {

    public HomeResponse toHomeResponse(Profile profile, List<Post> recentPosts) {
        return HomeResponse.builder()
                .hero(toHeroSection(profile))
                .recentPosts(toRecentPostList(recentPosts))
                .build();
    }

    private HomeResponse.HeroSection toHeroSection(Profile profile) {
        if (profile == null) {
            return HomeResponse.HeroSection.builder().build();
        }

        return HomeResponse.HeroSection.builder()
                .blogTitle(profile.getBlogTitle())
                .blogDescription(profile.getBlogDescription())
                .name(profile.getName())
                .bio(profile.getBio())
                .image(profile.getImage())
                .github(profile.getGithub())
                .blog(profile.getBlog())
                .email(profile.getEmail())
                .build();
    }

    private List<HomeResponse.RecentPost> toRecentPostList(List<Post> posts) {
        return posts.stream()
                .map(this::toRecentPost)
                .collect(Collectors.toList());
    }

    private HomeResponse.RecentPost toRecentPost(Post post) {
        return HomeResponse.RecentPost.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .thumbnail(post.getThumbnail())
                .createdAt(post.getCreatedAt())
                .tags(post.getTagList())
                .views(post.getViews())
                .build();
    }
}