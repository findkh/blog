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
import { useMenu } from "../hooks/useMenu";
import type { MenuItem } from "../axios/menu/menu";
import TiptapEditor from "../components/tiptap/TiptapEditor";
import { PostDetailPage } from "../pages/PostDetailPage";

const PAGE_COMPONENTS: Record<string, React.ComponentType<any>> = {
  ProfilePage,
  DevLogPage,
  ReleasePage,
  ContactPage,
};

export function AppRoutes() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const location = useLocation();
  const navigate = useNavigate();

  const { data: menuItems = [], isLoading, error } = useMenu();

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
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            showViewToggle={location.pathname === "/home"}
            menuItems={menuItems}
            currentPage={location.pathname}
          >
            <Routes>
              <Route
                path="/home"
                element={<HomePage isAdmin={isAdmin} viewMode={viewMode} />}
              />

              {/* 메뉴 기반 라우트 */}
              {menuItems.map((item: MenuItem) => {
                const PageComponent = PAGE_COMPONENTS[item.component];
                if (!PageComponent) return null;

                return (
                  <Route key={item.path} path={item.path}>
                    {/* 리스트 페이지 */}
                    <Route
                      index
                      element={
                        <PageComponent menuId={item.id} isAdmin={isAdmin} />
                      }
                    />

                    {/* 상세 페이지 */}
                    <Route
                      path=":postId"
                      element={
                        <PostDetailPage menuId={item.id} isAdmin={isAdmin} />
                      }
                    />
                  </Route>
                );
              })}

              {/* 엔트리 포인트 */}
              <Route path="/" element={<Navigate to="/home" replace />} />

              {/* 404 */}
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
