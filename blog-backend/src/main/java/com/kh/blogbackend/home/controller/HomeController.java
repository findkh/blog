package com.kh.blogbackend.home.controller;

import com.kh.blogbackend.home.dto.HomeResponse;
import com.kh.blogbackend.home.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
public class HomeController {

    private final HomeService homeService;

    @GetMapping
    public ResponseEntity<HomeResponse> getHomeData() {
        HomeResponse response = homeService.getHomeData();
        return ResponseEntity.ok(response);
    }
}