"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const PLUS_POSITIONS = [
  { top: "12%", left: "10%", size: 16, opacity: 0.3 },
  { top: "68%", left: "6%", size: 12, opacity: 0.22 },
  { top: "30%", left: "22%", size: 10, opacity: 0.18 },
  { top: "80%", left: "30%", size: 14, opacity: 0.26 },
  { top: "18%", right: "14%", size: 12, opacity: 0.26 },
  { top: "48%", right: "8%", size: 16, opacity: 0.3 },
  { top: "76%", right: "18%", size: 10, opacity: 0.18 },
];

const SPARKLES = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  left: 15 + i * 22,
  top: 12 + ((i * 31) % 70),
  delay: i * 0.7,
  duration: 3 + (i % 3) * 0.6,
}));

export default function AuthShell({ eyebrow, title, subtitle, children }) {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2 bg-[#FFF8F5] overflow-hidden">
      {/* Decorative panel */}
      <div
        className="relative hidden lg:flex flex-col justify-center px-16 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #2C1810, #3D2018, #2C1810)" }}
      >
        {PLUS_POSITIONS.map((pos, i) => (
          <div key={i} className="absolute pointer-events-none" style={{ top: pos.top, left: pos.left, right: pos.right, opacity: pos.opacity }}>
            <svg width={pos.size} height={pos.size} viewBox="0 0 16 16" fill="none">
              <path d="M8 1V15M1 8H15" stroke="#E8A598" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        ))}
        {SPARKLES.map((s) => (
          <motion.span
            key={s.id}
            aria-hidden
            className="absolute text-white/30 pointer-events-none"
            style={{ left: `${s.left}%`, top: `${s.top}%`, fontSize: 14 }}
            animate={{ opacity: [0, 1, 0], scale: [0.6, 1, 0.6], y: [0, -12, 0] }}
            transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          >
            ✦
          </motion.span>
        ))}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 30% 30%, rgba(196,97,74,0.16), transparent 65%)" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-sm"
        >
          <Link href="/" className="inline-block mb-10">
            <span
              className="text-[30px] font-black italic tracking-tight leading-none"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              <span className="text-[#E8A598]">Glow</span>
              <span className="text-white">Cart</span>
            </span>
          </Link>

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 shadow-lg"
            style={{ background: "linear-gradient(135deg, #C4614A, #E8A598, #D4697A)" }}>
            <Sparkles className="h-6 w-6 text-white" />
          </div>

          <h2 className="text-[34px] font-black text-white leading-tight mb-4" style={{ fontFamily: "Georgia, serif" }}>
            Your glow, remembered.
          </h2>
          <p className="text-[15px] text-[#C4897A] leading-relaxed">
            Save your favourites, track orders, and get shade recommendations tailored just for you.
          </p>
        </motion.div>
      </div>

      {/* Form panel */}
      <div className="relative flex items-center justify-center px-6 py-16">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full blur-3xl opacity-25"
          style={{ background: "radial-gradient(circle, #F2D4C8, transparent 70%)" }}
          animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-[400px]"
        >
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-block">
              <span
                className="text-[26px] font-black italic tracking-tight"
                style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
              >
                <span className="text-[#C4614A]">Glow</span>
                <span className="text-[#2C1810]">Cart</span>
              </span>
            </Link>
          </div>

          <p className="text-[11px] font-bold tracking-[0.25em] text-[#C4614A] uppercase mb-2">{eyebrow}</p>
          <h1 className="text-[32px] font-black text-[#2C1810] leading-tight mb-2" style={{ fontFamily: "Georgia, serif" }}>
            {title}
          </h1>
          <p className="text-[14px] text-[#7A4A3A] mb-8">{subtitle}</p>

          {children}
        </motion.div>
      </div>
    </section>
  );
}
