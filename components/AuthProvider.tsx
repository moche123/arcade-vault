"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/lib/types";
import { getUser, setUser as persistUser } from "@/lib/storage";

interface AuthContextValue {
  user: User | null;
  login: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Must run post-mount, not during render: localStorage is unavailable
    // during SSR and reading it synchronously would cause a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(getUser());
  }, []);

  const login = (u: User | null) => {
    setUser(u);
    persistUser(u);
  };

  const logout = () => {
    setUser(null);
    persistUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
