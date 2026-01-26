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
    private String thumbnail; // 1. 필드 추가
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PublicPostResponse from(Post post) {
        return new PublicPostResponse(
                post.getId(),
                post.getMenu().getId(),
                post.getTitle(),
                post.getContent(),
                post.getThumbnail(), // 2. 엔티티에서 데이터 추출
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }

    // 3. 생성자 파라미터 및 할당 추가
    private PublicPostResponse(Long id, Long menuId, String title, String content,
                               String thumbnail, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.menuId = menuId;
        this.title = title;
        this.content = content;
        this.thumbnail = thumbnail;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}