import { useQuery } from "@tanstack/react-query";
import { getHome, type HomeResponse } from "../axios/home/home";

export const useGetHome = () => {
  return useQuery<HomeResponse>({
    queryKey: ["home"],
    queryFn: getHome,
    staleTime: 1000 * 60 * 5, // 5분
  });
};
