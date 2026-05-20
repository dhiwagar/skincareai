"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface ProductRecommendation {
  name: string;
  type: string;
  brand: string;
  price_range: string;
}

interface SkinData {
  hydration: number;
  oiliness: number;
  acne: number;
  dark_spots: number;
  summary: string;
  tags: string[];
  routine: {
    am: string[];
    pm: string[];
  };
  recommended_products: ProductRecommendation[];
}

interface AppContextType {
  user: User | null;
  isLoading: boolean;
  image: string | null;
  setImage: (img: string | null) => void;
  concern: string | null;
  setConcern: (c: string | null) => void;
  analysis: SkinData | null;
  setAnalysis: (d: SkinData | null) => void;
  isPaid: boolean;
  setIsPaid: (b: boolean) => void;
  saveScan: (data: SkinData, imageUrl: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [concern, setConcern] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<SkinData | null>(null);
  const [isPaid, setIsPaidState] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("skinChatPaid") === "true";
  });

  const setIsPaid = (paid: boolean) => {
    setIsPaidState(paid);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("skinChatPaid", String(paid));
    }
  };

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsLoading(false);
    });
  }, []);

  const saveScan = async (data: SkinData, imageUrl: string) => {
    if (!user) return;
    const path = `users/${user.uid}/scans`;
    try {
      await addDoc(collection(db, path), {
        ...data,
        imageUrl,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  return (
    <AppContext.Provider 
      value={{ 
        user, isLoading,
        image, setImage, 
        concern, setConcern, 
        analysis, setAnalysis,
        isPaid, setIsPaid,
        saveScan
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
