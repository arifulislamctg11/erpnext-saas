import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { AuthContext, type AuthContextValue } from "./auth-context";
import { api } from "../api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseLoading, setFirebaseLoading] = useState<boolean>(true);
  const [role, setRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState<boolean>(false);
  
  // Admin when backend role is 'admin'
  const isAdmin = role === 'admin';
    const loading = firebaseLoading || roleLoading;


  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setFirebaseLoading(false);
    });
    return () => unsub();
  }, []);

  // Fetch role from backend users collection
  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      const emailLower = (user?.email || '').toLowerCase();
      if (!emailLower) {
        if (isMounted) setRole(null);
        if (isMounted) setRoleLoading(false);
        return;
      }
      if (isMounted) setRoleLoading(true);
      try {
        const res = await fetch(`${api.baseUrl}/users?email=${encodeURIComponent(emailLower)}`);
        if (!res.ok) {
          if (isMounted) setRole(null);
          if (isMounted) setRoleLoading(false);
          return;
        }
        const data = await res.json();
        if (isMounted) setRole((data?.role as string) ?? null);
      } catch {
        if (isMounted) setRole(null);
      } finally {
        if (isMounted) setRoleLoading(false);
      }
    };
    run();
    return () => { isMounted = false; };
  }, [user]);

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
  const value = useMemo<AuthContextValue>(() => ({ user, loading, isAdmin, signupWithEmail, signinWithEmail, signinWithGoogle, signout, PasswordReset }), [user, loading, isAdmin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// hook moved to ./use-auth to satisfy fast refresh rule
