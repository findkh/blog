import { useQuery } from "@tanstack/react-query";
import { getProfile, type ProfileResponse } from "../axios/profile/profile";

export const useProfileQuery = () => {
  return useQuery<ProfileResponse>({
    queryKey: ["profile"],
    queryFn: getProfile,

    staleTime: 1000 * 60 * 30, // 30분
    gcTime: 1000 * 60 * 60 * 24, // 24시간

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};
