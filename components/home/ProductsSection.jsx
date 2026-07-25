"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/shop/ProductCard";
import HomeProductQuickViewModal from "./HomeProductQuickViewModal";
import { CATEGORIES as BASE_CATEGORIES } from "@/lib/products";

const CATEGORIES = [
  { id: "all", label: "All", emoji: "✨" },
  ...BASE_CATEGORIES.filter((c) => c.id !== "fragrance"),
];

export default function ProductsSection({ products }) {
  const [active, setActive]               = useState("all");
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const filtered =
    active === "all"
      ? products
      : products.filter((p) => p.category === active);

  const relatedFor = (product) =>
    products.filter((p) => p.id !== product.id && p.category === product.category)
      .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
      .slice(0, 4);

  return (
    <section className="relative bg-[#FFF8F5] py-16 lg:py-20 overflow-hidden">
      {/* Ambient decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-[-6%] w-[380px] h-[380px] rounded-full blur-3xl opacity-25"
        style={{ background: "radial-gradient(circle, #F2D4C8, transparent 70%)" }}
      />

      <div className="container relative mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-[11px] font-bold tracking-[0.25em] text-[#C4614A] uppercase mb-2">
              — Explore Products
            </p>
            <h2 className="text-3xl lg:text-4xl font-black text-[#2C1810]">Shop by Category</h2>
          </div>
          <a
            href="/shop"
            className="group hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-[#C4614A]"
          >
            View All
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </motion.div>

        {/* Category pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex gap-3 flex-wrap mb-10"
        >
          {CATEGORIES.map((cat) => {
            const isActive = active === cat.id;
            return (
              <motion.button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                whileTap={{ scale: 0.94 }}
                whileHover={{ y: -2 }}
                className={`relative z-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border-2 overflow-hidden transition-colors duration-200 ${
                  isActive
                    ? "border-[#C4614A] text-white shadow-md"
                    : "border-[#E8C4B8] text-[#2C1810] hover:border-[#C4614A] hover:text-[#C4614A]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="categoryActivePill"
                    className="absolute inset-0 -z-10 bg-[#C4614A]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span>{cat.emoji}</span>
                {cat.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Products grid */}
        {filtered.length > 0 ? (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-[#7A4A3A]"
          >
            No products in this category yet.
          </motion.div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <HomeProductQuickViewModal
          product={quickViewProduct}
          relatedProducts={relatedFor(quickViewProduct)}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </section>
  );
}
