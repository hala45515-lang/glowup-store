"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SearchX } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import HomeProductQuickViewModal from "@/components/home/HomeProductQuickViewModal";

export default function SearchClient({ products, initialQuery = "" }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [query, setQuery] = useState(initialQuery);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      const url = query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search";
      router.replace(url, { scroll: false });
    }, 300);
    return () => clearTimeout(id);
  }, [query, router]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [products, query]);

  const relatedFor = (product) =>
    products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
      .slice(0, 4);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="bg-[#FFF8F5] min-h-screen">
      {/* Search header */}
      <section
        className="w-full py-14 px-6"
        style={{ background: "linear-gradient(180deg,#EDD8C8 0%,#FFF8F5 100%)" }}
      >
        <div className="max-w-2xl mx-auto">
          <h1
            className="text-[32px] lg:text-[40px] font-black text-[#2C1810] leading-tight mb-6 text-center"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Search GlowCart
          </h1>
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#C4A090]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product, brand, or category..."
              className="w-full h-[58px] pl-14 pr-14 rounded-full border border-[#E8C4B8] bg-white text-[#2C1810] placeholder:text-[#C4A090] text-[15px] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C4614A]/25 transition-shadow"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#F2D4C8] text-[#7A4A3A] flex items-center justify-center hover:bg-[#E8C4B8] transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-[1240px] mx-auto px-6 pb-28 pt-10">
        {!hasQuery ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center text-center py-20"
          >
            <div className="w-16 h-16 rounded-full bg-[#F2D4C8] flex items-center justify-center mb-4">
              <Search className="h-7 w-7 text-[#C4A090]" />
            </div>
            <p className="text-[#7A4A3A] text-[15px] max-w-xs">
              Start typing to search our full collection of makeup and skincare.
            </p>
          </motion.div>
        ) : (
          <>
            <p className="text-[14px] text-[#7A4A3A] mb-6">
              {results.length > 0
                ? <>Showing <strong className="text-[#2C1810]">{results.length}</strong> result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;</>
                : <>No results for &ldquo;{query}&rdquo;</>}
            </p>

            {results.length > 0 ? (
              <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                <AnimatePresence mode="popLayout">
                  {results.map((product, i) => (
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
                className="flex flex-col items-center text-center py-20"
              >
                <div className="w-16 h-16 rounded-full bg-[#F2D4C8] flex items-center justify-center mb-4">
                  <SearchX className="h-7 w-7 text-[#C4A090]" />
                </div>
                <p className="text-[#2C1810] font-semibold mb-1">No products found</p>
                <p className="text-[#7A4A3A] text-[14px] max-w-xs">
                  Try a different search term, or browse the shop to see everything we carry.
                </p>
              </motion.div>
            )}
          </>
        )}
      </section>

      {quickViewProduct && (
        <HomeProductQuickViewModal
          product={quickViewProduct}
          relatedProducts={relatedFor(quickViewProduct)}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
