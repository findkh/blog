import { Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import type { MenuNode } from "../axios/menu/menu";

interface HeaderProps {
  isAdmin: boolean;
  menuItems: MenuNode[];
  currentPage?: string;
}

export function Header({
  isAdmin,
  menuItems,
  currentPage = "/home",
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const isActiveMenu = (item: MenuNode, currentPage: string): boolean => {
    if (item.path === currentPage) return true;
    return (
      item.children?.some((child) => isActiveMenu(child, currentPage)) ?? false
    );
  };

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
            <div className="flex items-center space-x-2">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  onMouseEnter={() =>
                    item.children &&
                    item.children.length > 0 &&
                    setOpenMenuId(item.id)
                  }
                  onMouseLeave={() => setOpenMenuId(null)}
                >
                  {/* 자식이 있는 경우: DropdownMenu 사용 (호버로 제어) */}
                  {item.children && item.children.length > 0 ? (
                    <DropdownMenu
                      open={openMenuId === item.id}
                      onOpenChange={(open) => !open && setOpenMenuId(null)}
                    >
                      <DropdownMenuTrigger asChild>
                        <Link
                          to={item.path}
                          className={`px-4 py-2 transition-colors font-medium cursor-pointer inline-block ${
                            isActiveMenu(item, currentPage)
                              ? "text-accent"
                              : "hover:text-accent"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="min-w-[160px]"
                        onMouseEnter={() => setOpenMenuId(item.id)}
                        onMouseLeave={() => setOpenMenuId(null)}
                      >
                        {item.children.map((child) => (
                          <DropdownMenuItem key={child.id} asChild>
                            <Link
                              to={child.path}
                              className="cursor-pointer w-full"
                            >
                              {child.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    // 자식이 없는 경우: 일반 링크
                    <Link
                      to={item.path}
                      className={`px-4 py-2 transition-colors font-medium cursor-pointer inline-block ${
                        isActiveMenu(item, currentPage)
                          ? "text-accent"
                          : "hover:text-accent"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Admin Logout */}
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-white/10"
                onClick={() => {
                  fetch("/api/logout", {
                    method: "POST",
                    credentials: "include",
                  }).then(() => window.location.reload());
                }}
              >
                Logout
              </Button>
            )}
          </nav>

          {/* Mobile Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-3 border-t border-white/10 pt-4">
            {menuItems.map((item) => (
              <div key={item.id} className="flex flex-col gap-2">
                <Link
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-1 text-lg ${
                    currentPage === item.path ? "text-accent font-semibold" : ""
                  }`}
                >
                  {item.label}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.id}
                    to={child.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="pl-4 py-1 text-sm text-white/70 hover:text-accent"
                  >
                    - {child.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
