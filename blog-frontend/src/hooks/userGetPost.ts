import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { postApi } from "../axios/post/post";

export function usePostInfinite(menuId: number) {
  return useInfiniteQuery({
    queryKey: ["posts", menuId],
    queryFn: ({ pageParam = 0 }) => postApi.getPosts(menuId, pageParam, 10),
    initialPageParam: 0,
    // 다음 페이지 번호를 결정하는 로직 (백엔드 Page 객체의 last, number 활용)
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.number + 1;
    },
  });
}

export const usePostDetail = (postId: number | null) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => postApi.getById(postId!),
    enabled: !!postId, // postId가 있을 때만 API 호출
  });
};
