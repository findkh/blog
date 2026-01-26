import { publicApi } from "../config/axios";

export interface MenuResponse {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
  active: boolean;
}

export interface MenuItem {
  id: number;
  path: string;
  label: string;
  component: string;
  order: number;
}

export const getMenus = async (): Promise<MenuItem[]> => {
  const { data } = await publicApi.get<MenuResponse[]>("/menus");

  return data
    .filter((menu) => menu.active)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((menu) => ({
      id: menu.id,
      path: `/${menu.slug}`,
      label: menu.name,
      component: toComponentName(menu.slug),
      order: menu.sortOrder,
    }));
};

const toComponentName = (slug: string) =>
  slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("") + "Page";
