import { useQuery } from "@tanstack/react-query";
import { getMenus, type MenuItem } from "../axios/menu/menu";

export const useMenu = () => {
  return useQuery<MenuItem[]>({
    queryKey: ["menu"],
    queryFn: getMenus,

    staleTime: 1000 * 60 * 60, // 1시간
    gcTime: 1000 * 60 * 60 * 24, // 24시간

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
  });
};
