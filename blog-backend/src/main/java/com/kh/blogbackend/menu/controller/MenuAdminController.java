package com.kh.blogbackend.menu.controller;


import com.kh.blogbackend.menu.dto.MenuRequest;
import com.kh.blogbackend.menu.dto.MenuResponse;
import com.kh.blogbackend.menu.repository.MenuRepository;
import com.kh.blogbackend.menu.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/menus")
@RequiredArgsConstructor
public class MenuAdminController {

    private final MenuService menuService;
    private final MenuRepository menuRepository;

    @GetMapping
    public List<MenuResponse> listAll() {
        return menuRepository.findAll().stream()
                .map(MenuResponse::from)
                .toList();
    }

    @PostMapping
    public MenuResponse create(@RequestBody MenuRequest req) {
        return MenuResponse.from(menuService.create(req));
    }

    @PutMapping("/{id}")
    public MenuResponse update(@PathVariable Long id,
                               @RequestBody MenuRequest req) {
        return MenuResponse.from(menuService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        menuService.delete(id);
    }
}
