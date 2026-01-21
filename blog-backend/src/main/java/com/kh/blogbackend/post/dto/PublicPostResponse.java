package com.kh.blogbackend.post.dto;

import com.kh.blogbackend.post.entity.Post;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class PublicPostResponse {

    private Long id;
    private Long menuId;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PublicPostResponse from(Post post) {
        return new PublicPostResponse(
                post.getId(),
                post.getMenu().getId(),
                post.getTitle(),
                post.getContent(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }

    private PublicPostResponse(Long id, Long menuId, String title, String content,
                               LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.menuId = menuId;
        this.title = title;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
