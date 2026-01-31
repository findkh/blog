package com.kh.blogbackend.home.service;

import com.kh.blogbackend.home.assembler.HomeAssembler;
import com.kh.blogbackend.home.dto.HomeResponse;
import com.kh.blogbackend.post.entity.Post;
import com.kh.blogbackend.post.repository.PostRepository;
import com.kh.blogbackend.profile.entity.Profile;
import com.kh.blogbackend.profile.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HomeService {

    private final ProfileRepository profileRepository;
    private final PostRepository postRepository;
    private final HomeAssembler homeAssembler;

    public HomeResponse getHomeData() {
        // 프로필 조회 (첫 번째 프로필 사용)
        Profile profile = profileRepository.findAll().stream()
                .findFirst()
                .orElse(null);

        // 최신 게시글 6개 조회 (published = true만)
        Pageable pageable = PageRequest.of(0, 6, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<Post> recentPosts = postRepository.findByPublishedTrue(pageable).getContent();

        return homeAssembler.toHomeResponse(profile, recentPosts);
    }
}