"use client";

import { useApp } from "../context/AppContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { isLoading } = useApp();
  const router = useRouter();

  if (isLoading) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 bg-neutral-950/50 backdrop-blur-md border-b border-white/5">
      <div 
        onClick={() => router.push("/")}
        className="text-xl font-black italic cursor-pointer hover:text-rose-500 transition-colors"
      >
        Skincare AI
      </div>
    </nav>
  );
}
