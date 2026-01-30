package com.kh.blogbackend.post.service;

import com.kh.blogbackend.config.BlogProperties;
import com.kh.blogbackend.post.assembler.PostAssembler;
import com.kh.blogbackend.post.dto.PostNavDto;
import com.kh.blogbackend.post.dto.PostRequest;
import com.kh.blogbackend.post.dto.PublicPostResponse;
import com.kh.blogbackend.post.entity.Post;
import com.kh.blogbackend.post.repository.PostRepository;
import com.sksamuel.scrimage.ImmutableImage;
import com.sksamuel.scrimage.webp.WebpWriter;
import java.time.LocalDateTime;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostAssembler postAssembler;
    private final BlogProperties blogProperties;

    @Transactional
    public Post create(PostRequest request) {
        Post post = postAssembler.toEntity(request);
        Post savedPost = postRepository.save(post);

        if (request.getDeletedImages() != null && !request.getDeletedImages().isEmpty()) {
            deleteUnusedImages(request.getDeletedImages());
        }
        return savedPost;
    }

    @Transactional
    public Post update(Long id, PostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found: " + id));

        if (request.getDeletedImages() != null && !request.getDeletedImages().isEmpty()) {
            deleteUnusedImages(request.getDeletedImages());
        }

        postAssembler.updateEntity(post, request);
        return post;
    }

    @Transactional
    public void delete(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found: " + id));

        // 1. 본문과 썸네일에서 삭제할 파일명 리스트 추출
        Set<String> filesToDelete = new HashSet<>();

        // 썸네일 파일명 추출
        if (post.getThumbnail() != null) {
            filesToDelete.add(extractFileName(post.getThumbnail()));
        }

        // 본문 내 이미지 파일명들 추출
        filesToDelete.addAll(extractImageNamesFromContent(post.getContent()));

        // 2. 실제 파일 삭제 실행
        deleteUnusedImages(List.copyOf(filesToDelete));

        // 3. DB 레코드 삭제
        postRepository.delete(post);
    }

    @Transactional(readOnly = true)
    public Page<Post> findByMenuPaged(Long menuId, Pageable pageable) {
        return postRepository.findAllByMenuIdOrParentMenuId(menuId, pageable);
    }

    @Transactional(readOnly = true)
    public PublicPostResponse getPostForPublic(Long postId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found: " + postId));

        LocalDateTime createdAt = post.getCreatedAt();

        Optional<Post> prev = postRepository
                .findFirstByPublishedTrueAndCreatedAtLessThanOrderByCreatedAtDesc(createdAt);

        Optional<Post> next = postRepository
                .findFirstByPublishedTrueAndCreatedAtGreaterThanOrderByCreatedAtAsc(createdAt);

        PostNavDto prevDto = prev
                .map(p -> new PostNavDto(p.getId(), p.getTitle()))
                .orElse(null);

        PostNavDto nextDto = next
                .map(p -> new PostNavDto(p.getId(), p.getTitle()))
                .orElse(null);

        return PublicPostResponse.from(post, prevDto, nextDto);
    }

    @Transactional(readOnly = true)
    public Post getPostForAdmin(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Post> findAllForAdmin() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    private void deleteUnusedImages(List<String> fileNames) {
        String uploadDir = blogProperties.getImagePath();
        for (String filename : fileNames) {
            try {
                Path filePath = Paths.get(uploadDir, filename);
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                System.out.println("파일 삭제 실패: " + filename + " " + e);
            }
        }
    }

    /**
     * 이미지 업로드 즉시 WebP로 변환하여 저장
     */
    public String uploadImage(MultipartFile file) {
        String uploadDir = blogProperties.getImagePath();

        // 1. 저장할 파일명을 무조건 .webp로 결정
        String filename = UUID.randomUUID() + ".webp";
        File destination = Paths.get(uploadDir, filename).toFile();

        try {
            // 2. Scrimage를 이용해 읽자마자 WebP로 출력
            // .output(WebpWriter.DEFAULT, destination) 사용
            ImmutableImage.loader().fromStream(file.getInputStream())
                    .output(WebpWriter.DEFAULT, destination);

        } catch (IOException e) {
            throw new RuntimeException("이미지 WebP 변환 및 저장 실패", e);
        }

        // 3. 변환된 .webp 경로를 리턴 (프론트는 이걸 본문에 삽입)
        return blogProperties.getImageUrl() + filename;
    }

    /**
     * 본문 HTML 내에서 이미지 파일명만 추출하는 유틸리티
     */
    private Set<String> extractImageNamesFromContent(String content) {
        Set<String> fileNames = new HashSet<>();
        if (content == null || content.isEmpty()) return fileNames;

        // <img src=".../UUID.webp" /> 형태에서 파일명만 캡처하는 정규식
        Pattern pattern = Pattern.compile("([^/]+\\.(webp|jpg|png|gif|jpeg))");
        Matcher matcher = pattern.matcher(content);

        while (matcher.find()) {
            fileNames.add(matcher.group(1));
        }
        return fileNames;
    }

    /**
     * URL 전체 경로에서 파일명만 추출 (예: http://.../abc.webp -> abc.webp)
     */
    private String extractFileName(String url) {
        if (url == null || !url.contains("/")) return url;
        return url.substring(url.lastIndexOf("/") + 1);
    }
}