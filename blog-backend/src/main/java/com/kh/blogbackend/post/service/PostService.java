package com.kh.blogbackend.post.service;

import com.kh.blogbackend.post.assembler.PostAssembler;
import com.kh.blogbackend.post.dto.PostRequest;
import com.kh.blogbackend.post.entity.Post;
import com.kh.blogbackend.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostAssembler postAssembler;

    @Transactional
    public Post create(PostRequest request) {
        Post post = postAssembler.toEntity(request);
        return postRepository.save(post);
    }

    @Transactional
    public Post update(Long id, PostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found: " + id));
        postAssembler.updateEntity(post, request);
        return post;
    }

    @Transactional
    public void delete(Long id) {
        postRepository.deleteById(id);
    }

    @Transactional
    public List<Post> findByMenu(Long menuId) {
        List<Post> posts = postRepository.findByMenu_IdAndPublishedTrueOrderByCreatedAtDesc(menuId);
        posts.forEach(post -> post.setViews(post.getViews() + 1)); // 조회수 증가
        return posts;
    }

    @Transactional
    public Post getPostForPublic(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found: " + id));
        if (post.isPublished()) post.setViews(post.getViews() + 1);
        return post;
    }

    @Transactional(readOnly = true)
    public Post getPostForAdmin(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Post> findAllForAdmin() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }
}
