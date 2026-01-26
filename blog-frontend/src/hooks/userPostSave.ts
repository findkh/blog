import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { postApi, type PostRequest, type PostResponse } from "../axios/post/post";

export const usePostSave = (): UseMutationResult<PostResponse, Error, PostRequest> => {
  return useMutation({
    mutationFn: async (data: PostRequest) => {
      return await postApi.create(data);
    },
    onSuccess: () => {
      console.log("게시글이 저장되었습니다.");
    },
    onError: (error) => {
      console.error("게시글 저장 실패:", error);
    },
  });
};

export const usePostUpdate = (): UseMutationResult<PostResponse, Error, { id: number; data: PostRequest }> => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: PostRequest }) => {
      return await postApi.update(id, data);
    },
    onSuccess: () => {
      console.log("게시글이 수정되었습니다.");
    },
    onError: (error) => {
      console.error("게시글 수정 실패:", error);
    },
  });
};

export const useImageUpload = (): UseMutationResult<string, Error, File> => {
  return useMutation({
    mutationFn: async (file: File) => {
      return await postApi.uploadImage(file);
    },
    onError: (error) => {
      console.error("이미지 업로드 실패:", error);
    },
  });
};
