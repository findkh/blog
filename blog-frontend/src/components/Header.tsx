import { Menu, LogIn, LayoutGrid, Table2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

interface MenuItem {
  path: string;
  label: string;
}

interface HeaderProps {
  onAdminClick: () => void;
  isAdmin: boolean;
  viewMode?: "card" | "table";
  onViewModeChange?: (mode: "card" | "table") => void;
  showViewToggle?: boolean;
  menuItems?: MenuItem[];
  currentPage?: string;
  onNavigate?: (path: string) => void;
}

export function Header({
  onAdminClick,
  isAdmin,
  viewMode = "card",
  onViewModeChange,
  showViewToggle = false,
  menuItems = [],
  currentPage = "/home",
  onNavigate,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (path: string) => {
    onNavigate?.(path);
    setMobileMenuOpen(false);
  };

  // handleNavigate 함수 삭제 (더 이상 사용하지 않음)

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-full"></div>
            <span className="font-semibold text-xl">WaterMoon</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* 동적 메뉴 */}
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

            {/* View Mode Toggle */}
            {showViewToggle && onViewModeChange && (
              <div className="flex items-center gap-1 border border-primary-foreground/20 rounded-md p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-7 px-2 ${
                    viewMode === "card"
                      ? "bg-accent text-accent-foreground"
                      : "text-primary-foreground hover:text-accent"
                  }`}
                  onClick={() => onViewModeChange("card")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-7 px-2 ${
                    viewMode === "table"
                      ? "bg-accent text-accent-foreground"
                      : "text-primary-foreground hover:text-accent"
                  }`}
                  onClick={() => onViewModeChange("table")}
                >
                  <Table2 className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Admin Login Button */}
            {!isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onAdminClick}
                className="text-primary-foreground hover:text-accent"
              >
                <LogIn className="w-4 h-4 mr-1" />
                Admin
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-primary-foreground hover:text-accent"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col space-y-3">
            {/* 동적 모바일 메뉴 */}
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`hover:text-accent transition-colors py-2 text-left ${
                  currentPage === item.path ? "text-accent font-semibold" : ""
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Mobile View Mode Toggle */}
            {showViewToggle && onViewModeChange && (
              <div className="flex items-center gap-2 py-2">
                <span className="text-sm">View:</span>
                <div className="flex items-center gap-1 border border-primary-foreground/20 rounded-md p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-7 px-2 ${
                      viewMode === "card"
                        ? "bg-accent text-accent-foreground"
                        : "text-primary-foreground hover:text-accent"
                    }`}
                    onClick={() => onViewModeChange("card")}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-7 px-2 ${
                      viewMode === "table"
                        ? "bg-accent text-accent-foreground"
                        : "text-primary-foreground hover:text-accent"
                    }`}
                    onClick={() => onViewModeChange("table")}
                  >
                    <Table2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Mobile Admin Login */}
            {!isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onAdminClick();
                  setMobileMenuOpen(false);
                }}
                className="text-primary-foreground border-primary-foreground/20 hover:bg-accent hover:text-accent-foreground"
              >
                <LogIn className="w-4 h-4 mr-1" />
                Admin Login
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
