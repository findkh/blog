// PostRequest.java
package com.kh.blogbackend.post.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PostRequest {
    private Long menuId;
    private String title;
    private String content;
    private boolean published;
    private String thumbnail;
    private List<String> tags;
    private List<String> deletedImages;
}