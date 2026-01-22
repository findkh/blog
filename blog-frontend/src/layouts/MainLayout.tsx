import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import type { ReactNode } from "react";

// MenuItem 타입 정의 (추후 types 폴더로 분리 예정)
export interface MenuItem {
  path: string;
  label: string;
  component: string;
  requiresAuth?: boolean;
  order?: number;
}

interface MainLayoutProps {
  children: ReactNode;
  onAdminClick: () => void;
  isAdmin: boolean;
  viewMode?: "card" | "table";
  onViewModeChange?: (mode: "card" | "table") => void;
  showViewToggle?: boolean;
  menuItems?: MenuItem[];
  currentPage?: string;
  onNavigate?: (path: string) => void;
}

export function MainLayout({
  children,
  onAdminClick,
  isAdmin,
  viewMode = "card",
  onViewModeChange,
  showViewToggle = false,
  menuItems = [],
  currentPage = "/home",
  onNavigate,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onAdminClick={onAdminClick}
        isAdmin={isAdmin}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        showViewToggle={showViewToggle}
        menuItems={menuItems}
        currentPage={currentPage}
        onNavigate={onNavigate}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
