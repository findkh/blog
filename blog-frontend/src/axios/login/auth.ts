import { authApi } from "../config/axios";

interface LoginRequest {
  id: string;
  password: string;
}

export const login = async ({ id, password }: LoginRequest) => {
  const form = new URLSearchParams();
  form.append("username", id);
  form.append("password", password);

  await authApi.post("/login", form, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const logout = async () => {
  await authApi.post("/logout");
};
