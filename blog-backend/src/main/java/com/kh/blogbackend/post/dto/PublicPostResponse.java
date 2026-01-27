// PublicPostResponse.java
package com.kh.blogbackend.post.dto;

import com.kh.blogbackend.post.entity.Post;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class PublicPostResponse {

    private Long id;
    private Long menuId;
    private String title;
    private String content;
    private String thumbnail;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PublicPostResponse from(Post post) {
        return new PublicPostResponse(
                post.getId(),
                post.getMenu().getId(),
                post.getTitle(),
                post.getContent(),
                post.getThumbnail(),
                post.getTagList(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }

    private PublicPostResponse(Long id, Long menuId, String title, String content,
            String thumbnail, List<String> tags,
            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.menuId = menuId;
        this.title = title;
        this.content = content;
        this.thumbnail = thumbnail;
        this.tags = tags;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}