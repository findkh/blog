package com.kh.blogbackend.post.repository;

import com.kh.blogbackend.post.entity.Post;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostRepository extends JpaRepository<Post, Long> {
    // 공개된 게시글만 페이징 조회
    Page<Post> findByMenu_IdAndPublishedTrueOrderByCreatedAtDesc(Long menuId, Pageable pageable);

    // 이 쿼리는 menuId가 부모면 자식들 글까지 다 가져오고,
    // menuId가 자식이면 해당 자식 글만 가져옵니다.
    @Query("SELECT p FROM Post p WHERE p.menu.id = :menuId OR p.menu.parent.id = :menuId")
    Page<Post> findAllByMenuIdOrParentMenuId(@Param("menuId") Long menuId, Pageable pageable);

    // 관리자용 전체 게시글 페이징 조회
    List<Post> findAllByOrderByCreatedAtDesc();

    // ===== 메뉴 무관 (최상위 메뉴) =====
    Optional<Post> findFirstByPublishedTrueAndCreatedAtLessThanOrderByCreatedAtDesc(
            LocalDateTime createdAt
    );

    Optional<Post> findFirstByPublishedTrueAndCreatedAtGreaterThanOrderByCreatedAtAsc(
            LocalDateTime createdAt
    );
}