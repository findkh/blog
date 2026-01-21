package com.kh.blogbackend.menu.service;

import com.kh.blogbackend.menu.assembler.MenuAssembler;
import com.kh.blogbackend.menu.dto.MenuRequest;
import com.kh.blogbackend.menu.entity.Menu;
import com.kh.blogbackend.menu.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;
    private final MenuAssembler menuAssembler;

    @Transactional
    public Menu create(MenuRequest req) {
        Menu menu = menuAssembler.toEntity(req);
        return menuRepository.save(menu);
    }

    @Transactional
    public Menu update(Long id, MenuRequest req) {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Menu not found: " + id));

        menuAssembler.apply(menu, req);
        return menu;
    }

    @Transactional
    public void delete(Long id) {
        deleteRecursively(id);
    }

    private void deleteRecursively(Long id) {
        List<Menu> children = menuRepository.findByParent_Id(id);
        for (Menu child : children) {
            deleteRecursively(child.getId());
        }
        menuRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Menu> findAll() {
        return menuRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Menu findById(Long id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Menu not found: " + id));
    }

    // 일반 사용자용: 활성 메뉴만
    @Transactional(readOnly = true)
    public List<Menu> findAllActive() {
        return menuRepository.findByActiveTrueOrderByParent_IdAscSortOrderAsc();
    }

    // 관리자용: 전체 메뉴
    @Transactional(readOnly = true)
    public List<Menu> findAllForAdmin() {
        return menuRepository.findAllByOrderByParent_IdAscSortOrderAsc();
    }
}
