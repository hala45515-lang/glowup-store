"use client";

import { motion } from "framer-motion";
import { Truck, Leaf, RefreshCcw, Sparkles } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "On all orders over $30. Fast, tracked delivery to your door.",
  },
  {
    icon: Leaf,
    title: "100% Cruelty Free",
    desc: "Every product is vegan, cruelty-free, and sustainably made.",
  },
  {
    icon: RefreshCcw,
    title: "30-Day Returns",
    desc: "Not satisfied? Return within 30 days, no questions asked.",
  },
  {
    icon: Sparkles,
    title: "AI Shade Match",
    desc: "Find your perfect shade in seconds with our AI technology.",
  },
];

export default function FeaturesBanner() {
  return (
    <section className="relative py-16 lg:py-20 px-6 lg:px-8">
      <div className="container relative mx-auto">
        <div className="relative mx-auto max-w-6xl rounded-[32px] bg-[#2C1810] px-6 py-12 sm:px-10 lg:px-14 lg:py-16 overflow-hidden">
          {/* Ambient glow decorations */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-[8%] w-[320px] h-[320px] rounded-full blur-3xl opacity-20"
            style={{ background: "radial-gradient(circle, #C4614A, transparent 70%)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-40 right-[6%] w-[380px] h-[380px] rounded-full blur-3xl opacity-15"
            style={{ background: "radial-gradient(circle, #E8A598, transparent 70%)" }}
          />

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5 }}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm transition-colors duration-300 hover:border-[#C4614A]/40 hover:bg-white/[0.06]"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#C4614A]/30 to-[#C4614A]/5 ring-1 ring-white/10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:ring-[#C4614A]/40">
                  <Icon className="h-6 w-6 text-[#E8A598] transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">{title}</h3>
                <p className="text-sm text-[#C4897A] leading-relaxed">{desc}</p>

                <span className="absolute bottom-0 left-7 right-7 h-px origin-left scale-x-0 bg-gradient-to-r from-[#C4614A] to-[#E8A598] transition-transform duration-300 group-hover:scale-x-100" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
