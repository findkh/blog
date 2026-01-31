package com.kh.blogbackend.profile.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Table(name = "profile", schema = "blog")
@Getter
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(length = 500)
    private String bio;

    @Column(length = 200)
    private String github;

    @Column(length = 200)
    private String blog;

    @Column(length = 100)
    private String email;

    @Column(length = 300)
    private String image;

    @Column(length = 100)
    private String blogTitle;

    @Column(length = 300)
    private String blogDescription;

    public void update(
            String name,
            String bio,
            String github,
            String blog,
            String email,
            String image,
            String blogTitle,
            String blogDescription
    ) {
        this.name = name;
        this.bio = bio;
        this.github = github;
        this.blog = blog;
        this.email = email;
        this.image = image;
        this.blogTitle = blogTitle;
        this.blogDescription = blogDescription;
    }
}