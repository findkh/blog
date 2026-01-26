package com.kh.blogbackend.post.controller;


import com.kh.blogbackend.post.dto.PublicPostResponse;
import com.kh.blogbackend.post.entity.Post;
import com.kh.blogbackend.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping("/board/{menuId}")
    public Page<PublicPostResponse> getPostsByBoard(
            @PathVariable Long menuId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return postService.findByMenuPaged(menuId, pageable).map(PublicPostResponse::from);
    }

    @GetMapping("/{id}")
    public PublicPostResponse getPost(@PathVariable Long id) {
        Post post = postService.getPostForPublic(id);
        return PublicPostResponse.from(post);
    }
}
