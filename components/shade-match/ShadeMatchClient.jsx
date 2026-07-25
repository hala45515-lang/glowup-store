"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  RotateCcw,
  Sparkles,
  Bookmark,
  Heart,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useProfileStore } from "@/store/profileStore";
import { useAuth } from "@/contexts/AuthContext";
import ProductImage from "@/components/shop/ProductImage";
import SignInModal from "@/components/auth/SignInModal";

const resultCardVariants = {
  rest: { y: 0, boxShadow: "0 1px 3px rgba(44,24,16,0.08)" },
  hover: { y: -10, boxShadow: "0 28px 48px -12px rgba(44,24,16,0.28)" },
};

const resultImageVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.1, rotate: 1.2 },
};

const resultShineVariants = {
  rest: { x: "-130%", opacity: 0 },
  hover: { x: "130%", opacity: 1 },
};

const SHAPE_CATEGORY = {
  bottle: "face",
  compact: "face",
  lipstick: "lips",
  eyeliner: "eyes",
  mascara: "eyes",
};

// ─── Static data ──────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Skin Tone" },
  { id: 2, label: "Skin Type" },
  { id: 3, label: "Concerns" },
  { id: 4, label: "Results" },
];

const SKIN_TONES = [
  { id: "fair",         label: "Fair",         color: "#F5E2BE" },
  { id: "light",        label: "Light",        color: "#EDCC96" },
  { id: "light-medium", label: "Light Medium", color: "#D4A872" },
  { id: "medium",       label: "Medium",       color: "#B87E50" },
  { id: "medium-tan",   label: "Medium Tan",   color: "#9A6438" },
  { id: "tan",          label: "Tan",          color: "#8A4820" },
  { id: "deep-tan",     label: "Deep Tan",     color: "#6A3010" },
  { id: "rich",         label: "Rich",         color: "#502810" },
  { id: "deep",         label: "Deep",         color: "#381808" },
  { id: "ebony",        label: "Ebony",        color: "#180808" },
];

const SKIN_TYPES = [
  { id: "normal",      label: "Normal",      desc: "Balanced, comfortable skin",      emoji: "⭐" },
  { id: "dry",         label: "Dry",         desc: "Tight, sometimes flaky skin",     emoji: "💧" },
  { id: "oily",        label: "Oily",        desc: "Shiny, enlarged pores",           emoji: "✨" },
  { id: "combination", label: "Combination", desc: "Oily T-zone, dry cheeks",         emoji: "🌓" },
  { id: "sensitive",   label: "Sensitive",   desc: "Easily irritated, reactive skin", emoji: "🌸" },
];

const CONCERNS = [
  { id: "acne",         label: "Acne & Breakouts" },
  { id: "aging",        label: "Anti-Aging" },
  { id: "uneven",       label: "Uneven Skin Tone" },
  { id: "dryness",      label: "Dryness" },
  { id: "oiliness",     label: "Excess Oil" },
  { id: "sensitivity",  label: "Sensitivity" },
  { id: "dark-circles", label: "Dark Circles" },
  { id: "pores",        label: "Large Pores" },
  { id: "dullness",     label: "Dullness" },
  { id: "redness",      label: "Redness" },
];

// ─── Products catalogue ───────────────────────────────────────────────────────

const P = {
  foundation_matte: {
    id: 6,  brand: "L'Oréal",          name: "Infallible Foundation",
    price: 18, rating: 4.5, reviews: 2110,
    bg: "linear-gradient(145deg, #C0A878, #D8BF90, #B89A68)",
    shape: "bottle", glow: "rgba(192,168,120,0.45)",
  },
  foundation_dewy: {
    id: 5,  brand: "Fenty Beauty",     name: "Pro Filt'r Foundation",
    price: 42, rating: 4.7, reviews: 3890,
    bg: "linear-gradient(145deg, #B89060, #D4B080, #BCA070)",
    shape: "bottle", glow: "rgba(196,160,96,0.45)",
  },
  flawless_filter: {
    id: 11, brand: "Charlotte Tilbury", name: "Flawless Filter",
    price: 49, rating: 4.9, reviews: 5230,
    bg: "linear-gradient(145deg, #C8A870, #DEC090, #B89A60)",
    shape: "bottle", glow: "rgba(200,168,112,0.45)",
  },
  cant_stop: {
    id: 12, brand: "NYX",              name: "Can't Stop Won't Stop Foundation",
    price: 16, rating: 4.6, reviews: 1780,
    bg: "linear-gradient(145deg, #B89060, #CCA870, #A88050)",
    shape: "bottle", glow: "rgba(184,144,96,0.45)",
  },
  studio_fix: {
    id: 10, brand: "MAC",              name: "Studio Fix Powder",
    price: 36, rating: 4.7, reviews: 3120,
    bg: "linear-gradient(145deg, #C09860, #D8B080, #B89060)",
    shape: "compact", glow: "rgba(192,152,96,0.45)",
  },
  blush: {
    id: 1,  brand: "NARS",             name: "Orgasm Blush",
    price: 38, rating: 4.8, reviews: 4015,
    bg: "linear-gradient(145deg, #B85030, #D4784A, #C05838)",
    shape: "compact", glow: "rgba(196,88,48,0.45)", tag: "bestseller",
  },
  lip_rose: {
    id: 4,  brand: "Charlotte Tilbury", name: "Pillow Talk Lipstick",
    price: 45, rating: 4.9, reviews: 5230,
    bg: "linear-gradient(145deg, #8A3050, #C45878, #A44060)",
    shape: "lipstick", glow: "rgba(196,88,120,0.45)",
  },
  lip_nude: {
    id: 3,  brand: "MAC",              name: "Velvet Teddy Lipstick",
    price: 22, rating: 4.8, reviews: 3110,
    bg: "linear-gradient(145deg, #6A3820, #9A6038, #7A4828)",
    shape: "lipstick", glow: "rgba(154,96,56,0.45)", tag: "bestseller",
  },
  lip_bold: {
    id: 2,  brand: "MAC",              name: "Ruby Woo Lipstick",
    price: 22, rating: 4.9, reviews: 3420,
    bg: "linear-gradient(145deg, #780808, #B81414, #960A0A)",
    shape: "lipstick", glow: "rgba(184,20,20,0.45)", tag: "bestseller",
  },
  liner: {
    id: 8,  brand: "NYX",              name: "Epic Ink Liner",
    price: 14, rating: 4.7, reviews: 4250,
    bg: "linear-gradient(145deg, #2C1810, #4A2A18, #3A2010)",
    shape: "eyeliner", glow: "rgba(70,40,20,0.5)",
  },
  mascara: {
    id: 9,  brand: "Maybelline",       name: "Sky High Mascara",
    price: 16, rating: 4.8, reviews: 8920,
    bg: "linear-gradient(145deg, #1A0E0B, #3C2010, #280E08)",
    shape: "mascara", glow: "rgba(60,32,16,0.5)", tag: "bestseller",
  },
};

// ─── Recommendation engine ────────────────────────────────────────────────────

const LIGHT_TONES  = ["fair", "light", "light-medium"];
const MEDIUM_TONES = ["medium", "medium-tan", "tan"];

function getRecommendations(skinTone, skinType, concerns) {
  const recs = [];

  // Foundation
  if (skinType === "oily" || skinType === "combination") {
    recs.push({ ...P.cant_stop,       feature: "24hr coverage for combination skin" });
  } else if (skinType === "dry") {
    recs.push({ ...P.foundation_dewy, feature: "50 shades — perfect for your tone" });
    recs.push({ ...P.flawless_filter, feature: "Blur effect for uneven texture" });
  } else if (skinType === "sensitive") {
    recs.push({ ...P.foundation_matte, feature: "Fragrance-free, gentle formula" });
  } else {
    recs.push({ ...P.foundation_dewy,  feature: "50 shades — perfect for your tone" });
  }

  // Setting / powder
  if (skinType === "oily" || skinType === "combination") {
    recs.push({ ...P.studio_fix, feature: "Controls shine for 12+ hours" });
  } else {
    recs.push({ ...P.blush, feature: "Golden glow for a luminous complexion" });
  }

  // Lip
  if (LIGHT_TONES.includes(skinTone)) {
    recs.push({ ...P.lip_rose,   feature: "Soft rose nude loved by fair skin tones" });
  } else if (MEDIUM_TONES.includes(skinTone)) {
    recs.push({ ...P.lip_nude,   feature: "Warm nude-brown that flatters your tone" });
  } else {
    recs.push({ ...P.lip_bold,   feature: "Rich red that pops on deeper complexions" });
  }

  // Concern extras
  if (concerns.includes("dark-circles")) {
    recs.push({ ...P.mascara, feature: "Lash volume draws focus, minimises dark circles" });
  }
  if (concerns.includes("oiliness") || concerns.includes("pores")) {
    recs.push({ ...P.liner, feature: "Smudge-proof ink that lasts all day" });
  }

  // Deduplicate and cap at 6
  const seen = new Set();
  return recs.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  }).slice(0, 6);
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

function Stepper({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 py-10">
      {STEPS.map((step, idx) => {
        const done   = step.id < current;
        const active = step.id === current;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[15px] font-bold border-2 transition-all ${
                active ? "bg-[#8B2A50] border-[#8B2A50] text-white shadow-md"
                : done  ? "bg-[#8B2A50] border-[#8B2A50] text-white"
                :         "bg-white border-[#E8C4B8] text-[#C4897A]"
              }`}>
                {done ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                    <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : step.id}
              </div>
              <span className={`text-[12px] font-semibold whitespace-nowrap ${
                active ? "text-[#8B2A50]" : done ? "text-[#8B2A50]" : "text-[#C4B0A8]"
              }`}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`w-20 md:w-28 h-px mx-1 mb-5 transition-colors ${done ? "bg-[#8B2A50]" : "bg-[#E8C4B8]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1 — Skin Tone ───────────────────────────────────────────────────────

function StepSkinTone({ value, onChange }) {
  return (
    <div className="max-w-2xl mx-auto text-center px-4">
      <h2 className="text-[40px] md:text-[52px] font-black text-[#2C1810] mb-3 leading-tight">
        What&apos;s your skin tone?
      </h2>
      <p className="text-[#7A4A3A] text-[15px] mb-10">
        Select the tone that best matches your complexion
      </p>
      <div className="grid grid-cols-5 gap-x-6 gap-y-8">
        {SKIN_TONES.map((tone) => {
          const selected = value === tone.id;
          return (
            <button key={tone.id} onClick={() => onChange(tone.id)}
              className="flex flex-col items-center gap-3 group">
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full transition-all duration-200 ${
                selected
                  ? "ring-4 ring-offset-4 ring-[#8B2A50] scale-110 shadow-lg"
                  : "group-hover:scale-105 group-hover:shadow-md"
              }`} style={{ backgroundColor: tone.color }} />
              <span className={`text-[12px] font-semibold leading-tight ${selected ? "text-[#8B2A50]" : "text-[#7A4A3A]"}`}>
                {tone.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 2 — Skin Type ───────────────────────────────────────────────────────

function StepSkinType({ value, onChange }) {
  return (
    <div className="max-w-2xl mx-auto text-center px-4">
      <h2 className="text-[40px] md:text-[52px] font-black text-[#2C1810] mb-3 leading-tight">
        What&apos;s your skin type?
      </h2>
      <p className="text-[#7A4A3A] text-[15px] mb-10">
        This helps us match formulas to your skin&apos;s needs
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SKIN_TYPES.map((type) => {
          const selected = value === type.id;
          return (
            <button key={type.id} onClick={() => onChange(type.id)}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                selected
                  ? "border-[#8B2A50] bg-[#F9ECF2] shadow-sm"
                  : "border-[#E8C4B8] bg-white hover:border-[#C4897A]"
              }`}
            >
              {/* Icon box */}
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl shrink-0">
                {type.emoji}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className={`font-bold text-[16px] leading-tight mb-0.5 ${selected ? "text-[#8B2A50]" : "text-[#2C1810]"}`}>
                  {type.label}
                </div>
                <div className="text-[13px] text-[#7A4A3A] leading-snug">
                  {type.desc}
                </div>
              </div>

              {/* Radio */}
              <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                selected ? "bg-[#8B2A50] border-[#8B2A50]" : "border-[#D4B0A8]"
              }`}>
                {selected && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 3 — Concerns ───────────────────────────────────────────────────────

function StepConcerns({ value, onChange }) {
  function toggle(id) {
    onChange(value.includes(id) ? value.filter((c) => c !== id) : [...value, id]);
  }
  return (
    <div className="max-w-2xl mx-auto text-center px-4">
      <h2 className="text-[40px] md:text-[52px] font-black text-[#2C1810] mb-3 leading-tight">
        Any skin concerns?
      </h2>
      <p className="text-[#7A4A3A] text-[15px] mb-10">
        Select all that apply — we&apos;ll tailor your results accordingly
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {CONCERNS.map((c) => {
          const selected = value.includes(c.id);
          return (
            <button key={c.id} onClick={() => toggle(c.id)}
              className={`px-5 py-3 rounded-full text-[13px] font-semibold border-2 transition-all duration-200 ${
                selected
                  ? "bg-[#8B2A50] border-[#8B2A50] text-white shadow-sm"
                  : "bg-white border-[#E8C4B8] text-[#2C1810] hover:border-[#C4897A]"
              }`}>
              {c.label}
            </button>
          );
        })}
      </div>
      <p className="text-[12px] text-[#C4B0A8] mt-6">You can skip this step if none apply</p>
    </div>
  );
}

// ─── Step 4 — Results ────────────────────────────────────────────────────────

function ResultCard({ product, image, index = 0 }) {
  const [added, setAdded] = useState(false);
  const addToCart       = useCartStore((s) => s.addItem);
  const isWished        = useWishlistStore((s) => s.isInWishlist(product.id));
  const addToWishlist   = useWishlistStore((s) => s.addItem);
  const removeWishlist  = useWishlistStore((s) => s.removeItem);
  const fullStars       = Math.floor(product.rating);
  const category        = SHAPE_CATEGORY[product.shape];
  const productWithImage = { ...product, image: image?.url, category };

  function handleAdd() {
    addToCart(productWithImage);
    setAdded(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleWishlist() {
    if (isWished) {
      removeWishlist(product.id);
      toast.success("Removed from wishlist.");
    } else {
      addToWishlist(productWithImage);
      toast.success("Added to wishlist!");
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: Math.min(index, 6) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
      animate="rest"
      className="group relative bg-white rounded-2xl overflow-hidden"
      variants={resultCardVariants}
      style={{ transition: "box-shadow 0.4s ease" }}
    >
      {/* Image */}
      <div className="relative h-[200px] overflow-hidden" style={{ background: product.bg }}>
        <motion.div variants={resultImageVariants} transition={{ type: "spring", stiffness: 220, damping: 18 }} className="absolute inset-0">
          <ProductImage src={image?.url} alt={product.name} category={category} />
        </motion.div>

        {/* Shine sweep */}
        <motion.div
          variants={resultShineVariants}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-y-0 w-1/3 -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-10"
        />

        {/* Perfect Match badge */}
        <motion.span
          initial={{ opacity: 0, scale: 0.7, x: -8 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 + Math.min(index, 6) * 0.08, type: "spring", stiffness: 300 }}
          className="absolute top-3 left-3 z-20 inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-full bg-[#E8F2E0] text-[#3A6A20] uppercase tracking-wide"
        >
          <Sparkles className="h-2.5 w-2.5" />
          Perfect Match
        </motion.span>

        {/* Wishlist */}
        <motion.button
          onClick={handleWishlist}
          whileTap={{ scale: 0.75 }}
          animate={isWished ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.35 }}
          className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/90 shadow-sm flex items-center justify-center transition-colors ${
            isWished ? "text-[#8B2A50]" : "text-[#7A4A3A] hover:text-[#8B2A50]"
          }`}
        >
          <Heart className={`h-4 w-4 ${isWished ? "fill-current" : ""}`} />
        </motion.button>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="text-[10px] font-black tracking-[0.22em] text-[#C4614A] uppercase mb-1">
          {product.brand}
        </div>
        <h3 className="font-bold text-[#2C1810] text-[15px] mb-1.5 leading-snug">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex gap-px">
            {[1,2,3,4,5].map((s) => (
              <span key={s} className="text-[11px]" style={{ color: s <= fullStars ? "#C4614A" : "#E8C4B8" }}>★</span>
            ))}
          </div>
          <span className="text-[11px] text-[#7A4A3A]">{product.rating} ({product.reviews.toLocaleString()})</span>
        </div>

        {/* Feature reason */}
        {product.feature && (
          <div className="flex items-center gap-1.5 bg-[#FFF8F5] border border-[#F2D4C8] rounded-lg px-3 py-2 mb-4">
            <span className="text-[#C4614A] font-bold text-[13px]">+</span>
            <span className="text-[12px] text-[#7A4A3A] leading-snug">{product.feature}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-[22px] font-black text-[#2C1810]">${product.price}</span>
          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.96 }}
            className="relative inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#8B2A50] hover:bg-[#6A1A38] text-white text-[12px] font-semibold overflow-hidden transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5"
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
                  className="flex items-center gap-1.5"
                >
                  <ShoppingBag className="h-3.5 w-3.5" /> Add
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function StepResults({ skinTone, skinType, concerns, images, onRetake }) {
  const [saved, setSaved] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const { user } = useAuth();
  const updateProfileData = useProfileStore((s) => s.updateProfile);
  const toneObj  = SKIN_TONES.find((t) => t.id === skinTone);
  const typeObj  = SKIN_TYPES.find((t) => t.id === skinType);
  const results  = getRecommendations(skinTone, skinType, concerns);

  const concernLabels = concerns.map((c) => CONCERNS.find((x) => x.id === c)?.label).filter(Boolean);

  function handleSaveProfile() {
    if (!user) {
      setSignInOpen(true);
      return;
    }
    updateProfileData(user.uid, {
      shadeProfile: {
        toneLabel: toneObj?.label,
        toneColor: toneObj?.color,
        typeLabel: typeObj?.label,
        concernLabels,
        savedAt: new Date().toISOString(),
      },
    });
    setSaved(true);
    toast.success("Shade profile saved to your account!");
  }

  return (
    <div className="max-w-4xl mx-auto px-4">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-[#E8F2E0] text-[#3A6A20] text-[12px] font-semibold px-4 py-2 rounded-full mb-5">
          <Sparkles className="h-3.5 w-3.5" />
          Your matches are ready
        </div>
        <h2 className="text-[44px] md:text-[56px] font-black text-[#2C1810] mb-3 leading-tight">
          Your Perfect Matches
        </h2>
        <p className="text-[#7A4A3A] text-[15px]">
          Based on your <strong>{toneObj?.label}</strong> skin tone,{" "}
          <strong>{typeObj?.label}</strong> skin, we curated these for you.
        </p>
      </div>

      {/* Shade profile banner */}
      <div className="relative overflow-hidden rounded-2xl mb-10 px-8 py-7 flex items-center gap-6"
        style={{ background: "linear-gradient(130deg, #8B2A50, #A83860, #7A2040)" }}>
        {/* Decorative circles */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, #fff, transparent 70%)" }} />
        <div className="absolute right-28 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #fff, transparent 70%)" }} />

        {/* Tone circle */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="w-16 h-16 rounded-full border-2 border-white/30 shadow-lg"
            style={{ backgroundColor: toneObj?.color }} />
          <span className="text-white/70 text-[11px] font-semibold">{toneObj?.label}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-white/60 text-[10px] font-black tracking-[0.22em] uppercase mb-1">
            Your Shade Profile
          </p>
          <h3 className="text-white text-[26px] font-black mb-3 leading-tight">
            {toneObj?.label} · {typeObj?.label} Skin
          </h3>
          {concernLabels.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {concernLabels.map((l) => (
                <span key={l} className="text-[12px] font-semibold text-white/80 bg-white/15 px-3 py-1 rounded-full">
                  {l}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-[12px] font-semibold text-white/70 bg-white/15 px-3 py-1 rounded-full">
              No specific concerns
            </span>
          )}
        </div>

        {/* Save profile */}
        <button
          onClick={handleSaveProfile}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-white/40 text-white text-[13px] font-semibold hover:bg-white/10 transition-colors"
        >
          <Bookmark className="h-4 w-4" />
          {saved ? "Saved!" : "Save Profile"}
        </button>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {results.map((p, i) => <ResultCard key={p.id} product={p} image={images[p.id]} index={i} />)}
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <Link href="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#8B2A50] hover:bg-[#6A1A38] text-white text-[14px] font-bold transition-colors shadow-md">
          <ShoppingBag className="h-4 w-4" />
          Shop All Matches
        </Link>
        <button onClick={onRetake}
          className="inline-flex items-center gap-2 text-[#8B2A50] text-[13px] font-semibold hover:underline transition-colors">
          <RotateCcw className="h-3.5 w-3.5" />
          Retake Quiz
        </button>
      </div>

      {/* Save profile CTA */}
      <div className="bg-[#F5E8DC] rounded-2xl px-7 py-6 flex items-center gap-5">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0">
          <Bookmark className="h-5 w-5 text-[#8B2A50]" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-[#2C1810] text-[16px] mb-0.5">Save your shade profile</p>
          <p className="text-[13px] text-[#7A4A3A]">Get personalized recommendations every time you shop.</p>
        </div>
        <button
          onClick={handleSaveProfile}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8B2A50] hover:bg-[#6A1A38] text-white text-[13px] font-semibold transition-colors">
          <Bookmark className="h-4 w-4" />
          {saved ? "Saved!" : "Save to Profile"}
        </button>
      </div>

      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ShadeMatchClient({ images = {} }) {
  const [step,     setStep]     = useState(1);
  const [skinTone, setSkinTone] = useState(null);
  const [skinType, setSkinType] = useState(null);
  const [concerns, setConcerns] = useState([]);

  const canNext =
    (step === 1 && skinTone !== null) ||
    (step === 2 && skinType !== null) ||
    step === 3;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(120deg,#F5E8DC 0%,#E8C4B8 45%,#D4907A 100%)", minHeight: "320px" }}>
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle,#C4614A,transparent 70%)" }} />
        <div className="relative z-10 flex flex-col items-center text-center px-6 py-14 md:py-18">
          <div className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.25em] text-[#8B3A2A] uppercase mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Shade Match Technology
          </div>
          <h1 className="text-[44px] md:text-[64px] font-black text-[#2C1810] leading-tight mb-4 max-w-2xl">
            Find Your Perfect Shade
          </h1>
          <p className="text-[#7A4A3A] text-[15px] max-w-sm leading-relaxed mb-8">
            Answer a few questions and we&apos;ll match you with your ideal products.
          </p>
          <div className="flex items-end gap-3">
            {SKIN_TONES.slice(0, 6).map((t, i) => (
              <div key={t.id} className="rounded-full shadow-md"
                style={{ backgroundColor: t.color, width:`${28+i*4}px`, height:`${28+i*4}px` }} />
            ))}
          </div>
        </div>
      </section>

      {/* Quiz */}
      <section className="bg-[#FFF8F5] min-h-[500px] pb-20">
        <div className="container mx-auto px-6 lg:px-8">
          <Stepper current={step} />

          <div className="mt-2">
            {step === 1 && <StepSkinTone value={skinTone} onChange={setSkinTone} />}
            {step === 2 && <StepSkinType value={skinType} onChange={setSkinType} />}
            {step === 3 && <StepConcerns value={concerns} onChange={setConcerns} />}
            {step === 4 && (
              <StepResults skinTone={skinTone} skinType={skinType} concerns={concerns} images={images}
                onRetake={() => { setStep(1); setSkinTone(null); setSkinType(null); setConcerns([]); }} />
            )}
          </div>

          {/* Navigation */}
          {step < 4 && (
            <div className="flex items-center justify-between max-w-2xl mx-auto mt-12 px-4">
              <button onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                className="inline-flex items-center gap-2 text-[#7A4A3A] text-[14px] font-semibold hover:text-[#2C1810] disabled:opacity-0 disabled:pointer-events-none transition-colors">
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
              <button onClick={() => setStep((s) => Math.min(4, s + 1))}
                disabled={!canNext}
                className={`inline-flex items-center gap-2 px-7 py-3 rounded-full text-[14px] font-bold transition-all ${
                  canNext
                    ? "bg-[#8B2A50] hover:bg-[#6A1A38] text-white shadow-md"
                    : "bg-[#E8C4B8] text-[#C4897A] cursor-not-allowed"
                }`}>
                {step === 3 ? "See My Results" : "Next"}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
