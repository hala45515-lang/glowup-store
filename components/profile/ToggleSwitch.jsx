"use client";

import { motion } from "framer-motion";

export default function ToggleSwitch({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
        disabled ? "bg-[#EDD8CC] cursor-not-allowed" : checked ? "bg-[#C4614A]" : "bg-[#E8C4B8]"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow"
        style={{ x: checked ? 20 : 0 }}
      />
    </button>
  );
}
