import { useQueryClient, useMutation } from "@tanstack/react-query";
import { postApi } from "../axios/post/post";

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postApi.delete(id),
    onSuccess: () => {
      // 리스트 데이터를 무효화하여 화면을 갱신합니다.
      // 무한 스크롤 훅에서 사용한 queryKey와 일치해야 합니다 (예: ["posts", menuId])
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      alert("삭제되었습니다.");
    },
    onError: () => {
      alert("삭제에 실패했습니다.");
    },
  });
};
