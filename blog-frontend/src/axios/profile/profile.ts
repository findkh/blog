import { publicApi } from "../config/axios";

export interface ProfileResponse {
  id: number;
  name: string;
  bio: string;
  github: string;
  blog: string;
  email: string;
  image?: string;
  blogTitle: string;
  blogDescription: string;
}

export interface ProfileRequest {
  id: number;
  name: string;
  bio: string;
  github: string;
  blog: string;
  email: string;
  image?: string;
  blogTitle: string;
  blogDescription: string;
}

export const getProfile = async (): Promise<ProfileRequest> => {
  const response = await publicApi.get("/profile");
  return response.data;
};
