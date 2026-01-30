package com.kh.blogbackend.profile.service;

import com.kh.blogbackend.config.BlogProperties;
import com.kh.blogbackend.profile.assembler.ProfileAssembler;
import com.kh.blogbackend.profile.dto.ProfileRequest;
import com.kh.blogbackend.profile.dto.ProfileResponse;
import com.kh.blogbackend.profile.entity.Profile;
import com.kh.blogbackend.profile.repository.ProfileRepository;
import com.sksamuel.scrimage.ImmutableImage;
import com.sksamuel.scrimage.webp.WebpWriter;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final ProfileAssembler profileAssembler;
    private final BlogProperties blogProperties;

    @Transactional(readOnly = true)
    public ProfileResponse getProfile() {
        return profileAssembler.toDto(getOrThrow());
    }

    public ProfileResponse create(ProfileRequest request, MultipartFile imageFile) {
        if (profileRepository.count() > 0) {
            throw new IllegalStateException("프로필은 이미 존재합니다.");
        }

        String imageUrl = convertAndSaveProfileImage(imageFile);

        Profile profile = profileAssembler.toEntity(
                request,
                imageUrl
        );

        profileRepository.save(profile);
        return profileAssembler.toDto(profile);
    }

    public ProfileResponse update(ProfileRequest request, MultipartFile imageFile) {
        Profile profile = getOrThrow();

        String imageUrl = profile.getImage();
        if (imageFile != null && !imageFile.isEmpty()) {
            imageUrl = convertAndSaveProfileImage(imageFile);
        }

        profileAssembler.update(profile, request, imageUrl);
        return profileAssembler.toDto(profile);
    }

    private String convertAndSaveProfileImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        String filename = UUID.randomUUID() + ".webp";
        File destination = Paths.get(blogProperties.getImagePath(), filename).toFile();

        try {
            ImmutableImage.loader()
                    .fromStream(file.getInputStream())
                    .output(WebpWriter.DEFAULT, destination);
        } catch (IOException e) {
            throw new RuntimeException("프로필 이미지 변환 실패", e);
        }

        return blogProperties.getProfileImageUrl() + filename;
    }

    private Profile getOrThrow() {
        return profileRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("프로필 정보가 없습니다."));
    }
}
