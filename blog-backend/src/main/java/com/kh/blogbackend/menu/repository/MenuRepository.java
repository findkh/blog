package com.kh.blogbackend.menu.repository;

import com.kh.blogbackend.menu.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MenuRepository extends JpaRepository<Menu, Long> {

    List<Menu> findByActiveTrueOrderByParent_IdAscSortOrderAsc();

    List<Menu> findAllByOrderByParent_IdAscSortOrderAsc();

    // 부모 기준 자식 조회 (재귀 삭제용)
    List<Menu> findByParent_Id(Long parentId);

    Optional<Menu> findBySlug(String slug);
}

