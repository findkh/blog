package com.kh.blogbackend.menu.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MenuRequest {
    private Long parentId;
    private String name;
    private String slug;
    private Integer sortOrder;
    private boolean active;
}
