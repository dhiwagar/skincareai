"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";
import { Camera, CheckCircle2 } from "lucide-react";

export default function SkinPortrait() {
  const router = useRouter();
  const { concern, setConcern, setImage } = useApp();

  const concerns = [
    { id: "acne", label: "Acne", desc: "Breakouts, spots, or congestion" },
    { id: "pigmentation", label: "Pigmentation", desc: "Dark spots or uneven tone" },
    { id: "oiliness", label: "Oiliness", desc: "Excess shine or large pores" },
    { id: "dryness", label: "Dryness", desc: "Flaky skin or tightness" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <h2 className="mb-2 text-3xl font-bold">What is your main concern?</h2>
        <p className="mb-8 text-neutral-400">Select one to help the AI focus on what matters most to you.</p>

        <div className="grid gap-4 mb-12">
          {concerns.map((c) => (
            <button
              key={c.id}
              onClick={() => setConcern(c.id)}
              className={`flex items-center justify-between p-6 transition-all border rounded-2xl text-left ${
                concern === c.id 
                ? "bg-rose-500/10 border-rose-500 ring-1 ring-rose-500" 
                : "bg-neutral-900 border-white/5 hover:border-white/20"
              }`}
            >
              <div>
                <h4 className="font-bold">{c.label}</h4>
                <p className="text-sm text-neutral-500">{c.desc}</p>
              </div>
              {concern === c.id && <CheckCircle2 className="text-rose-500" />}
            </button>
          ))}
        </div>

        <div className="p-8 mb-10 border border-white/5 rounded-3xl bg-neutral-900/50">
          <div className="flex items-center gap-4 mb-4 text-rose-400">
             <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-500/20">
                <Camera className="w-5 h-5" />
             </div>
             <span className="font-semibold italic">Ready for your scan?</span>
          </div>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Ensure you use natural lighting and remove any makeup or glasses for the most accurate GPT analysis.
          </p>
        </div>

        <div className="grid gap-4">
          <button
            disabled={!concern}
            onClick={() => router.push("/camera-scan")}
            className="w-full py-5 text-lg font-bold transition-all bg-white rounded-2xl text-neutral-950 hover:bg-neutral-100 disabled:opacity-50 disabled:hover:scale-100 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Start Camera Scan
          </button>

          <label className={`w-full py-5 text-lg font-bold transition-all border border-white/10 rounded-2xl text-center cursor-pointer hover:bg-white/5 active:scale-[0.98] flex items-center justify-center gap-2 ${!concern ? 'opacity-50 pointer-events-none' : ''}`}>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImage(reader.result as string);
                    router.push("/ai-analysis");
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            Upload Photo
          </label>
        </div>
      </motion.div>
    </div>
  );
}
