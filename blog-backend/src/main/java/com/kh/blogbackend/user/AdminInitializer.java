package com.kh.blogbackend.user;

import com.kh.blogbackend.user.entity.User;
import com.kh.blogbackend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // admin 계정이 존재하지 않으면 생성
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("1234")) // 평문은 코드에서만
                    .role("ADMIN")
                    .build();

            userRepository.save(admin);

            log.info("Admin account created:");
            log.info("Username: {}", admin.getUsername());
            log.info("Encrypted Password: {}", admin.getPassword());
        } else {
            log.info("Admin account already exists. Skipping creation.");
        }
    }
}
