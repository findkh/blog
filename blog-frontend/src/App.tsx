import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import { MainLayout } from "./layouts/MainLayout";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";
import { DevLogPage } from "./pages/DevLogPage";
import { ReleasePage } from "./pages/ReleasePage";
import { ContactPage } from "./pages/ContactPage";
import { AdminLogin } from "./components/AdminLogin";
import { useMenu } from "./hooks/useMenu";
import "./styles/index.css";

const PAGE_COMPONENTS: Record<string, React.ComponentType<any>> = {
  HomePage,
  ProfilePage,
  DevLogPage,
  ReleasePage,
  ContactPage,
};

const queryClient = new QueryClient();

function AppContent() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const location = useLocation();
  const navigate = useNavigate();

  const { data: menuItems = [], isLoading, error } = useMenu();

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    navigate("/home");
  };

  const handleAdminClick = () => {
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading menu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          Failed to load menu. Please try again.
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* 로그인 페이지 */}
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

      {/* 메인 레이아웃이 적용되는 페이지들 */}
      <Route
        path="/*"
        element={
          <MainLayout
            onAdminClick={handleAdminClick}
            isAdmin={isAdmin}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            showViewToggle={location.pathname === "/home"}
            menuItems={menuItems}
            currentPage={location.pathname}
            onNavigate={handleNavigate}
          >
            <Routes>
              {/* 동적 라우트 생성 */}
              {menuItems.map((item) => {
                const PageComponent = PAGE_COMPONENTS[item.component];

                if (!PageComponent) return null;

                const pageProps =
                  item.path === "/home" ? { isAdmin, viewMode } : {};

                return (
                  <Route
                    key={item.path}
                    path={item.path}
                    element={<PageComponent {...pageProps} />}
                  />
                );
              })}

              {/* 기본 리다이렉트 */}
              <Route path="/" element={<Navigate to="/home" replace />} />

              {/* 404 페이지 */}
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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
