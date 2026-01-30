import axios from "axios";

export interface PostRequest {
  menuId: number;
  title: string;
  content: string;
  published: boolean;
  thumbnail?: string | null;
  tags?: string[];
}

export interface PostNav {
  id: number;
  title: string;
}

export interface PostResponse {
  id: number;
  menuId: number;
  title: string;
  content: string;
  thumbnail?: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;

  // 이전 / 다음 글 (없으면 null)
  prevPost: PostNav | null;
  nextPost: PostNav | null;
}

export interface ImageUploadResponse {
  url: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  number: number; // 현재 페이지 번호
  size: number; // 한 페이지당 개수
}

const ADMIN_BASE = "/api/admin/post";
const PUBLIC_BASE = "/api/post";

export const postApi = {
  // 게시글 생성 (Admin)
  create: async (data: PostRequest): Promise<PostResponse> => {
    const response = await axios.post(ADMIN_BASE, data);
    return response.data;
  },

  // 게시글 수정 (Admin)
  update: async (id: number, data: PostRequest): Promise<PostResponse> => {
    const response = await axios.put(`${ADMIN_BASE}/${id}`, data);
    return response.data;
  },

  // 게시글 삭제 (Admin)
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${ADMIN_BASE}/${id}`);
  },

  // 게시글 상세 조회
  getById: async (id: number): Promise<PostResponse> => {
    const response = await axios.get(`${PUBLIC_BASE}/${id}`);
    return response.data;
  },

  /**
   * 게시글 리스트 조회 (무한 스크롤 대응)
   */
  getPosts: async (
    menuId: number,
    page: number,
    size: number = 10,
  ): Promise<PageResponse<PostResponse>> => {
    const response = await axios.get(`${PUBLIC_BASE}/board/${menuId}`, {
      params: { page, size },
    });
    return response.data;
  },

  // 이미지 업로드
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post<ImageUploadResponse>(
      `${ADMIN_BASE}/upload-image`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data.url;
  },

  // 이미지 삭제
  deleteImage: async (imageUrl: string): Promise<void> => {
    await axios.delete(`${ADMIN_BASE}/delete-image`, {
      params: { url: imageUrl },
    });
  },
};
