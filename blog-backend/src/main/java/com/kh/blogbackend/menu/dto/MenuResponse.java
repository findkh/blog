package com.kh.blogbackend.menu.dto;

import com.kh.blogbackend.menu.entity.Menu;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MenuResponse {

    private Long id;
    private Long parentId;
    private String name;
    private String slug;
    private Integer sortOrder;
    private boolean active;

    public static MenuResponse from(Menu menu) {
        return new MenuResponse(
                menu.getId(),
                menu.getParent() != null ? menu.getParent().getId() : null,
                menu.getName(),
                menu.getSlug(),
                menu.getSortOrder(),
                menu.isActive()
        );
    }
}
