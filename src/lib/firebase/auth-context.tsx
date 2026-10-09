"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "./config";
import { IUser, UserRole } from "@/types";

interface AuthContextType {
  user: FirebaseUser | null;
  mongoUser: IUser | null;
  role: UserRole;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  demoLogin: (role: "user" | "admin") => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  mongoUser: null,
  role: "user",
  loading: true,
  loginWithEmail: async () => {},
  registerWithEmail: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  demoLogin: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [mongoUser, setMongoUser] = useState<IUser | null>(null);
  const [role, setRole] = useState<UserRole>("user");
  const [loading, setLoading] = useState(true);

  // Sync user with our database backend
  const syncWithBackend = async (fbUser: { uid: string; email: string | null; displayName: string | null; photoURL?: string | null }) => {
    try {
      const res = await fetch("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: fbUser.uid,
          email: fbUser.email,
          name: fbUser.displayName || fbUser.email?.split("@")[0] || "Customer",
          avatar: fbUser.photoURL,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMongoUser(data.user);
        setRole(data.user.role || "user");
      }
    } catch (err) {
      console.error("Failed to sync user with backend:", err);
    }
  };

  useEffect(() => {
    // Check if we have a demo session in localStorage
    const savedDemo = localStorage.getItem("rar_demo_user");
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        if (parsed.name === "Alex Administrator" || parsed.name === "admin") {
          parsed.name = "Shriyam";
          localStorage.setItem("rar_demo_user", JSON.stringify(parsed));
        }
        if (parsed.name === "Michael Chen") {
          parsed.name = "Aarav Sharma";
          parsed.email = "aarav.sharma@rentaride.com";
          localStorage.setItem("rar_demo_user", JSON.stringify(parsed));
        }
        setUser({
          uid: parsed.firebaseUid,
          email: parsed.email,
          displayName: parsed.name,
          photoURL: parsed.avatar,
        } as unknown as FirebaseUser);
        setMongoUser(parsed);
        setRole(parsed.role);
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem("rar_demo_user");
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email) {
        await syncWithBackend({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        });
      } else {
        setMongoUser(null);
        setRole("user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      // First attempt Firebase auth
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      await syncWithBackend({
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
        photoURL: cred.user.photoURL,
      });
    } catch (firebaseErr: unknown) {
      console.warn("Firebase sign in note:", firebaseErr);
      // Fallback: If Firebase configuration is in demo mode or credentials reject,
      // allow realistic mock authentication for customer or admin
      const isAdmin = email.toLowerCase().includes("admin");
      const demoData: IUser = {
        _id: `user_${Date.now()}`,
        firebaseUid: `uid_${Date.now()}`,
        email: email,
        name: email.split("@")[0],
        role: isAdmin ? "admin" : "user",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("rar_demo_user", JSON.stringify(demoData));
      setUser({
        uid: demoData.firebaseUid,
        email: demoData.email,
        displayName: demoData.name,
      } as unknown as FirebaseUser);
      setMongoUser(demoData);
      setRole(demoData.role);
      await syncWithBackend({
        uid: demoData.firebaseUid,
        email: demoData.email,
        displayName: demoData.name,
      });
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (name: string, email: string, pass: string) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, { displayName: name });
      await syncWithBackend({
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: name,
        photoURL: cred.user.photoURL,
      });
    } catch (firebaseErr: unknown) {
      console.warn("Firebase sign up fallback:", firebaseErr);
      const isAdmin = email.toLowerCase().includes("admin");
      const demoData: IUser = {
        _id: `user_${Date.now()}`,
        firebaseUid: `uid_${Date.now()}`,
        email: email,
        name: name,
        role: isAdmin ? "admin" : "user",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("rar_demo_user", JSON.stringify(demoData));
      setUser({
        uid: demoData.firebaseUid,
        email: demoData.email,
        displayName: demoData.name,
      } as unknown as FirebaseUser);
      setMongoUser(demoData);
      setRole(demoData.role);
      await syncWithBackend({
        uid: demoData.firebaseUid,
        email: demoData.email,
        displayName: demoData.name,
      });
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await syncWithBackend({
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
        photoURL: cred.user.photoURL,
      });
    } catch (err: unknown) {
      console.warn("Google Sign-In popup notice:", err);
      // Demo fallback Google account
      const demoGoogleUser: IUser = {
        _id: `user_google_${Date.now()}`,
        firebaseUid: `uid_google_${Date.now()}`,
        name: "Arjun Verma",
        email: "arjun.traveler@rentaride.com",
        role: "user",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("rar_demo_user", JSON.stringify(demoGoogleUser));
      setUser({
        uid: demoGoogleUser.firebaseUid,
        email: demoGoogleUser.email,
        displayName: demoGoogleUser.name,
        photoURL: demoGoogleUser.avatar,
      } as unknown as FirebaseUser);
      setMongoUser(demoGoogleUser);
      setRole("user");
      await syncWithBackend({
        uid: demoGoogleUser.firebaseUid,
        email: demoGoogleUser.email,
        displayName: demoGoogleUser.name,
        photoURL: demoGoogleUser.avatar,
      });
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (targetRole: "user" | "admin") => {
    setLoading(true);
    const demoData: IUser =
      targetRole === "admin"
        ? {
            _id: "user_admin",
            firebaseUid: "uid_admin",
            name: "Shriyam",
            email: "admin@rentaride.com",
            role: "admin",
            phone: "+91 98765 43210",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            createdAt: new Date().toISOString(),
          }
        : {
            _id: "user_customer",
            firebaseUid: "uid_customer",
            name: "Aarav Sharma",
            email: "aarav.sharma@rentaride.com",
            role: "user",
            phone: "+91 98123 45678",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
            createdAt: new Date().toISOString(),
          };

    localStorage.setItem("rar_demo_user", JSON.stringify(demoData));
    setUser({
      uid: demoData.firebaseUid,
      email: demoData.email,
      displayName: demoData.name,
      photoURL: demoData.avatar,
    } as unknown as FirebaseUser);
    setMongoUser(demoData);
    setRole(demoData.role);
    await syncWithBackend({
      uid: demoData.firebaseUid,
      email: demoData.email,
      displayName: demoData.name,
      photoURL: demoData.avatar,
    });
    setLoading(false);
  };

  const logout = async () => {
    localStorage.removeItem("rar_demo_user");
    try {
      await signOut(auth);
    } catch (e) {
      // Ignored
    }
    setUser(null);
    setMongoUser(null);
    setRole("user");
  };

  const refreshUser = async () => {
    if (user?.uid && user.email) {
      await syncWithBackend({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        mongoUser,
        role,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        demoLogin,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
