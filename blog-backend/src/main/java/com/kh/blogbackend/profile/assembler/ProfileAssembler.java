package com.kh.blogbackend.profile.assembler;

import com.kh.blogbackend.profile.dto.ProfileRequest;
import com.kh.blogbackend.profile.dto.ProfileResponse;
import com.kh.blogbackend.profile.entity.Profile;
import org.springframework.stereotype.Component;

@Component
public class ProfileAssembler {

    public Profile toEntity(ProfileRequest request, String imageUrl) {
        Profile profile = new Profile();
        profile.update(
                request.getName(),
                request.getBio(),
                request.getGithub(),
                request.getBlog(),
                request.getEmail(),
                imageUrl
        );
        return profile;
    }

    public void update(Profile profile, ProfileRequest request, String imageUrl) {
        profile.update(
                request.getName(),
                request.getBio(),
                request.getGithub(),
                request.getBlog(),
                request.getEmail(),
                imageUrl
        );
    }

    public ProfileResponse toDto(Profile profile) {
        return new ProfileResponse(
                profile.getId(),
                profile.getName(),
                profile.getBio(),
                profile.getGithub(),
                profile.getBlog(),
                profile.getEmail(),
                profile.getImage()
        );
    }
}
