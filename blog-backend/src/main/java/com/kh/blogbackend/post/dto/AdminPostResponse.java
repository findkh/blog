package com.kh.blogbackend.post.dto;

import com.kh.blogbackend.post.entity.Post;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class AdminPostResponse {

    private Long id;
    private Long menuId;
    private String title;
    private String content;
    private boolean published;
    private Long views;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AdminPostResponse from(Post post) {
        return new AdminPostResponse(
                post.getId(),
                post.getMenu().getId(),
                post.getTitle(),
                post.getContent(),
                post.isPublished(),
                post.getViews(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }

    private AdminPostResponse(Long id, Long menuId, String title, String content,
                              boolean published, Long views, LocalDateTime createdAt,
                              LocalDateTime updatedAt) {
        this.id = id;
        this.menuId = menuId;
        this.title = title;
        this.content = content;
        this.published = published;
        this.views = views;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
