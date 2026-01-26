import { Menu, LogIn, LayoutGrid, Table2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import type { MenuItem } from "../axios/menu/menu";

interface HeaderProps {
  isAdmin: boolean;
  viewMode?: "card" | "table";
  onViewModeChange?: (mode: "card" | "table") => void;
  showViewToggle?: boolean;
  menuItems: MenuItem[];
  currentPage?: string;
}

export function Header({
  isAdmin,
  viewMode = "card",
  onViewModeChange,
  showViewToggle = false,
  menuItems,
  currentPage = "/home",
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-full" />
            <span className="font-semibold text-xl">WaterMoon</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center ml-auto gap-8">
            {/* 메뉴 */}
            <div className="flex items-center space-x-6">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`hover:text-accent transition-colors ${
                    currentPage === item.path ? "text-accent font-semibold" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* 뷰 토글 */}
            {showViewToggle && onViewModeChange && (
              <div className="flex items-center gap-1 border rounded-md p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={viewMode === "card" ? "bg-accent" : ""}
                  onClick={() => onViewModeChange("card")}
                >
                  <LayoutGrid />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={viewMode === "table" ? "bg-accent" : ""}
                  onClick={() => onViewModeChange("table")}
                >
                  <Table2 />
                </Button>
              </div>
            )}

            {/* 관리자 버튼 */}
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  fetch("/api/logout", { method: "POST", credentials: "include" }).then(() => window.location.reload());
                }}
              >
                Logout
              </Button>
            )}
          </nav>

          {/* Mobile Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 ${currentPage === item.path ? "text-accent font-semibold" : ""}`}
              >
                {item.label}
              </Link>
            ))}

            {isAdmin && (
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  fetch("/api/logout", { method: "POST", credentials: "include" }).then(() => window.location.reload());
                }}
              >
                Logout
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
