// AdminPostResponse.java
package com.kh.blogbackend.post.dto;

import com.kh.blogbackend.post.entity.Post;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class AdminPostResponse {

    private Long id;
    private Long menuId;
    private String title;
    private String content;
    private boolean published;
    private String thumbnail;
    private Long views;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AdminPostResponse from(Post post) {
        return new AdminPostResponse(
                post.getId(),
                post.getMenu().getId(),
                post.getTitle(),
                post.getContent(),
                post.isPublished(),
                post.getThumbnail(),
                post.getViews(),
                post.getTagList(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }

    private AdminPostResponse(Long id, Long menuId, String title, String content,
            boolean published, String thumbnail, Long views,
            List<String> tags, LocalDateTime createdAt,
            LocalDateTime updatedAt) {
        this.id = id;
        this.menuId = menuId;
        this.title = title;
        this.content = content;
        this.published = published;
        this.thumbnail = thumbnail;
        this.views = views;
        this.tags = tags;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}