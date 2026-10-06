import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api";

const AuthContext = createContext(null);

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("veloura_user") || "null");
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);

  useEffect(() => {
    const token = localStorage.getItem("veloura_token");
    if (!token) return;
    api("/auth/me")
      .then((data) => {
        setUser(data.user);
        localStorage.setItem("veloura_user", JSON.stringify(data.user));
      })
      .catch((error) => {
        if (error.status === 401) {
          localStorage.removeItem("veloura_token");
          localStorage.removeItem("veloura_user");
          setUser(null);
        }
      });
  }, []);

  const value = useMemo(
    () => ({
      user,
      async login(email, password) {
        const data = await api("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        localStorage.setItem("veloura_token", data.token);
        localStorage.setItem("veloura_user", JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
      },
      async register(payload) {
        const data = await api("/auth/register", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        localStorage.setItem("veloura_token", data.token);
        localStorage.setItem("veloura_user", JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
      },
      logout() {
        localStorage.removeItem("veloura_token");
        localStorage.removeItem("veloura_user");
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
