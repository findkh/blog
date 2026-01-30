package com.kh.blogbackend.profile.controller;

import com.kh.blogbackend.profile.dto.ProfileRequest;
import com.kh.blogbackend.profile.dto.ProfileResponse;
import com.kh.blogbackend.profile.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/profile")
@RequiredArgsConstructor
public class AdminProfileController {

    private final ProfileService profileService;

    // 관리자 조회
    @GetMapping
    public ProfileResponse getProfile() {
        return profileService.getProfile();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProfileResponse create(
            @RequestPart ProfileRequest request,
            @RequestPart(required = false) MultipartFile image
    ) {
        return profileService.create(request, image);
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProfileResponse update(
            @RequestPart ProfileRequest request,
            @RequestPart(required = false) MultipartFile image
    ) {
        return profileService.update(request, image);
    }
}
