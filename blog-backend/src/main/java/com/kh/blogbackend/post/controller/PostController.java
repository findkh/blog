package com.kh.blogbackend.post.controller;


import com.kh.blogbackend.post.dto.PublicPostResponse;
import com.kh.blogbackend.post.entity.Post;
import com.kh.blogbackend.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/post")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping("/board/{menuId}")
    public List<PublicPostResponse> getPostsByBoard(@PathVariable Long menuId) {
        List<Post> posts = postService.findByMenu(menuId);
        return posts.stream()
                .map(PublicPostResponse::from)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public PublicPostResponse getPost(@PathVariable Long id) {
        Post post = postService.getPostForPublic(id);
        return PublicPostResponse.from(post);
    }
}
