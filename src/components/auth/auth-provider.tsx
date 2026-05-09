"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { AuthSession } from "@/domain/auth";
import { listenToAuthState, signOutOfSkillset } from "@/lib/auth/firebase-auth";

type AuthContextValue = AuthSession & {
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession>({
    status: "loading",
    user: null,
  });

  useEffect(() => {
    return listenToAuthState(setSession);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...session,
        signOut: signOutOfSkillset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
