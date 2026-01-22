import { useQuery } from "@tanstack/react-query";

export interface MenuItem {
  path: string;
  label: string;
  component: string;
  requiresAuth?: boolean;
  order?: number;
}

// API 시뮬레이션 함수 (추후 실제 API로 교체)
const fetchMenuItems = async (): Promise<MenuItem[]> => {
  // 실제 구현 시:
  // const response = await fetch('/api/menu');
  // if (!response.ok) throw new Error('Failed to fetch menu');
  // return response.json();

  // 현재는 하드코딩된 데이터 반환
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { path: "/home", label: "Home", component: "HomePage", order: 1 },
        {
          path: "/profile",
          label: "Profile",
          component: "ProfilePage",
          order: 2,
        },
        {
          path: "/dev-log",
          label: "Dev Log",
          component: "DevLogPage",
          order: 3,
        },
        {
          path: "/release",
          label: "Release",
          component: "ReleasePage",
          order: 4,
        },
        {
          path: "/contact",
          label: "Contact",
          component: "ContactPage",
          order: 5,
        },
      ]);
    }, 500); // 네트워크 지연 시뮬레이션
  });
};

export function useMenu() {
  return useQuery({
    queryKey: ["menu"],
    queryFn: fetchMenuItems,
    staleTime: 1000 * 60 * 60, // 1시간 동안 fresh 상태 유지
    gcTime: 1000 * 60 * 60 * 24, // 24시간 동안 캐시 유지 (구 cacheTime)
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재조회 방지
    refetchOnMount: false, // 컴포넌트 마운트 시 재조회 방지 (캐시 우선)
    retry: 3, // 실패 시 3번 재시도
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
  });
}
