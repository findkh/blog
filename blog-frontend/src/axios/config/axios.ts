import axios from "axios";

/**
 * 공개 API (메뉴, 게시글, 공개 페이지)
 * - 인증 불필요
 */
export const publicApi = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

/**
 * 인증 / 관리자 API
 * - Spring Security 세션 기반
 */
export const authApi = axios.create({
  baseURL: "/api",
  timeout: 5000,
  withCredentials: true,
});
