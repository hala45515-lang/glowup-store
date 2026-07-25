"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Lock,
  Truck,
  ChevronRight,
  Tag,
  ArrowLeft,
  Check,
  Sparkles,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import ProductShape from "@/components/shop/ProductShape";
import ProductImage from "@/components/shop/ProductImage";

const FREE_SHIPPING_THRESHOLD = 50;

function ProductThumb({ product, size = 72, repairImages = {} }) {
  const bg = product.bg || product.bgColor || "linear-gradient(135deg,#F2D4C8,#E0B8A0)";
  const padding = size <= 60 ? "p-1.5" : "p-3";
  const image = product.image || repairImages[product.id]?.url;
  return (
    <div
      className="rounded-xl overflow-hidden relative shrink-0 flex items-center justify-center"
      style={{ width: size, height: size, background: bg, minWidth: size }}
    >
      {image ? (
        <ProductImage src={image} alt={product.name} category={product.category} padding={padding} />
      ) : product.shape ? (
        <div className="absolute inset-0">
          <ProductShape shape={product.shape} glow={product.glow || ""} />
        </div>
      ) : (
        <span className="text-xl">💄</span>
      )}
    </div>
  );
}

function AnimatedNumber({ value }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value.toFixed(2)}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.25 }}
        className="inline-block"
      >
        ${value.toFixed(2)}
      </motion.span>
    </AnimatePresence>
  );
}

export default function CartClient({ suggestions: suggestionPool = [], repairImages = {} }) {
  const [promoCode, setPromoCode]       = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const cartItems      = useCartStore((s) => s.items);
  const updateQty      = useCartStore((s) => s.updateQuantity);
  const removeFromCart = useCartStore((s) => s.removeItem);
  const addToCart      = useCartStore((s) => s.addItem);

  const subtotal = cartItems.reduce((s, i) => s + parseFloat(i.price || 0) * i.quantity, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const tax      = (subtotal - discount) * 0.08;
  const total    = subtotal - discount + tax;
  const shippingProgress = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  function handleApplyPromo() {
    if (!promoCode.trim()) return;
    if (promoCode.toLowerCase() === "glow10") {
      setPromoApplied(true);
      toast.success("Promo code applied! 10% off 🎉");
    } else {
      toast.error("Invalid promo code.");
    }
  }

  function handleAddSuggestion(product) {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  }

  const cartIds     = new Set(cartItems.map((i) => i.id));
  const suggestions = suggestionPool.filter((p) => !cartIds.has(p.id)).slice(0, 3);
  const cartCount   = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="relative bg-[#FFF8F5] min-h-screen overflow-hidden">
      {/* Ambient decoration */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-25"
        style={{ background: "radial-gradient(circle, #F2D4C8, transparent 70%)" }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Hero header */}
      <section
        className="relative py-12 px-6"
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
            <span className="text-[#C4614A] font-medium">Cart</span>
          </motion.nav>
          <div className="flex items-baseline gap-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="text-[52px] lg:text-[64px] font-black text-[#2C1810] leading-tight"
              style={{ fontFamily: "Georgia, serif" }}
            >
              My Bag
            </motion.h1>
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="text-[18px] font-semibold text-[#7A4A3A]"
                >
                  ({cartCount} {cartCount === 1 ? "item" : "items"})
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="relative max-w-[1200px] mx-auto px-6 py-10">
        <div className="flex gap-8 items-start">

          {/* Left: cart items */}
          <div className="flex-1 min-w-0">
            {cartItems.length === 0 ? (
              <motion.div
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
                  <ShoppingBag className="h-9 w-9 text-[#C4A090]" />
                </motion.div>
                <h3 className="text-[20px] font-black text-[#2C1810] mb-2">Your bag is empty</h3>
                <p className="text-[#7A4A3A] text-[14px] mb-6">Discover something you'll love.</p>
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C4614A] text-white font-semibold text-[14px] hover:bg-[#A84E39] transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Start Shopping
                </Link>
              </motion.div>
            ) : (
              <>
                <div className="flex flex-col gap-4 mb-8">
                  <AnimatePresence initial={false}>
                    {cartItems.map((item, i) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -40, scale: 0.94, transition: { duration: 0.25 } }}
                        transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ y: -3, boxShadow: "0 16px 32px -12px rgba(44,24,16,0.16)" }}
                        className="bg-white rounded-2xl border border-[#EDD8CC] p-5 flex items-center gap-5"
                        style={{ transition: "box-shadow 0.3s ease" }}
                      >
                        <ProductThumb product={item} size={80} repairImages={repairImages} />

                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-black tracking-[0.2em] text-[#C4614A] uppercase mb-1">
                            {item.brand}
                          </div>
                          <div className="text-[15px] font-bold text-[#2C1810] mb-1">
                            {item.name}
                          </div>
                          {item.shade ? (
                            <div className="text-[12px] text-[#7A4A3A] mb-3">
                              Shade: <span className="font-semibold">{item.shade}</span>
                              {" · "}${parseFloat(item.price).toFixed(2)}
                            </div>
                          ) : (
                            <div className="text-[12px] text-[#7A4A3A] mb-3">
                              ${parseFloat(item.price).toFixed(2)} each
                            </div>
                          )}

                          <div className="flex items-center gap-4">
                            <div className="flex items-center border border-[#E8C4B8] rounded-xl overflow-hidden">
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQty(item.id, item.quantity - 1)}
                                className="w-9 h-9 flex items-center justify-center text-[#7A4A3A] hover:bg-[#F2D4C8] transition-colors"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </motion.button>
                              <AnimatePresence mode="popLayout">
                                <motion.span
                                  key={item.quantity}
                                  initial={{ opacity: 0, y: -8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 8 }}
                                  transition={{ duration: 0.15 }}
                                  className="w-10 text-center text-[14px] font-bold text-[#2C1810] inline-block"
                                >
                                  {item.quantity}
                                </motion.span>
                              </AnimatePresence>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQty(item.id, item.quantity + 1)}
                                className="w-9 h-9 flex items-center justify-center text-[#7A4A3A] hover:bg-[#F2D4C8] transition-colors"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </motion.button>
                            </div>

                            <button
                              onClick={() => { removeFromCart(item.id); toast.success("Item removed."); }}
                              className="flex items-center gap-1.5 text-[12px] text-[#C4A090] hover:text-[#C4614A] transition-colors font-medium"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="text-[18px] font-black text-[#2C1810] shrink-0">
                          <AnimatedNumber value={parseFloat(item.price) * item.quantity} />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Free shipping progress */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-white rounded-2xl border border-[#EDD8CC] p-5 mb-8"
                >
                  <div className="flex items-center gap-2 mb-3 text-[13px] font-semibold text-[#2C1810]">
                    <Truck className="h-4 w-4 text-[#C4614A]" />
                    {remainingForFreeShipping > 0 ? (
                      <span>
                        Add <span className="text-[#C4614A]">${remainingForFreeShipping.toFixed(2)}</span> more for free shipping!
                      </span>
                    ) : (
                      <span className="text-emerald-600">You've unlocked free shipping! 🎉</span>
                    )}
                  </div>
                  <div className="h-2 rounded-full bg-[#F2D4C8] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#C4614A] to-[#E8A598]"
                      initial={{ width: 0 }}
                      animate={{ width: `${shippingProgress * 100}%` }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </motion.div>

                <Link
                  href="/shop"
                  className="group flex items-center gap-2 text-[#C4614A] text-[13px] font-semibold hover:underline mb-8 w-fit"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  Continue Shopping
                </Link>

                {/* Promo code */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                >
                  <p className="text-[13px] text-[#7A4A3A] mb-3 font-medium">Have a promo code?</p>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4A090]" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promo code"
                        disabled={promoApplied}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                        className="w-full h-[52px] pl-11 pr-4 rounded-2xl border border-[#E8C4B8] bg-white text-[#2C1810] placeholder:text-[#C4A090] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#C4614A]/20 disabled:opacity-60"
                      />
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={handleApplyPromo}
                      disabled={promoApplied}
                      className="px-7 py-3 rounded-2xl bg-[#2C1810] hover:bg-[#1A0E0B] text-white font-semibold text-[14px] transition-colors disabled:opacity-50"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {promoApplied ? (
                          <motion.span
                            key="applied"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className="flex items-center gap-1.5"
                          >
                            <Check className="h-3.5 w-3.5" /> Applied!
                          </motion.span>
                        ) : (
                          <motion.span key="apply" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                            Apply
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                  <AnimatePresence>
                    {promoApplied && (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="text-[12px] text-emerald-600 mt-2 font-medium"
                      >
                        ✓ 10% discount applied
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </>
            )}
          </div>

          {/* Right: Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="w-[320px] shrink-0 flex flex-col gap-4"
          >
            <div className="bg-white rounded-3xl border border-[#E8C4B8] p-6">
              <h2
                className="text-[24px] font-black text-[#2C1810] mb-5"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Order Summary
              </h2>

              <div className="flex flex-col gap-3 mb-4">
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#7A4A3A]">Subtotal</span>
                  <span className="font-semibold text-[#2C1810]"><AnimatedNumber value={subtotal} /></span>
                </div>
                <AnimatePresence>
                  {promoApplied && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex justify-between text-[14px]"
                    >
                      <span className="text-emerald-600">Promo (10%)</span>
                      <span className="font-semibold text-emerald-600">−<AnimatedNumber value={discount} /></span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#7A4A3A]">Shipping</span>
                  <span className="font-semibold text-emerald-600">Free 🎉</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#7A4A3A]">Tax (8%)</span>
                  <span className="font-semibold text-[#2C1810]"><AnimatedNumber value={tax} /></span>
                </div>
              </div>

              <div className="border-t border-[#F2D4C8] pt-4 mb-5">
                <div className="flex justify-between items-baseline">
                  <span className="text-[16px] font-bold text-[#2C1810]">Total</span>
                  <span
                    className="text-[30px] font-black text-[#C4614A]"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    <AnimatedNumber value={total} />
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={cartItems.length > 0 ? { scale: 1.015 } : {}}
                whileTap={cartItems.length > 0 ? { scale: 0.98 } : {}}
                disabled={cartItems.length === 0}
                className="group relative w-full py-4 rounded-2xl bg-[#7A3048] hover:bg-[#5C1E30] text-white font-semibold text-[15px] flex items-center justify-center gap-2 transition-colors mb-4 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden"
              >
                <span className="absolute inset-y-0 w-1/3 -skew-x-[20deg] bg-white/15 -translate-x-[200%] group-hover:translate-x-[380%] transition-transform duration-700 ease-out" />
                <Lock className="h-4 w-4" />
                Proceed to Checkout
              </motion.button>

              <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
                {["Secure", "VISA", "MC", "PayPal"].map((badge) => (
                  <span
                    key={badge}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#7A4A3A] px-2.5 py-1 rounded-lg bg-[#F2D4C8]"
                  >
                    {badge === "Secure" && <Lock className="h-2.5 w-2.5" />}
                    {badge}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                <Truck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-[12px] font-semibold text-emerald-700">
                  Free shipping on all orders!
                </span>
              </div>
            </div>

            {suggestions.length > 0 && (
              <div className="bg-white rounded-3xl border border-[#E8C4B8] p-6">
                <h4 className="text-[10px] font-black tracking-[0.25em] text-[#2C1810] uppercase mb-4 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-[#C4614A]" />
                  You Might Also Like
                </h4>
                <div className="flex flex-col gap-4">
                  {suggestions.map((prod, i) => (
                    <motion.div
                      key={prod.id}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: 0.2 + i * 0.06 }}
                      whileHover={{ x: -2 }}
                      className="flex items-center gap-3"
                    >
                      <ProductThumb product={prod} size={52} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-[#2C1810] truncate">{prod.name}</div>
                        <div className="text-[13px] font-bold text-[#2C1810]">${prod.price}.00</div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAddSuggestion(prod)}
                        className="w-8 h-8 rounded-full bg-[#F2D4C8] hover:bg-[#C4614A] text-[#C4614A] hover:text-white flex items-center justify-center transition-colors shrink-0"
                      >
                        <Plus className="h-4 w-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
