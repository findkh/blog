package com.kh.blogbackend.post.entity;


import com.kh.blogbackend.menu.entity.Menu;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.*;
import java.time.LocalDateTime;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

@Entity
@Table(name = "post", schema = "blog")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어떤 메뉴에 속한 글인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_id", nullable = false)
    private Menu menu;

    @Column(nullable = false, length = 200)
    private String title;

    @Lob
    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private boolean published;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private Long views = 0L; // 조회수

    @Column(length = 500)
    private String thumbnail;

    @Column(name = "tags", columnDefinition = "TEXT")
    private String tags;

    public List<String> getTagList() {
        if (tags == null || tags.isEmpty()) {
            return new ArrayList<>();
        }
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(tags, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    public void setTagList(List<String> tagList) {
        if (tagList == null || tagList.isEmpty()) {
            this.tags = null;
            return;
        }
        try {
            ObjectMapper mapper = new ObjectMapper();
            this.tags = mapper.writeValueAsString(tagList);
        } catch (Exception e) {
            this.tags = null;
        }
    }
}