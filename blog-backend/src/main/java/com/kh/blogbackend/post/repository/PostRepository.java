package com.kh.blogbackend.post.repository;

import com.kh.blogbackend.post.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    // 공개된 게시글만 페이징 조회
    Page<Post> findByMenu_IdAndPublishedTrueOrderByCreatedAtDesc(Long menuId, Pageable pageable);

    // 관리자용 전체 게시글 페이징 조회
    List<Post> findAllByOrderByCreatedAtDesc();
}