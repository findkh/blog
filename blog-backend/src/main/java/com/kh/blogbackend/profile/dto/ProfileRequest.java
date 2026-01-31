package com.kh.blogbackend.profile.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProfileRequest {
    private String name;
    private String bio;
    private String github;
    private String blog;
    private String email;
    private String image;
    private String bioTitle;
    private String blogDescription;
}
