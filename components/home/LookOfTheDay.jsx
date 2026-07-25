"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Bookmark, Sparkles } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "sonner";
import ProductImage from "@/components/shop/ProductImage";
import LookDetailModal from "@/components/looks/LookDetailModal";

export default function LookOfTheDay({ look }) {
  const [modalOpen, setModalOpen] = useState(false);
  const addToWishlist = useWishlistStore((s) => s.addItem);

  if (!look) return null;

  function handleSaveLook() {
    look.products.forEach((p) => addToWishlist(p));
    toast.success(`"${look.name}" saved to your wishlist!`);
  }

  return (
    <section className="bg-[#FFF8F5] py-16 lg:py-20 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 items-center">

          {/* ── Left: Look photo ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl overflow-hidden min-h-[420px] lg:min-h-[520px] bg-[#F2D4C8]"
          >
            {look.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={look.image}
                alt={look.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 45%)" }}
            />

            <div className="absolute top-6 left-6 inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[11px] font-bold tracking-widest text-[#2C1810] uppercase">
              <Sparkles className="h-3 w-3 text-[#C4614A]" />
              Look of the Day
            </div>

            <div className="absolute bottom-6 left-6">
              <p className="text-white font-black text-[22px]">Editor&apos;s Pick</p>
            </div>
          </motion.div>

          {/* ── Right: Look details ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#C4614A]" />
              <span className="text-[11px] font-bold tracking-[0.28em] text-[#C4614A] uppercase">Today&apos;s Look</span>
            </div>

            <h2
              className="text-[42px] lg:text-[52px] font-black text-[#2C1810] leading-tight mb-2"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {look.name}
            </h2>
            <svg width="180" height="10" viewBox="0 0 180 10" fill="none" className="mb-5">
              <path d="M0 5 Q22.5 0 45 5 Q67.5 10 90 5 Q112.5 0 135 5 Q157.5 10 180 5" stroke="#E8A598" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>

            <p className="text-[#7A4A3A] text-[14px] leading-relaxed mb-8">
              {look.description}
            </p>

            {/* Product list */}
            <div className="divide-y divide-[#F2D4C8] border-t border-[#F2D4C8] mb-8">
              {look.products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="flex items-center justify-between py-3.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="relative w-11 h-11 rounded-full overflow-hidden shrink-0"
                      style={{ background: product.bgColor || "#F2D4C8" }}
                    >
                      <ProductImage src={product.image} alt={product.name} category={product.category} padding="p-1.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#2C1810] text-[14px] leading-tight truncate">{product.name}</p>
                      <p className="text-[11px] font-bold tracking-widest text-[#C4614A] uppercase mt-0.5">{product.brand}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#2C1810] text-[15px] shrink-0 ml-4">${product.price}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2.5 bg-[#7C3554] hover:bg-[#6A2A44] text-white px-7 py-3.5 rounded-full font-semibold text-[14px] transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                Shop This Look · ${look.total}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSaveLook}
                className="inline-flex items-center gap-2.5 border-2 border-[#C4614A] text-[#C4614A] hover:bg-[#C4614A] hover:text-white px-7 py-3.5 rounded-full font-semibold text-[14px] transition-colors"
              >
                <Bookmark className="h-4 w-4" />
                Save Look
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      <LookDetailModal look={modalOpen ? look : null} onClose={() => setModalOpen(false)} />
    </section>
  );
}
