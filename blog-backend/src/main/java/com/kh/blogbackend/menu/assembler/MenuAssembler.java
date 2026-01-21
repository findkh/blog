package com.kh.blogbackend.menu.assembler;

import com.kh.blogbackend.menu.dto.MenuRequest;
import com.kh.blogbackend.menu.entity.Menu;
import com.kh.blogbackend.menu.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MenuAssembler {

    private final MenuRepository menuRepository;

    // 신규 메뉴 생성용
    public Menu toEntity(MenuRequest req) {
        Menu menu = new Menu();
        apply(menu, req);
        return menu;
    }

    // 기존 메뉴 수정용
    public void apply(Menu menu, MenuRequest req) {
        menu.setName(req.getName());
        menu.setSlug(req.getSlug());
        menu.setSortOrder(req.getSortOrder());
        menu.setActive(req.isActive());

        if (req.getParentId() != null) {
            Menu parent = menuRepository.findById(req.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("Parent not found: " + req.getParentId()));
            menu.setParent(parent);
        } else {
            menu.setParent(null);
        }
    }
}
