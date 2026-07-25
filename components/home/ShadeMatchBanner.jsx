"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check } from "lucide-react";

const SKIN_TONES = [
  { color: "#F5E6D0", name: "Porcelain" },
  { color: "#EDD5B0", name: "Ivory" },
  { color: "#DDB882", name: "Honey" },
  { color: "#C9956A", name: "Tan" },
  { color: "#A0673A", name: "Caramel" },
  { color: "#7D4A28", name: "Almond" },
  { color: "#5C3018", name: "Espresso" },
  { color: "#2C1008", name: "Ebony" },
];

const SPARKLES = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  left: 12 + i * 18,
  top: 8 + ((i * 29) % 70),
  size: 10 + (i % 3) * 4,
  delay: i * 0.5,
  duration: 3 + (i % 3) * 0.5,
}));

export default function ShadeMatchBanner() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="bg-[#FFF8F5] py-10 lg:py-14">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden px-10 py-14 lg:px-16 lg:py-16"
          style={{ background: "linear-gradient(135deg, #7C3554, #9B4468, #7C3554)" }}
        >
          {/* Decorative bg circles, drifting */}
          <motion.div
            aria-hidden
            className="absolute top-[-80px] right-[30%] w-64 h-64 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #C4617A, transparent)" }}
            animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="absolute bottom-[-60px] left-[10%] w-48 h-48 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #E8A0B8, transparent)" }}
            animate={{ x: [0, -20, 0], y: [0, -25, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />

          {/* Floating sparkles */}
          {SPARKLES.map((s) => (
            <motion.span
              key={s.id}
              aria-hidden
              className="absolute text-white/40 pointer-events-none"
              style={{ left: `${s.left}%`, top: `${s.top}%`, fontSize: s.size }}
              animate={{ opacity: [0, 1, 0], scale: [0.6, 1, 0.6], y: [0, -12, 0] }}
              transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
            >
              ✦
            </motion.span>
          ))}

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left */}
            <div>
              <motion.p
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
                className="text-[11px] font-bold tracking-[0.3em] text-[#E8A0B8] uppercase mb-4"
              >
                40 Inclusive Shades
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-[40px] lg:text-[48px] font-black text-white leading-tight mb-5"
              >
                Find Your<br />Perfect Shade
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-[15px] text-[#D4A0B8] leading-relaxed mb-8 max-w-sm"
              >
                Answer three quick questions and our Shade Match finds
                your flawless base in seconds — undertone, coverage and finish.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link
                  href="/shade-match"
                  className="group relative inline-flex items-center gap-2.5 overflow-hidden px-7 py-3.5 rounded-full border-2 border-white/60 text-white font-semibold text-[14px] hover:bg-white/10 hover:border-white transition-colors"
                >
                  <span className="absolute inset-y-0 w-1/3 -skew-x-[20deg] bg-white/20 -translate-x-[200%] group-hover:translate-x-[380%] transition-transform duration-700 ease-out" />
                  <Sparkles className="h-4 w-4" />
                  Try Shade Match
                </Link>
              </motion.div>
            </div>

            {/* Right — skin tone circles */}
            <div className="flex flex-col items-center lg:items-end gap-4">
              <div className="grid grid-cols-4 gap-4">
                {SKIN_TONES.map((tone, i) => {
                  const isSelected = selected === i;
                  return (
                    <motion.button
                      key={i}
                      type="button"
                      onClick={() => setSelected(isSelected ? null : i)}
                      initial={{ opacity: 0, scale: 0.4, y: 16 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.4, delay: 0.05 * i, type: "spring", stiffness: 260, damping: 18 }}
                      whileHover={{ scale: 1.14, y: -4 }}
                      whileTap={{ scale: 0.94 }}
                      className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full cursor-pointer"
                      style={{
                        backgroundColor: tone.color,
                        boxShadow: isSelected
                          ? "0 0 0 3px rgba(255,255,255,0.9), 0 8px 20px rgba(0,0,0,0.35), inset 0 2px 4px rgba(255,255,255,0.2)"
                          : "0 4px 16px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.2)",
                      }}
                      aria-label={tone.name}
                    >
                      <AnimatePresence>
                        {isSelected && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.4 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.4 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/25"
                          >
                            <Check className="h-6 w-6 text-white" strokeWidth={3} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                {selected !== null && (
                  <motion.p
                    key={selected}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.25 }}
                    className="text-[13px] font-semibold text-white/90 tracking-wide"
                  >
                    {SKIN_TONES[selected].name} selected — try Shade Match to confirm →
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
