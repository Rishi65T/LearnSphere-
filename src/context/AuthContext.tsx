import { createContext, useContext, useState, ReactNode } from "react";

export type User = {
  name: string;
  role: "student" | "instructor" | "admin";
  email: string;
  avatarUrl?: string;
  bio?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, role: User["role"], extras?: Partial<User>) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function persistUser(user: User | null) {
  if (user) {
    localStorage.setItem("auth_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("auth_user");
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, role: User["role"], extras?: Partial<User>) => {
    const newUser: User = {
      name: extras?.name ?? email.split("@")[0],
      email,
      role,
      avatarUrl: extras?.avatarUrl,
      bio: extras?.bio,
    };
    setUser(newUser);
    persistUser(newUser);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      persistUser(next);
      return next;
    });
  };

  const logout = () => {
    setUser(null);
    persistUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, updateUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
