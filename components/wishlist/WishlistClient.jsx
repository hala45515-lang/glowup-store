"use client";

import { Fragment } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2, ArrowLeft, ChevronRight } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import ProductShape from "@/components/shop/ProductShape";
import ProductImage from "@/components/shop/ProductImage";

const cardVariants = {
  rest: { y: 0, boxShadow: "0 1px 3px rgba(44,24,16,0.08)" },
  hover: { y: -8, boxShadow: "0 24px 44px -14px rgba(44,24,16,0.25)" },
};

const imageVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.08, rotate: 1 },
};

const shineVariants = {
  rest: { x: "-130%", opacity: 0 },
  hover: { x: "130%", opacity: 1 },
};

export default function WishlistClient({ repairImages = {}, repairImagesByName = {} }) {
  const wishlistItems      = useWishlistStore((s) => s.items);
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);
  const addToCart          = useCartStore((s) => s.addItem);

  function repairedImageFor(product) {
    return product.image || repairImagesByName[product.name] || repairImages[product.id]?.url;
  }

  function withRepairedImage(product) {
    return product.image ? product : { ...product, image: repairedImageFor(product) };
  }

  function handleMoveToCart(product) {
    addToCart(withRepairedImage(product));
    removeFromWishlist(product.id);
    toast.success(`${product.name} moved to cart!`);
  }

  function handleMoveAllToCart() {
    wishlistItems.forEach((p) => addToCart(withRepairedImage(p)));
    wishlistItems.forEach((p) => removeFromWishlist(p.id));
    toast.success("All items moved to cart!");
  }

  return (
    <div className="bg-[#FFF8F5] min-h-screen">

      {/* Hero header */}
      <section
        className="py-12 px-6"
        style={{ background: "linear-gradient(180deg,#EDD8C8 0%,#FFF8F5 100%)" }}
      >
        <div className="max-w-[1200px] mx-auto">
          <motion.nav
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-[13px] text-[#7A4A3A] mb-5"
          >
            <Link href="/" className="hover:text-[#C4614A] transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[#C4614A] font-medium">Wishlist</span>
          </motion.nav>
          <div className="flex items-baseline gap-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="text-[52px] lg:text-[64px] font-black text-[#2C1810] leading-tight"
              style={{ fontFamily: "Georgia, serif" }}
            >
              My Wishlist
            </motion.h1>
            <AnimatePresence>
              {wishlistItems.length > 0 && (
                <motion.span
                  key={wishlistItems.length}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="text-[18px] font-semibold text-[#7A4A3A]"
                >
                  ({wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"})
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {wishlistItems.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-[#F2D4C8] flex items-center justify-center mb-4"
            >
              <Heart className="h-9 w-9 text-[#C4A090]" />
            </motion.div>
            <h3 className="text-[20px] font-black text-[#2C1810] mb-2">Your wishlist is empty</h3>
            <p className="text-[#7A4A3A] text-[14px] mb-6">Save items you love and find them here.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C4614A] text-white font-semibold text-[14px] hover:bg-[#A84E39] transition-colors"
            >
              Browse Products
            </Link>
          </motion.div>
        ) : (
          <Fragment key="populated">
            {/* Grid */}
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              <AnimatePresence mode="popLayout">
                {wishlistItems.map((product, idx) => {
                  const inStock   = idx % 3 !== 2;
                  const stockText = inStock ? "In Stock" : "Low Stock";
                  const dotColor  = inStock ? "bg-emerald-500" : "bg-amber-400";
                  const textColor = inStock ? "text-emerald-700" : "text-amber-700";
                  const fullStars = Math.floor(product.rating || 4.5);
                  const image = repairedImageFor(product);

                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.25 } }}
                      transition={{ duration: 0.45, delay: Math.min(idx, 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      whileHover="hover"
                      animate="rest"
                      variants={cardVariants}
                      className="group relative bg-white rounded-2xl border border-[#EDD8CC] overflow-hidden"
                      style={{ transition: "box-shadow 0.4s ease" }}
                    >
                      {/* Image */}
                      <div
                        className="relative h-[190px] overflow-hidden"
                        style={{ background: product.bg || product.bgColor || "linear-gradient(135deg,#F2D4C8,#E0B8A0)" }}
                      >
                        <motion.div
                          variants={imageVariants}
                          transition={{ type: "spring", stiffness: 220, damping: 18 }}
                          className="absolute inset-0"
                        >
                          {image ? (
                            <ProductImage src={image} alt={product.name} category={product.category} />
                          ) : product.shape ? (
                            <ProductShape shape={product.shape} glow={product.glow || ""} />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-5xl">💄</div>
                          )}
                        </motion.div>

                        {/* Shine sweep */}
                        <motion.div
                          variants={shineVariants}
                          transition={{ duration: 0.9, ease: "easeInOut" }}
                          className="absolute inset-y-0 w-1/3 -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-10"
                        />

                        <span className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-semibold">
                          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                          <span className={textColor}>{stockText}</span>
                        </span>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <div className="text-[10px] font-black tracking-[0.2em] text-[#C4614A] uppercase mb-1">
                          {product.brand}
                        </div>
                        <h3 className="text-[15px] font-bold text-[#2C1810] mb-2 leading-snug">
                          {product.name}
                        </h3>

                        <div className="flex items-center gap-1.5 mb-2">
                          <div className="flex gap-px">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <span
                                key={s}
                                className="text-[13px]"
                                style={{ color: s <= fullStars ? "#C4614A" : "#E8C4B8" }}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-[12px] text-[#7A4A3A]">{product.rating || "4.8"}</span>
                        </div>

                        <div className="text-[20px] font-black text-[#2C1810] mb-4">
                          ${parseFloat(product.price).toFixed(2)}
                        </div>

                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          onClick={() => handleMoveToCart(product)}
                          className="w-full py-3 rounded-xl bg-[#7A3048] hover:bg-[#5C1E30] text-white font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors mb-2"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          Move to Cart
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          onClick={() => { removeFromWishlist(product.id); toast.success("Removed from wishlist."); }}
                          className="w-full py-3 rounded-xl border border-[#E8C4B8] text-[#7A4A3A] font-semibold text-[13px] flex items-center justify-center gap-2 hover:border-[#C4614A] hover:text-[#C4614A] transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Bottom actions */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleMoveAllToCart}
                className="flex items-center gap-2 px-8 py-4 rounded-full bg-[#7A3048] hover:bg-[#5C1E30] text-white font-semibold text-[14px] transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                Move All to Cart
              </motion.button>
              <Link
                href="/shop"
                className="group flex items-center gap-2 text-[#C4614A] text-[13px] font-semibold hover:underline"
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                Continue Shopping
              </Link>
            </motion.div>
          </Fragment>
        )}
      </div>
    </div>
  );
}
