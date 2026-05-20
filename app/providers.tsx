"use client";

import type { ReactNode } from "react";
import { AppProvider } from "../src/context/AppContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-rose-500/30">
        {children}
      </div>
    </AppProvider>
  );
}
