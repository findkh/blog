import { useQueryClient, useMutation } from "@tanstack/react-query";
import { postApi } from "../axios/post/post";

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      alert("삭제되었습니다.");
    },
    onError: () => {
      alert("삭제에 실패했습니다.");
    },
  });
};
