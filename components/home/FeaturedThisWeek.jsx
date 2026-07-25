"use client";

import { useState } from "react";
import ProductCard from "@/components/shop/ProductCard";
import HomeProductQuickViewModal from "./HomeProductQuickViewModal";

export default function FeaturedThisWeek({ products }) {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#C4614A]" />
            <span className="text-[11px] font-bold tracking-[0.28em] text-[#C4614A] uppercase">Hand-Picked</span>
            <div className="h-px w-8 bg-[#C4614A]" />
          </div>
          <h2 className="text-[40px] lg:text-[48px] font-black text-[#2C1810] mb-2 leading-tight">
            Featured This Week
          </h2>
          <div className="flex justify-center mb-4">
            <svg width="220" height="10" viewBox="0 0 220 10" fill="none">
              <path d="M0 5 Q27.5 0 55 5 Q82.5 10 110 5 Q137.5 0 165 5 Q192.5 10 220 5" stroke="#E8A598" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-[#7A4A3A] text-[15px] max-w-lg mx-auto">
            The shades our community can&apos;t stop reaching for — restocked, reviewed and ready for summer.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} onQuickView={setQuickViewProduct} />
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
