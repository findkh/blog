import { publicApi } from "../config/axios";

// API 응답 타입
export interface MenuResponse {
  id: number;
  parentId: number | null;
  name: string;
  slug: string;
  sortOrder: number;
  active: boolean;
}

// 프론트 메뉴 트리 타입
export interface MenuNode {
  id: number;
  path: string;
  label: string;
  order: number;
  component?: string; // 실제 라우팅 컴포넌트
  children?: MenuNode[]; // 하위 메뉴
}

export const getMenus = async (): Promise<MenuNode[]> => {
  const { data } = await publicApi.get<MenuResponse[]>("/menus");
  const activeMenus = data.filter((menu) => menu.active);

  const map = new Map<number, MenuNode>();
  const roots: MenuNode[] = [];

  // 1) 노드 생성 (경로 조립 포함)
  activeMenus.forEach((menu) => {
    // 부모 정보 찾기
    const parent = data.find((m) => m.id === menu.parentId);

    // 경로 조립: 부모가 있으면 /부모슬러그/내슬러그, 없으면 /내슬러그
    const fullPath = parent
      ? `/${parent.slug.trim()}/${menu.slug.trim()}`
      : `/${menu.slug.trim()}`;

    map.set(menu.id, {
      id: menu.id,
      path: fullPath,
      label: menu.name,
      order: menu.sortOrder,
      // 자식 메뉴라면 slug를 컴포넌트명으로 변환, 부모라면 기본값(DevLogPage 등) 설정
      component: toComponentName(menu.slug),
      children: [],
    });
  });

  // 2) 부모-자식 연결 로직은 유지
  activeMenus.forEach((menu) => {
    const node = map.get(menu.id)!;
    if (menu.parentId === null) {
      roots.push(node);
    } else {
      map.get(menu.parentId)?.children?.push(node);
    }
  });

  // 3) 정렬 로직 유지
  const sortTree = (nodes: MenuNode[]) => {
    nodes.sort((a, b) => a.order - b.order);
    nodes.forEach((n) => n.children && sortTree(n.children));
  };
  sortTree(roots);

  return roots;
};

// slug → 컴포넌트명 변환
const toComponentName = (slug: string) =>
  slug
    .replace(/\//g, "-") // dev-log/blog → dev-log-blog
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("") + "Page";
