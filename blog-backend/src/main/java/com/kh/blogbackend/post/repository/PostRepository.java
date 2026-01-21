package com.kh.blogbackend.post.repository;

import com.kh.blogbackend.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    // 메뉴 기준 공개 글
    List<Post> findByMenu_IdAndPublishedTrueOrderByCreatedAtDesc(Long menuId);

    // 관리자 전체 조회
    List<Post> findAllByOrderByCreatedAtDesc();
}
