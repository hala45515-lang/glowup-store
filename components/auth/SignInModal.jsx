"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import GoogleIcon from "@/components/auth/GoogleIcon";

const SPARKLES = [
  { left: "12%", top: "20%", delay: 0 },
  { left: "85%", top: "18%", delay: 0.6 },
  { left: "22%", top: "72%", delay: 1.1 },
  { left: "78%", top: "68%", delay: 0.4 },
];

export default function SignInModal({ open, onClose }) {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  async function handleGoogle() {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Welcome to GlowCart!");
      onClose();
    } catch (error) {
      if (error?.code !== "auth/popup-closed-by-user" && error?.code !== "auth/cancelled-popup-request") {
        toast.error("Couldn't sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[380px] bg-white rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Decorative header */}
            <div
              className="relative px-8 pt-10 pb-16 text-center overflow-hidden"
              style={{ background: "linear-gradient(160deg, #2C1810, #3D2018, #2C1810)" }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              {SPARKLES.map((s, i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  className="absolute text-white/30 pointer-events-none"
                  style={{ left: s.left, top: s.top, fontSize: 14 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.6, 1, 0.6], y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
                >
                  ✦
                </motion.span>
              ))}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 20%, rgba(196,97,74,0.22), transparent 65%)" }}
              />

              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                className="relative z-10 inline-flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg"
                style={{ background: "linear-gradient(135deg, #C4614A, #E8A598, #D4697A)" }}
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="relative z-10 text-[22px] font-black text-white mt-4"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Welcome to GlowCart
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="relative z-10 text-[13px] text-[#C4897A] mt-1.5 max-w-[260px] mx-auto leading-relaxed"
              >
                Sign in to save your favourites, track orders, and get picks made for you.
              </motion.p>
            </div>

            {/* Body */}
            <div className="px-8 pb-8 -mt-6 relative z-10">
              <motion.button
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogle}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-white border border-[#E8C4B8] shadow-lg hover:shadow-xl hover:border-[#C4614A] text-[#2C1810] font-semibold text-[15px] flex items-center justify-center gap-3 transition-all disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <GoogleIcon className="h-5 w-5" />}
                Continue with Google
              </motion.button>
              <p className="text-center text-[11px] text-[#C4A090] mt-5 leading-relaxed">
                By continuing, you agree to GlowCart&apos;s Terms &amp; Privacy Policy.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
