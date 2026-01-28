import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";

import { MainLayout } from "../layouts/MainLayout";
import { HomePage } from "../pages/HomePage";
import { ProfilePage } from "../pages/ProfilePage";
import { DevLogPage } from "../pages/DevLogPage";
import { ReleasePage } from "../pages/ReleasePage";
import { ContactPage } from "../pages/ContactPage";
import { AdminLogin } from "../pages/AdminLogin";
import { PostDetailPage } from "../pages/PostDetailPage";
import TiptapEditor from "../components/tiptap/TiptapEditor";

import { useMenu } from "../hooks/useMenu";
import type { MenuNode } from "../axios/menu/menu";

const PAGE_COMPONENTS: Record<string, React.ComponentType<any>> = {
  ProfilePage,
  DevLogPage,
  ReleasePage,
  ContactPage,
};

export function AppRoutes() {
  const [isAdmin, setIsAdmin] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { data: menuItems = [], isLoading, error } = useMenu();

  const flatten = (nodes: MenuNode[]): MenuNode[] => {
    return nodes.reduce((acc: MenuNode[], node) => {
      return [...acc, node, ...flatten(node.children || [])];
    }, []);
  };
  const flatMenus = flatten(menuItems);

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    navigate("/home");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading menu...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load menu
      </div>
    );
  }

  return (
    <Routes>
      {/* 로그인 */}
      <Route
        path="/login"
        element={
          isAdmin ? (
            <Navigate to="/home" replace />
          ) : (
            <AdminLogin
              onLoginSuccess={handleLoginSuccess}
              onBackToHome={() => navigate("/home")}
            />
          )
        }
      />

      {isAdmin && <Route path="/editor" element={<TiptapEditor />} />}

      {/* 메인 레이아웃 */}
      <Route
        path="/*"
        element={
          <MainLayout
            isAdmin={isAdmin}
            menuItems={menuItems}
            currentPage={location.pathname}
          >
            <Routes>
              <Route path="/home" element={<HomePage isAdmin={isAdmin} />} />

              <Route path="/" element={<Navigate to="/home" replace />} />

              {/* 메뉴 기반 라우트 (부모 메뉴만) */}
              {flatMenus.map((menu) => {
                const PageComponent =
                  PAGE_COMPONENTS[menu.component || "DevLogPage"] || DevLogPage;

                return (
                  <Route key={menu.id} path={menu.path}>
                    <Route
                      index
                      element={
                        <PageComponent menuId={menu.id} isAdmin={isAdmin} />
                      }
                    />
                    <Route
                      path=":postId"
                      element={
                        <PostDetailPage menuId={menu.id} isAdmin={isAdmin} />
                      }
                    />
                  </Route>
                );
              })}

              <Route
                path="*"
                element={
                  <div className="container mx-auto px-4 py-16">
                    <h1 className="text-4xl font-bold mb-4">
                      404 - Page Not Found
                    </h1>
                    <p className="text-muted-foreground">
                      The page you're looking for doesn't exist.
                    </p>
                  </div>
                }
              />
            </Routes>
          </MainLayout>
        }
      />
    </Routes>
  );
}
