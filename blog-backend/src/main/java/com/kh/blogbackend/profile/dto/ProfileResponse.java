package com.kh.blogbackend.profile.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProfileResponse {

    private Long id;
    private String name;
    private String bio;
    private String github;
    private String blog;
    private String email;
    private String image;
    private String bioTitle;
    private String blogDescription;
}
