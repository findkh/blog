package com.kh.blogbackend.profile.controller;

import com.kh.blogbackend.profile.dto.ProfileResponse;
import com.kh.blogbackend.profile.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ProfileResponse getProfile() {
        return profileService.getProfile();
    }
}
