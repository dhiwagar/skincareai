"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";
import { Check, ShieldCheck, Star, Loader2, QrCode, Smartphone, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import QRCode from "qrcode";

export default function Paywall() {
  const router = useRouter();
  const { isPaid, setIsPaid } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const upiLink = "upi://pay?pa=dhiwagar555@oksbi&pn=RentalApp&am=49&cu=INR";

  useEffect(() => {
    QRCode.toDataURL(upiLink, { margin: 2, scale: 10 }, (err, url) => {
      if (!err) setQrDataUrl(url);
    });
  }, []);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsPaid(true);
      setIsProcessing(false);
    }, 1500);
  };

  const benefits = [
    "Full Analysis Report",
    "Personalized Routine (AM/PM)",
    "Product Recommendations (Under ₹300)",
    "Ingredients Guide",
    "1-Week Progress Tracker"
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-500 mb-6">
                <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Unlock Your Routine</h2>
            <p className="text-neutral-400 px-6">Scan and pay to instantly see your personalized routine.</p>
        </div>

        <div className="relative p-8 border-2 border-rose-500 rounded-[2.5rem] bg-neutral-900 shadow-2xl overflow-hidden">
           <div className="absolute top-0 right-0 px-4 py-1.5 bg-rose-500 text-[10px] font-bold tracking-widest uppercase rounded-bl-2xl">
              {isPaid ? "Unlocked" : "Phase 1 Launch"}
           </div>
           
           <div className="mb-8">
              <span className="text-4xl font-bold">₹49</span>
              <span className="text-neutral-500 ml-2 text-sm italic">One-time scan</span>
           </div>

           <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-4">
                {benefits.map(b => (
                  <div key={b} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-rose-500" />
                    </div>
                    <span className="text-neutral-300 text-xs">{b}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl">
                 {isPaid ? (
                   <div className="w-32 h-32 rounded-2xl bg-emerald-50 flex flex-col items-center justify-center text-emerald-600">
                      <Check className="w-10 h-10 mb-2" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Paid</span>
                   </div>
                 ) : qrDataUrl ? (
                   <>
                    <img src={qrDataUrl} alt="UPI QR Code" className="w-32 h-32 mb-2" />
                    <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Scan with GPay/PhonePe</span>
                   </>
                 ) : (
                   <div className="w-32 h-32 bg-neutral-100 animate-pulse flex items-center justify-center rounded-lg">
                      <QrCode className="text-neutral-300 w-8 h-8" />
                   </div>
                 )}
              </div>
           </div>

           <div className="space-y-3 relative">
             {isProcessing && (
               <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl">
                 <Loader2 className="w-8 h-8 animate-spin text-rose-500 mb-2" />
                 <span className="text-xs font-bold text-neutral-400">Verifying Payment...</span>
               </div>
             )}

             {isPaid ? (
               <button
                 onClick={() => router.push("/routine")}
                 className="flex items-center justify-center gap-3 w-full py-4 bg-white text-black hover:bg-neutral-200 transition-colors rounded-2xl font-bold text-lg active:scale-95"
               >
                  View Routine
                  <ChevronRight className="w-5 h-5" />
               </button>
             ) : (
               <>
                 <a 
                   href={upiLink} 
                   onClick={handlePay}
                   className="flex items-center justify-center gap-3 w-full py-4 bg-rose-500 hover:bg-rose-600 transition-colors rounded-2xl font-bold text-lg shadow-xl shadow-rose-500/20 active:scale-95"
                 >
                    <Smartphone className="w-5 h-5" />
                    Pay via App (PhonePe)
                 </a>
               </>
             )}
           </div>

           <p className="mt-6 text-center text-xs text-neutral-600 px-4">
              {isPaid
                ? "Payment complete. Your routine and product picks are ready."
                : "Pay securely with any UPI app to unlock your results."}
           </p>
        </div>

        {/* Reviews */}
        <div className="mt-12 flex justify-center gap-12 opacity-50 grayscale">
            <div className="flex flex-col items-center">
               <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-rose-500 text-rose-500" />)}
               </div>
               <span className="text-[10px] font-bold">"Life changing"</span>
            </div>
            <div className="flex flex-col items-center">
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-rose-500 text-rose-500" />)}
               </div>
               <span className="text-[10px] font-bold">"Skin is glowing"</span>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
