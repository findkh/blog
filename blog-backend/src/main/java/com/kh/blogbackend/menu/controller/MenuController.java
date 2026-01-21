package com.kh.blogbackend.menu.controller;

import com.kh.blogbackend.menu.dto.MenuResponse;
import com.kh.blogbackend.menu.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menus")
@RequiredArgsConstructor
public class MenuController {

    private final MenuRepository menuRepository;

    @GetMapping
    public List<MenuResponse> listActive() {
        return menuRepository.findByActiveTrueOrderByParent_IdAscSortOrderAsc()
                .stream()
                .map(MenuResponse::from)
                .toList();
    }
}
