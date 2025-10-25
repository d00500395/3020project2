import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

export const ROLES = {
  VIEWER: "viewer",
  EDITOR: "editor",
  ADMIN: "admin",
} as const;

type User = { name: string; role: keyof typeof ROLES } | null;

type AuthContextType = {
  user: User;
  setUser: (user: User) => Promise<void>;
  isViewer: boolean;
  isEditor: boolean;
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
};

const STORAGE_KEY = "auth_user";
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be inside AuthProvider");
  return context;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage on startup
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedUser) setUserState(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Update user + persist to storage
  const setUser = async (newUser: User) => {
    setUserState(newUser);
    try {
      if (newUser) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  };

  const logout = async () => {
    await setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        isViewer: user?.role === ROLES.VIEWER,
        isEditor: user?.role === ROLES.EDITOR,
        isAdmin: user?.role === ROLES.ADMIN,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
