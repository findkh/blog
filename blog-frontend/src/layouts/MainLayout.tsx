import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import type { ReactNode } from "react";
import type { MenuNode } from "../axios/menu/menu";

interface MainLayoutProps {
  children: ReactNode;
  isAdmin: boolean;
  viewMode?: "card" | "table";
  onViewModeChange?: (mode: "card" | "table") => void;
  showViewToggle?: boolean;
  menuItems: MenuNode[];
  currentPage?: string;
}

export function MainLayout({
  children,
  isAdmin,
  menuItems,
  currentPage = "/home",
}: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header
        isAdmin={isAdmin}
        menuItems={menuItems}
        currentPage={currentPage}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
