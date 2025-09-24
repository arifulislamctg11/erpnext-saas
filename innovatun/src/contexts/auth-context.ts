import { createContext } from "react";
import type { User } from "firebase/auth";

export type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signupWithEmail: (email: string, password: string) => Promise<User>;
  signinWithEmail: (email: string, password: string) => Promise<User>;
  signout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);


