import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { googleProvider } from "@/lib/firebase";
import { api } from "@/lib/api";
import { wsClient } from "@/lib/websocket";
import type { UserWithDetails } from "@shared/schema";

interface AuthContextType {
  currentUser: UserWithDetails | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserWithDetails | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      
      if (user) {
        try {
          const userData = await api.getCurrentUser();
          setCurrentUser(userData);
          wsClient.connect(userData.id);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
        wsClient.disconnect();
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    await api.registerUser({
      firebaseUid: userCredential.user.uid,
      email: userCredential.user.email!,
      ...userData,
    });
  };

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    
    try {
      await api.getCurrentUser();
    } catch (error) {
      await api.registerUser({
        firebaseUid: result.user.uid,
        email: result.user.email!,
        name: result.user.displayName || "Usuario",
        birthdate: new Date("2000-01-01"),
        gender: "hombre",
      });
    }
  };

  const logout = async () => {
    wsClient.disconnect();
    await signOut(auth);
  };

  const value = {
    currentUser,
    firebaseUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
