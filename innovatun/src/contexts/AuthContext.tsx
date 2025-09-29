import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { AuthContext, type AuthContextValue } from "./auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signupWithEmail = async (email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return cred.user;
  };

  const signinWithEmail = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  };

  const signinWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    return cred.user;
  };

  const signout = async () => {
    await signOut(auth);
  };

    const PasswordReset = async (email: any): Promise<any> => {
      try {
        const response = await sendPasswordResetEmail(auth, email);
        console.log('Reset email sent successfully', response);
        const success = {response, success: true}
        return  success
      } catch (error) {
        console.error('Error sending reset email:', error);
        throw error; // optionally propagate the error
      }
    }
  const value = useMemo<AuthContextValue>(() => ({PasswordReset, user, loading, signupWithEmail, signinWithEmail, signinWithGoogle, signout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// hook moved to ./use-auth to satisfy fast refresh rule
