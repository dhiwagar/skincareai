"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Loader2, AlertCircle, ChevronRight, Activity, Zap } from "lucide-react";

export default function AIAnalysis() {
  const { image, concern, setAnalysis, analysis, saveScan } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(!analysis);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!image) {
      router.push("/");
      return;
    }

    if (analysis) return;

    const performAnalysis = async () => {
      try {
        const response = await fetch("/api/analyze-skin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image, concern }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Analysis failed");
        }
        
        const data = await response.json();
        setAnalysis(data);
        setLoading(false);
        
        // Auto-save if user is logged in
        if (image) {
          saveScan(data, image).catch(e => console.error("Auto-save failed:", e));
        }
      } catch (err) {
        console.error("AI Error:", err);
        setError(err instanceof Error ? err.message : "Failed to analyze skin. Please check your configuration and try again.");
        setLoading(false);
      }
    };

    performAnalysis();
  }, [image, concern, analysis, setAnalysis, saveScan, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="relative w-24 h-24 mb-8">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 border-t-4 border-rose-500 rounded-full"
           />
           <Loader2 className="absolute inset-0 m-auto w-8 h-8 animate-spin text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Analyzing Skin Health</h2>
        <p className="text-neutral-500 max-w-xs mx-auto animate-pulse"> 
          AI is mapping your face and identifying skin concerns...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h2 className="text-2xl font-bold mb-4">Analysis Failed</h2>
        <p className="text-neutral-500 mb-8">{error}</p>
        <button onClick={() => router.push("/camera-scan")} className="px-8 py-3 bg-white text-black rounded-full font-bold">
           Try Again
        </button>
      </div>
    );
  }

  const chartData = [
    { subject: 'Hydration', A: analysis?.hydration || 0 },
    { subject: 'Oiliness', A: analysis?.oiliness || 0 },
    { subject: 'Acne', A: analysis?.acne || 0 },
    { subject: 'Dark Spots', A: analysis?.dark_spots || 0 },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl"
      >
        <div className="flex items-center gap-2 mb-8 text-neutral-400">
           <Activity className="w-4 h-4" />
           <span className="text-sm font-medium tracking-widest uppercase">Analysis Complete</span>
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          {/* Visuals */}
          <div className="space-y-8">
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 group bg-neutral-900">
               <img src={image!} alt="Face Analysis" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />
               {/* Analysis Tag */}
               <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                 {analysis?.tags.map(tag => (
                   <span key={tag} className="px-3 py-1 text-[10px] bg-rose-500 rounded-full font-bold tracking-wider uppercase">
                     {tag}
                   </span>
                 ))}
               </div>
            </div>

            <div className="p-8 border border-white/5 bg-neutral-900/50 rounded-3xl">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <Zap className="w-5 h-5 text-orange-400" />
                 AI Summary
               </h3>
               <p className="text-neutral-400 leading-relaxed italic border-l-2 border-rose-500/30 pl-4">
                 "{analysis?.summary}"
               </p>
            </div>
          </div>

          {/* Scores */}
          <div className="flex flex-col justify-center gap-8">
            <div className="h-[300px] w-full bg-neutral-900/30 rounded-3xl p-4 border border-white/5">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12 }} />
                  <Radar
                    name="Skin Health"
                    dataKey="A"
                    stroke="#f43f5e"
                    fill="#f43f5e"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
               {chartData.map(item => (
                 <div key={item.subject}>
                    <div className="flex justify-between text-sm font-medium mb-2">
                       <span className="text-neutral-400">{item.subject}</span>
                       <span>{item.A}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${item.A}%` }}
                         transition={{ duration: 1, delay: 0.5 }}
                         className={`h-full rounded-full ${item.A > 70 ? 'bg-rose-500' : item.A > 40 ? 'bg-orange-400' : 'bg-emerald-400'}`}
                       />
                    </div>
                 </div>
               ))}
            </div>

            <button
               onClick={() => router.push("/paywall")}
               className="group flex items-center justify-between w-full p-6 bg-white text-black rounded-3xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Unlock Routine & Products</span>
              <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
