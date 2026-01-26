import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import type { ReactNode } from "react";
import type { MenuItem } from "../axios/menu/menu";

interface MainLayoutProps {
  children: ReactNode;
  isAdmin: boolean;
  viewMode?: "card" | "table";
  onViewModeChange?: (mode: "card" | "table") => void;
  showViewToggle?: boolean;
  menuItems: MenuItem[];
  currentPage?: string;
}

export function MainLayout({
  children,
  isAdmin,
  viewMode = "card",
  onViewModeChange,
  showViewToggle = false,
  menuItems,
  currentPage = "/home",
}: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header
        isAdmin={isAdmin}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        showViewToggle={showViewToggle}
        menuItems={menuItems}
        currentPage={currentPage}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
