import { createContext } from "react";
import type { User } from "../types";

export interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (credentials: {
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => Promise<User>;
  loadUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
