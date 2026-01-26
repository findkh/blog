package com.kh.blogbackend.menu;

import com.kh.blogbackend.menu.entity.Menu;
import com.kh.blogbackend.menu.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MenuInitializer implements CommandLineRunner {

    private final MenuRepository menuRepository;

    @Override
    @Transactional
    public void run(String... args) {
        // 이미 데이터가 있으면 아무것도 안 함
        if (menuRepository.count() > 0) {
            return;
        }

        Menu profile = createMenu("Profile", "profile", 1);
        Menu devLog  = createMenu("Dev Log", "dev-log", 2);
        Menu release = createMenu("Release", "release", 3);

        menuRepository.saveAll(List.of(profile, devLog, release));
    }

    private Menu createMenu(String name, String slug, int order) {
        Menu menu = new Menu();
        menu.setName(name);
        menu.setSlug(slug);
        menu.setSortOrder(order);
        menu.setActive(true);
        return menu;
    }
}
