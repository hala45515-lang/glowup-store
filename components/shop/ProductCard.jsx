"use client";

import { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Eye, ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import ProductImage from "@/components/shop/ProductImage";

const TAG_STYLES = {
  new: "bg-[#C4614A] text-white",
  bestseller: "bg-[#2C1810] text-white",
  limited: "bg-[#E8A598] text-[#2C1810]",
};

const TAG_LABEL = {
  new: "New",
  bestseller: "Best Seller",
  limited: "Limited",
};

const cardVariants = {
  rest: { y: 0, boxShadow: "0 1px 3px rgba(44,24,16,0.08)" },
  hover: { y: -10, boxShadow: "0 28px 48px -12px rgba(44,24,16,0.28)" },
};

const imageVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.1, rotate: 1.2 },
};

const shineVariants = {
  rest: { x: "-130%", opacity: 0 },
  hover: { x: "130%", opacity: 1 },
};

const overlayVariants = {
  rest: { y: "100%" },
  hover: { y: "0%" },
};

const ProductCard = forwardRef(function ProductCard({ product, onQuickView, index = 0 }, ref) {
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((s) => s.addItem);
  const isWished = useWishlistStore((s) => s.isInWishlist(product.id));
  const addToWishlist = useWishlistStore((s) => s.addItem);
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);

  const fullStars = Math.floor(product.rating);
  const hasHalf = product.rating % 1 >= 0.5;

  function handleAdd(e) {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAdded(false), 1600);
  }

  function handleWishlist(e) {
    e.stopPropagation();
    if (isWished) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist.");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist!");
    }
  }

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: Math.min(index, 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
      animate="rest"
      className="group relative bg-white rounded-[26px] overflow-hidden"
      variants={cardVariants}
      style={{ transition: "box-shadow 0.4s ease" }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-[26px]" style={{ backgroundColor: product.bgColor }}>
        <motion.div
          variants={imageVariants}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="absolute inset-0"
        >
          <ProductImage src={product.image} alt={product.name} category={product.category} />
        </motion.div>

        {/* Shine sweep */}
        <motion.div
          variants={shineVariants}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-y-0 w-1/3 -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-10"
        />

        {/* Tag */}
        {product.tag && (
          <motion.span
            initial={{ opacity: 0, scale: 0.7, x: -8 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + Math.min(index, 6) * 0.05, type: "spring", stiffness: 300 }}
            className={`absolute top-3 left-3 z-20 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${TAG_STYLES[product.tag] || TAG_STYLES.limited}`}
          >
            {TAG_LABEL[product.tag] || product.tag}
          </motion.span>
        )}

        {/* Wishlist */}
        <motion.button
          onClick={handleWishlist}
          whileTap={{ scale: 0.75 }}
          animate={isWished ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.35 }}
          className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center transition-colors ${
            isWished ? "text-[#C4614A]" : "text-[#7A4A3A] opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart className={`h-4 w-4 ${isWished ? "fill-current" : ""}`} />
        </motion.button>

        {/* Quick View slide-up */}
        <motion.div
          variants={overlayVariants}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="absolute bottom-0 left-0 right-0 z-20"
        >
          <button
            onClick={(e) => { e.stopPropagation(); onQuickView?.(product); }}
            className="w-full py-3 bg-[#2C1810]/85 hover:bg-[#2C1810] backdrop-blur-sm text-white text-[12px] font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors"
          >
            <Eye className="h-4 w-4" />
            Quick View
          </button>
        </motion.div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="text-[10px] font-black tracking-[0.22em] text-[#C4614A] mb-1 uppercase">
          {product.brand}
        </div>
        <h3 className="font-semibold text-[#2C1810] text-[13px] mb-2 leading-snug min-h-[34px]">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <span className="font-black text-[#2C1810] text-[16px]">${product.price}</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-px">
              {[1, 2, 3, 4, 5].map((s) => {
                const filled = s <= fullStars;
                const half = !filled && s === fullStars + 1 && hasHalf;
                return (
                  <span key={s} className="text-[12px]" style={{ color: filled || half ? "#C4614A" : "#E8C4B8" }}>★</span>
                );
              })}
            </div>
            <span className="text-[11px] text-[#7A4A3A]">({product.reviews})</span>
          </div>
        </div>

        <motion.button
          onClick={handleAdd}
          whileTap={{ scale: 0.96 }}
          className="w-full py-2.5 rounded-full bg-[#F2D4C8] hover:bg-[#C4614A] hover:text-white text-[#2C1810] text-[12px] font-semibold flex items-center justify-center gap-2 transition-colors overflow-hidden relative"
        >
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <Check className="h-3.5 w-3.5" /> Added!
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <ShoppingBag className="h-3.5 w-3.5" /> Add to Cart
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
});

export default ProductCard;
