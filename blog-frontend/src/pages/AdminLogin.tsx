import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { authApi } from "../axios/config/axios";

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export function AdminLogin({ onLoginSuccess, onBackToHome }: AdminLoginProps) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.post(
        "/login",
        new URLSearchParams({
          username: userId,
          password,
        }),
      );

      // 응답 확인
      if (response.status === 200 && response.data.success) {
        onLoginSuccess();
      }
    } catch (err: any) {
      console.error("Login error:", err);

      // 에러 응답 메시지 표시
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid ID or password");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">Enter admin ID and password</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">Admin ID</Label>
              <Input id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md">{error}</div>}
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <Button type="button" variant="ghost" className="w-full" onClick={onBackToHome}>
              Back to Home
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
