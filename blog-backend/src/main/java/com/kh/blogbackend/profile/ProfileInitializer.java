package com.kh.blogbackend.profile;

import com.kh.blogbackend.profile.entity.Profile;
import com.kh.blogbackend.profile.repository.ProfileRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class ProfileInitializer {

    private final ProfileRepository profileRepository;

    @PostConstruct
    @Transactional
    public void init() {

        // 이미 프로필이 있으면 아무 것도 안 함
        if (profileRepository.count() > 0) {
            return;
        }

        Profile profile = new Profile();
        profile.update(
                "개발자수달",              // name
                "개인 블로그입니다.",     // bio
                "https://github.com/findkh", // github
                "https://blog.example",  // blog
                "watermoon14@naver.com",        // email
                null                     // image (초기엔 없음)
        );

        profileRepository.save(profile);
    }
}