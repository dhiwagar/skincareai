"use client";

import { useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";
import { X, RotateCcw } from "lucide-react";

export default function CameraScan() {
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();
  const { setImage } = useApp();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      router.push("/ai-analysis");
    }
  }, [webcamRef, setImage, router]);


  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black overflow-hidden">
      {/* Background Webcam */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: "user",
            width: 1280,
            height: 720
          }}
          mirrored={true}
          className="h-full w-full object-cover"
          disablePictureInPicture={true}
          forceScreenshotSourceSize={false}
          imageSmoothing={true}
          onUserMedia={() => {}}
          onUserMediaError={() => {}}
          minScreenshotHeight={0}
          minScreenshotWidth={0}
          screenshotQuality={0.92}
        />

        {/* Overlay Mask */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Darkened edges */}
          <div className="absolute inset-0 bg-black/60 [mask-image:radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,black_70%)]" />
          
          {/* Guide Circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[80vw] max-w-[320px] aspect-[3/4] border-2 border-white/30 rounded-[100px] relative">
               <div className="absolute inset-0 border-4 border-dashed border-rose-500/50 rounded-[100px] animate-pulse" />
               {/* Scanning Bar */}
               <motion.div 
                 animate={{ top: ['0%', '100%', '0%'] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                 className="absolute left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)] z-20"
               />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute top-12 left-0 right-0 z-30 text-center px-6">
          <h2 className="text-xl font-bold mb-2">Align your face</h2>
          <p className="text-white/60 text-sm">Keep your head centered and stay still</p>
        </div>

      </div>

      {/* Controls */}
      <div className="h-48 bg-neutral-950/80 backdrop-blur-xl flex items-center justify-around px-8 z-50 border-t border-white/10 pb-8">
        <button 
          onClick={() => router.push("/")}
          className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="relative flex flex-col items-center gap-2">
          <button 
            onClick={capture}
            className="relative p-1 bg-white rounded-full transition-all hover:scale-110 active:scale-90 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            <div className="w-20 h-20 border-4 border-black rounded-full flex items-center justify-center">
               <div className="w-16 h-16 bg-black rounded-full hover:bg-neutral-800 transition-colors" />
            </div>
          </button>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Capture</span>
        </div>

        <button className="p-4 rounded-full bg-white/5 opacity-40">
          <RotateCcw className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}
