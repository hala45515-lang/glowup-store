"use client";

import { useState } from "react";
import ProductShape from "./ProductShape";

const CATEGORY_FALLBACK = {
  lips: { shape: "lipstick", glow: "rgba(196,97,74,0.4)" },
  eyes: { shape: "mascara", glow: "rgba(60,32,16,0.45)" },
  face: { shape: "compact", glow: "rgba(196,160,96,0.4)" },
  skin: { shape: "bottle", glow: "rgba(196,160,96,0.4)" },
  fragrance: { shape: "bottle", glow: "rgba(196,120,150,0.4)" },
};

export default function ProductImage({ src, alt, category, padding = "p-6" }) {
  const [failed, setFailed] = useState(false);
  const fallback = CATEGORY_FALLBACK[category];

  if (!src || failed) {
    if (fallback) {
      return <ProductShape shape={fallback.shape} glow={fallback.glow} />;
    }
    return (
      <div className="absolute inset-0 flex items-center justify-center text-center px-4 text-[11px] font-medium text-[#7A4A3A]/60">
        {alt || "No image available"}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`absolute inset-0 w-full h-full object-contain ${padding}`}
    />
  );
}
