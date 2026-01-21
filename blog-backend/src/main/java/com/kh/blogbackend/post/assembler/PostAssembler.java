package com.kh.blogbackend.post.assembler;


import com.kh.blogbackend.menu.repository.MenuRepository;
import com.kh.blogbackend.post.dto.PostRequest;
import com.kh.blogbackend.post.entity.Post;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class PostAssembler {

    private final MenuRepository menuRepository;

    public Post toEntity(PostRequest request) {
        return Post.builder()
                .menu(menuRepository.findById(request.getMenuId())
                        .orElseThrow(() -> new IllegalArgumentException("Menu not found: " + request.getMenuId())))
                .title(request.getTitle())
                .content(request.getContent())
                .published(request.isPublished())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .views(0L)
                .build();
    }

    public void updateEntity(Post post, PostRequest request) {
        post.setMenu(menuRepository.findById(request.getMenuId())
                .orElseThrow(() -> new IllegalArgumentException("Menu not found: " + request.getMenuId())));
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setPublished(request.isPublished());
        post.setUpdatedAt(LocalDateTime.now());
    }
}
