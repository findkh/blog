package com.kh.blogbackend.post.controller;


import com.kh.blogbackend.config.BlogProperties;
import com.kh.blogbackend.post.dto.AdminPostResponse;
import com.kh.blogbackend.post.dto.ImageUploadResponse;
import com.kh.blogbackend.post.dto.PostRequest;
import com.kh.blogbackend.post.entity.Post;
import com.kh.blogbackend.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/admin/post")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminPostController {

    private final PostService postService;

    @PostMapping
    public AdminPostResponse create(@RequestBody PostRequest request) {
        Post post = postService.create(request);
        return AdminPostResponse.from(post);
    }

    @PutMapping("/{id}")
    public AdminPostResponse update(@PathVariable Long id, @RequestBody PostRequest request) {
        Post post = postService.update(id, request);
        return AdminPostResponse.from(post);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        postService.delete(id);
    }

    @GetMapping
    public List<AdminPostResponse> findAll() {
        return postService.findAllForAdmin().stream()
                .map(AdminPostResponse::from)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public AdminPostResponse getPost(@PathVariable Long id) {
        Post post = postService.getPostForAdmin(id);
        return AdminPostResponse.from(post);
    }


    @PostMapping("/upload-image")
    public ResponseEntity<ImageUploadResponse> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = postService.uploadImage(file);
            return ResponseEntity.ok(new ImageUploadResponse(fileUrl));
        } catch (RuntimeException e) {
            // 서비스에서 던진 "파일 저장 실패" 메시지를 응답에 담음
            return ResponseEntity.status(500).body(new ImageUploadResponse(e.getMessage()));
        }
    }


}
