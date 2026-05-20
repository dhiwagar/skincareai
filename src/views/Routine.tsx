"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";
import { Sun, Moon, ShoppingBag, ArrowLeft, RotateCcw } from "lucide-react";

export default function Routine() {
  const { analysis, isPaid } = useApp();
  const router = useRouter();

  // If page is accessed without payment (and not in dev)
  if (!isPaid && process.env.NODE_ENV === 'production') {
    return <div className="flex items-center justify-center min-h-screen">Redirecting to payment...</div>;
  }

  const products = analysis?.recommended_products || [];

  const routineSections = [
    {
      title: "Morning Routine",
      time: "AM",
      icon: <Sun className="w-6 h-6 text-orange-400" />,
      steps: analysis?.routine.am || []
    },
    {
      title: "Evening Routine",
      time: "PM",
      icon: <Moon className="w-6 h-6 text-indigo-400" />,
      steps: analysis?.routine.pm || []
    }
  ];

  return (
    <div className="flex flex-col items-center min-h-screen px-6 py-12 pb-32">
       <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-4xl"
      >
        <div className="flex items-center justify-between mb-12">
            <button onClick={() => router.push("/ai-analysis")} className="p-3 rounded-full bg-white/5 hover:bg-white/10">
               <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold italic tracking-tight">Skincare AI Routine</h2>
            <button onClick={() => router.push("/")} className="p-3 rounded-full bg-white/5 hover:bg-white/10">
               <RotateCcw className="w-5 h-5" />
            </button>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
            {/* Steps Column */}
            <div className="space-y-12">
                {routineSections.map((section, idx) => (
                    <motion.div 
                        key={section.time}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.2 }}
                        className="p-8 border border-white/5 rounded-[2.5rem] bg-neutral-900/50"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                {section.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{section.title}</h3>
                                <span className="text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase">{section.time} Ritual</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {section.steps.map((step, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full border border-white/10 bg-neutral-950 flex items-center justify-center text-xs font-bold">
                                            {i + 1}
                                        </div>
                                        {i < section.steps.length - 1 && (
                                            <div className="w-[1px] flex-1 bg-white/10 my-1" />
                                        )}
                                    </div>
                                    <div className="pb-4">
                                        <h4 className="font-bold text-neutral-200">{step}</h4>
                                        <p className="text-xs text-neutral-500 mt-1">Recommended for your {analysis?.tags[0] || 'skin'} profile.</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Products Column */}
            <div className="space-y-8">
                <div>
                   <h3 className="text-xl font-bold mb-2">Recommended Products</h3>
                   <p className="text-neutral-500 text-sm mb-8">Expert-picked essentials under ₹300.</p>
                </div>

                <div className="grid gap-4">
                    {products.map((p, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="group flex items-center gap-4 p-4 border border-white/5 rounded-3xl bg-neutral-900 hover:border-rose-500/30 transition-all cursor-pointer"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-neutral-950 flex items-center justify-center text-rose-500/20">
                                <ShoppingBag className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest">{p.type}</span>
                                <h4 className="font-bold text-sm">{p.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-md font-black italic">{p.price_range}</span>
                                    <span className="text-[10px] text-neutral-600">recommended</span>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-white/5 group-hover:bg-rose-500 group-hover:text-white rounded-full text-[10px] font-bold uppercase transition-colors">
                                Buy
                            </button>
                        </motion.div>
                    ))}
                </div>

                <div className="p-8 border border-white/5 bg-neutral-900 shadow-xl rounded-[2.5rem]">
                   <h4 className="font-bold mb-4">Pro Tip</h4>
                   <p className="text-sm text-neutral-500 leading-relaxed italic">
                      "Always patch test new products on your jawline for 24 hours before full application. Consistency is the secret to glowing skin."
                   </p>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
