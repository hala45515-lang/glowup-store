"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HomeProductQuickViewModal from "./HomeProductQuickViewModal";
import ProductCard from "@/components/shop/ProductCard";

export default function JustLanded({ products }) {
  const scrollRef = useRef(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  function scroll(dir) {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
    }
  }

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-[#C4614A]" />
              <span className="text-[11px] font-bold tracking-[0.28em] text-[#C4614A] uppercase">Fresh Drops</span>
            </div>
            <h2 className="text-[40px] lg:text-[48px] font-black text-[#2C1810] leading-tight mb-1">
              Just Landed
            </h2>
            <svg width="160" height="10" viewBox="0 0 160 10" fill="none">
              <path d="M0 5 Q20 0 40 5 Q60 10 80 5 Q100 0 120 5 Q140 10 160 5" stroke="#E8A598" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
            <p className="text-[#7A4A3A] text-[14px] mt-3">
              Brand-new formulas, straight off the bench. Be the first to wear them.
            </p>
          </div>
          {/* Arrows */}
          <div className="hidden md:flex gap-2 shrink-0">
            <button
              onClick={() => scroll(-1)}
              className="w-11 h-11 rounded-full border-2 border-[#E8C4B8] flex items-center justify-center text-[#2C1810] hover:border-[#C4614A] hover:text-[#C4614A] transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-11 h-11 rounded-full border-2 border-[#E8C4B8] flex items-center justify-center text-[#2C1810] hover:border-[#C4614A] hover:text-[#C4614A] transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Horizontal scroll */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-3"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((p, i) => (
            <div key={p.id} className="shrink-0 w-[260px]">
              <ProductCard product={p} index={i} onQuickView={setQuickViewProduct} />
            </div>
          ))}
        </div>
      </div>

      {quickViewProduct && (
        <HomeProductQuickViewModal
          product={quickViewProduct}
          relatedProducts={products.filter((p) => p.id !== quickViewProduct.id)}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </section>
  );
}
