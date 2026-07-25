"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Heart, Sparkles, Clock } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "sonner";
import ProductImage from "@/components/shop/ProductImage";

export default function LookDetailModal({ look, onClose }) {
  const [activeImg, setActiveImg] = useState(0);
  const addToCart = useCartStore((s) => s.addItem);
  const addToWishlist = useWishlistStore((s) => s.addItem);

  useEffect(() => {
    setActiveImg(0);
  }, [look?.id]);

  useEffect(() => {
    if (!look) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [look, onClose]);

  function handleAddAllToCart() {
    look.products.forEach((p) => addToCart(p));
    toast.success(`${look.products.length} products from "${look.name}" added to cart!`);
  }

  function handleSaveAllToWishlist() {
    look.products.forEach((p) => addToWishlist(p));
    toast.success(`"${look.name}" saved to your wishlist!`);
  }

  const gallery = look
    ? [
        { url: look.image, credit: look.imageCredit },
        { url: look.detailImage, credit: look.detailImageCredit },
      ].filter((g) => g.url)
    : [];
  const shownImage = gallery[activeImg] || gallery[0];

  return (
    <AnimatePresence>
      {look && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[960px] max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row"
          >
            {/* Left: image gallery */}
            <div className="relative w-full lg:w-[44%] h-[320px] lg:h-auto shrink-0 bg-[#F2D4C8] flex flex-col">
              <div className="relative flex-1 overflow-hidden">
                <AnimatePresence mode="popLayout">
                  {shownImage?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <motion.img
                      key={shownImage.url}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      src={shownImage.url}
                      alt={look.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[64px]">✨</div>
                  )}
                </AnimatePresence>
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 40%)" }}
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 text-[10px] font-black tracking-[0.15em] text-[#2C1810] uppercase">
                  {look.mood}
                </span>
                {look.duration && (
                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-[11px] font-semibold">
                    <Clock className="h-3 w-3" />
                    {look.duration}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex gap-2 p-3 bg-[#FAFAFA] shrink-0">
                  {gallery.map((g, i) => (
                    <button
                      key={g.url}
                      onClick={() => setActiveImg(i)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-colors shrink-0 ${
                        activeImg === i ? "border-[#C4614A]" : "border-transparent hover:border-[#E8C4B8]"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={g.url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white shadow border border-[#E8C4B8] flex items-center justify-center text-[#2C1810] hover:bg-[#F2D4C8] transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Right: details */}
            <div className="flex-1 overflow-y-auto p-7 lg:p-8">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-[#C4614A]" />
                <span className="text-[11px] font-bold tracking-[0.25em] text-[#C4614A] uppercase">
                  {look.tag}
                </span>
                {look.duration && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C4A090]">
                    <Clock className="h-3 w-3" />
                    {look.duration}
                  </span>
                )}
              </div>
              <h2
                className="text-[28px] lg:text-[32px] font-black text-[#2C1810] leading-tight mb-3"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {look.name}
              </h2>
              <p className="text-[#7A4A3A] text-[14px] leading-relaxed mb-6">{look.description}</p>

              {look.steps?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-[12px] font-black tracking-[0.15em] text-[#2C1810] uppercase mb-3">
                    How to Get This Look
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    {look.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-[#F2D4C8] text-[#C4614A] text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-[13.5px] text-[#7A4A3A] leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <h3 className="text-[12px] font-black tracking-[0.15em] text-[#2C1810] uppercase mb-3">
                Shop the Products
              </h3>
              <div className="divide-y divide-[#F2D4C8] border-t border-b border-[#F2D4C8] mb-6">
                {look.products.map((p) => (
                  <div key={p.id} className="flex items-center gap-3.5 py-3.5">
                    <div
                      className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0"
                      style={{ background: p.bgColor || "#F2D4C8" }}
                    >
                      <ProductImage src={p.image} alt={p.name} category={p.category} padding="p-1.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-black tracking-[0.15em] text-[#C4614A] uppercase mb-0.5">
                        {p.brand}
                      </div>
                      <div className="text-[13.5px] font-medium text-[#2C1810] leading-snug truncate">
                        {p.name}
                      </div>
                    </div>
                    <span className="text-[14px] font-bold text-[#2C1810] shrink-0">${p.price}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddAllToCart}
                  className="flex-1 min-w-[220px] inline-flex items-center justify-center gap-2.5 bg-[#7A3048] hover:bg-[#5C1E30] text-white px-6 py-3.5 rounded-2xl font-semibold text-[14px] transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add All to Cart · ${look.total}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSaveAllToWishlist}
                  className="inline-flex items-center justify-center gap-2.5 border-2 border-[#E8C4B8] text-[#2C1810] px-6 py-3.5 rounded-2xl font-semibold text-[14px] hover:border-[#C4614A] hover:text-[#C4614A] transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  Save to Wishlist
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
