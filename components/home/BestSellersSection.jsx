"use client";

import { useState } from "react";
import HomeProductQuickViewModal from "./HomeProductQuickViewModal";
import ProductCard from "@/components/shop/ProductCard";

export default function BestSellersSection({ products }) {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <section className="py-16 lg:py-20" style={{ backgroundColor: "#F2D4C8" }}>
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#C4614A]" />
            <span className="text-[11px] font-bold tracking-[0.3em] text-[#C4614A] uppercase">
              Crowd Favourites
            </span>
            <div className="h-px w-8 bg-[#C4614A]" />
          </div>
          <h2 className="text-[42px] lg:text-[52px] font-black text-[#2C1810] leading-tight mb-2">
            Best Sellers
          </h2>
          <div className="flex justify-center mb-4">
            <svg width="180" height="10" viewBox="0 0 180 10" fill="none">
              <path d="M0 5 Q22.5 0 45 5 Q67.5 10 90 5 Q112.5 0 135 5 Q157.5 10 180 5" stroke="#C4614A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-[#7A4A3A] text-[15px]">
            The icons. Loved, repurchased and reviewed thousands of times over.
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
