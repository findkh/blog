import { publicApi } from "../config/axios";
import type { PostResponse } from "../post/post";
import type { ProfileResponse } from "../profile/profile";

export interface HomeResponse {
  hero: ProfileResponse;
  recentPosts: PostResponse[];
}

export const getHome = async (): Promise<HomeResponse> => {
  const response = await publicApi.get<HomeResponse>("/home");
  return response.data;
};
