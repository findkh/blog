package com.kh.blogbackend.post.dto;

import com.kh.blogbackend.post.entity.Post;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
public class PublicPostResponse {

    private Long id;
    private Long menuId;
    private String title;
    private String content;
    private String thumbnail;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private PostNavDto prevPost;
    private PostNavDto nextPost;

    // ===== 상세 조회용 (이전/다음 포함) =====
    public static PublicPostResponse from(
            Post post,
            PostNavDto prevPost,
            PostNavDto nextPost
    ) {
        PublicPostResponse response = from(post);
        response.prevPost = prevPost;
        response.nextPost = nextPost;
        return response;
    }

    // ===== 목록 / 공통 =====
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

    private PublicPostResponse(
            Long id,
            Long menuId,
            String title,
            String content,
            String thumbnail,
            List<String> tags,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
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
