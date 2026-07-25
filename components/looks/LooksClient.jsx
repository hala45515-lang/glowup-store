"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ShoppingBag, Clock } from "lucide-react";
import LookDetailModal from "./LookDetailModal";

export default function LooksClient({ looks }) {
  const [activeMood, setActiveMood] = useState("All");
  const [activeLook, setActiveLook] = useState(null);

  const moods = ["All", ...new Set(looks.map((l) => l.mood))];
  const filtered = activeMood === "All" ? looks : looks.filter((l) => l.mood === activeMood);

  return (
    <div className="bg-[#FFF8F5] min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        className="relative w-full py-20 px-6 overflow-hidden"
        style={{ background: "linear-gradient(180deg,#EDD8C8 0%,#FFF8F5 100%)" }}
      >
        <div
          aria-hidden
          className="absolute -top-24 -left-24 w-[380px] h-[380px] rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: "#C4614A" }}
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -right-16 w-[300px] h-[300px] rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: "#7A3060" }}
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-5xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center gap-2 mb-5"
          >
            <Sparkles className="h-4 w-4 text-[#C4614A]" />
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#C4614A] uppercase">
              The Lookbook
            </span>
          </motion.div>
          <h1
            className="text-[48px] lg:text-[64px] font-black text-[#2C1810] leading-[1.05] mb-5"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Get The Look
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#7A4A3A] text-[16px] max-w-[460px] mx-auto leading-relaxed"
          >
            Curated makeup looks, ready to shop. Pick a mood, browse the edit, and get every product in one click.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Mood filter ───────────────────────────────────────────────── */}
      <section className="max-w-[1240px] mx-auto px-6 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex gap-3 flex-wrap justify-center mb-12"
        >
          {moods.map((mood) => {
            const isActive = activeMood === mood;
            return (
              <motion.button
                key={mood}
                onClick={() => setActiveMood(mood)}
                whileTap={{ scale: 0.94 }}
                whileHover={{ y: -2 }}
                className={`relative z-0 px-5 py-2.5 rounded-full text-sm font-semibold border-2 overflow-hidden transition-colors duration-200 ${
                  isActive
                    ? "border-[#C4614A] text-white shadow-md"
                    : "border-[#E8C4B8] text-[#2C1810] hover:border-[#C4614A] hover:text-[#C4614A]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="moodActivePill"
                    className="absolute inset-0 -z-10 bg-[#C4614A]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {mood}
              </motion.button>
            );
          })}
        </motion.div>
      </section>

      {/* ── Looks grid ────────────────────────────────────────────────── */}
      <section className="max-w-[1240px] mx-auto px-6 pb-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((look, i) => (
            <motion.button
              key={look.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              whileHover={{ y: -6 }}
              onClick={() => setActiveLook(look)}
              className="group relative rounded-3xl overflow-hidden aspect-[3/4] text-left shadow-[0_4px_20px_rgba(196,97,74,0.08)] hover:shadow-xl transition-shadow duration-300"
            >
              {look.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={look.image}
                  alt={look.name}
                  loading="lazy"
                  className={`absolute inset-0 w-full h-full object-cover transition-[transform,opacity] duration-500 group-hover:scale-105 ${
                    look.detailImage ? "group-hover:opacity-0" : ""
                  }`}
                />
              ) : (
                <div className="absolute inset-0 bg-[#F2D4C8] flex items-center justify-center text-[56px]">✨</div>
              )}
              {look.detailImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={look.detailImage}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-0 scale-105 transition-opacity duration-500 group-hover:opacity-100"
                />
              )}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.65) 100%)" }}
              />

              {/* Badges */}
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 text-[10px] font-black tracking-[0.15em] text-[#2C1810] uppercase">
                {look.tag}
              </span>
              <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/35 backdrop-blur-sm text-[10px] font-black tracking-[0.15em] text-white uppercase">
                {look.mood}
              </span>

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white font-black text-[20px] mb-1 leading-tight">{look.name}</h3>
                <div className="flex items-center gap-3 mb-3">
                  {look.duration && (
                    <span className="inline-flex items-center gap-1 text-white/75 text-[12px]">
                      <Clock className="h-3 w-3" />
                      {look.duration}
                    </span>
                  )}
                  <span className="text-white/75 text-[12px]">{look.products.length} products</span>
                  <span className="text-white font-black text-[15px] ml-auto">${look.total}</span>
                </div>
                <div className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span className="inline-flex items-center gap-2 bg-white text-[#2C1810] px-4 py-2.5 rounded-full font-semibold text-[13px]">
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Shop This Look
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <LookDetailModal look={activeLook} onClose={() => setActiveLook(null)} />
    </div>
  );
}
