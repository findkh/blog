import type { ReactNode } from "react";
import type { MenuNode } from "../axios/menu/menu";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";

interface MainLayoutProps {
  children: ReactNode;
  isAdmin: boolean;
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
      <Footer menuItems={menuItems} />
    </div>
  );
}
