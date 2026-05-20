"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Camera, Brain, Zap, ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const chips = ["Acne", "Dark Spots", "Oily Skin", "Dry Skin", "Aging"];
  
  const features = [
    { icon: <Camera className="w-6 h-6" />, title: "AI Face Scan", desc: "Instant high-res skin capture" },
    { icon: <Brain className="w-6 h-6" />, title: "GPT Analysis", desc: "Derm-grade AI assessment" },
    { icon: <Zap className="w-6 h-6" />, title: "Instant Results", desc: "Analysis in under 10 seconds" },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-4xl px-6 pt-20 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
            AI Skin Analysis <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
              in 10 Seconds
            </span>
          </h1>
          <p className="max-w-xl mx-auto mb-10 text-lg text-neutral-400">
            Scan your face. Identify skin concerns. Get a professional routine instantly, tailored for your skin type.
          </p>

          <button
            onClick={() => router.push("/skin-portrait")}
            className="group relative px-8 py-4 text-lg font-semibold transition-all bg-white rounded-full text-neutral-950 hover:scale-105 active:scale-95"
          >
            Start Scan
            <ArrowRight className="inline-block ml-2 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </section>

      {/* Chips */}
      <div className="flex flex-wrap justify-center gap-3 px-6 mb-20 max-w-2xl">
        {chips.map((chip, i) => (
          <motion.span
            key={chip}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="px-5 py-2 text-sm border rounded-full border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-default"
          >
            {chip}
          </motion.span>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 px-6 mb-20 md:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="p-8 border rounded-3xl border-white/10 bg-neutral-900/50 backdrop-blur-sm"
          >
            <div className="flex items-center justify-center w-12 h-12 mb-6 rounded-2xl bg-rose-500/20 text-rose-400">
              {f.icon}
            </div>
            <h3 className="mb-2 text-xl font-bold">{f.title}</h3>
            <p className="text-neutral-500">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Demo Section */}
      <section className="w-full max-w-5xl px-6 pb-32">
        <div className="relative overflow-hidden group aspect-video rounded-3xl border border-white/10 bg-neutral-900 shadow-2xl">
           <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center text-neutral-700 text-sm italic">
             App visualization guide
           </div>
           {/* Mock Result Preview */}
           <div className="absolute inset-0 flex items-center justify-center p-12 blur-sm group-hover:blur-md transition-all">
              <div className="w-full h-full border-4 border-rose-500/30 rounded-2xl p-8">
                 <div className="h-8 w-48 bg-white/10 rounded-full mb-4" />
                 <div className="h-4 w-72 bg-white/5 rounded-full mb-8" />
                 <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-white/5 rounded-2xl" />
                    <div className="h-24 bg-white/5 rounded-2xl" />
                 </div>
              </div>
           </div>
           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => router.push("/skin-portrait")}
                className="px-6 py-3 bg-white text-black rounded-full font-bold shadow-xl"
              >
                Experience Now
              </button>
           </div>
        </div>
      </section>
    </div>
  );
}
