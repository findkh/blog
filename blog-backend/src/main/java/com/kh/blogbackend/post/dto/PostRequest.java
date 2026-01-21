package com.kh.blogbackend.post.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostRequest {
    private Long menuId;
    private String title;
    private String content;
    private boolean published;
}
