package com.kh.blogbackend.profile.repository;

import com.kh.blogbackend.profile.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
}
