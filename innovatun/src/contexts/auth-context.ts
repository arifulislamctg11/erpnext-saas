import { createContext } from "react";
import type { User } from "firebase/auth";

export type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signupWithEmail: (email: string, password: string) => Promise<User>;
  signinWithEmail: (email: string, password: string) => Promise<User>;
  signinWithGoogle: () => Promise<User>;
  signout: () => Promise<void>;
  PasswordReset: (email: string) => Promise<any>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);


