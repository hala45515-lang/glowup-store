"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Heart, ShoppingBag, Minus, Plus, Truck, RefreshCw,
  Leaf, Camera, Play, AtSign, Link2, ThumbsUp, Pencil,
  Check, ZoomIn, Lock,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "sonner";
import ProductShape from "@/components/shop/ProductShape";
import ProductImage from "@/components/shop/ProductImage";

const SHARE_ACTIONS = [
  { Icon: Camera, label: "Share to Instagram" },
  { Icon: Play, label: "Share to TikTok" },
  { Icon: AtSign, label: "Share to Twitter" },
  { Icon: Link2, label: "Copy link" },
];

// ─── Static data ──────────────────────────────────────────────────────────────

const SHADE_PRESETS = {
  lips: [
    { name: "Ruby Woo",        color: "#9B2335" },
    { name: "Velvet Teddy",    color: "#B07959" },
    { name: "Twig",            color: "#9C6E5E" },
    { name: "Mocha",           color: "#7A4A3A" },
    { name: "Candy Yum-Yum",  color: "#E8407A" },
    { name: "Creme d'Nude",   color: "#E8B8A0" },
    { name: "Sin",             color: "#6B1E28" },
    { name: "Blankety",        color: "#D8A090" },
  ],
  face: [
    { name: "NC15",   color: "#F0D8B8" },
    { name: "NC20",   color: "#E0C0A0" },
    { name: "NC25",   color: "#CCA880" },
    { name: "NC30",   color: "#B89060" },
    { name: "NC35",   color: "#A07840" },
    { name: "NC40",   color: "#886030" },
    { name: "NC42",   color: "#745020" },
    { name: "NC45",   color: "#604018" },
  ],
  eyes: [
    { name: "Carbon",   color: "#1A1A1A" },
    { name: "Espresso", color: "#3C2010" },
    { name: "Plum",     color: "#6B1E5A" },
    { name: "Navy",     color: "#1E3A6B" },
    { name: "Bronze",   color: "#8B5A20" },
    { name: "Gold",     color: "#C4900A" },
    { name: "Taupe",    color: "#8B7A6A" },
    { name: "Ivory",    color: "#E8E0D0" },
  ],
  skin: [
    { name: "Translucent", color: "#F5EEE8" },
    { name: "Soft Glow",   color: "#F5D8C8" },
    { name: "Natural",     color: "#EAC8A8" },
    { name: "Medium",      color: "#D4A878" },
    { name: "Warm",        color: "#C09060" },
    { name: "Deep",        color: "#9A6030" },
    { name: "Rich",        color: "#7A4818" },
    { name: "Espresso",    color: "#5A3010" },
  ],
  sets: [
    { name: "Rose Glow",  color: "#E8A0A0" },
    { name: "Terracotta", color: "#C4614A" },
    { name: "Bronze",     color: "#8B5A20" },
    { name: "Plum",       color: "#6B1E5A" },
    { name: "Nude",       color: "#D4A080" },
    { name: "Berry",      color: "#8B2050" },
    { name: "Coral",      color: "#E8705A" },
    { name: "Mocha",      color: "#7A4A3A" },
  ],
};

const DESCRIPTIONS = {
  lips: "A long-wearing, intensely pigmented formula that glides on smoothly and lasts all day. Comfortable wear from morning through evening with a finish that holds beautifully.",
  eyes: "A multi-tasking eye product designed to define and enhance. Buildable intensity with a crease-resistant formula that keeps your look fresh for hours.",
  face: "Skin-caring coverage that feels weightless and natural. Buildable formula that evens out your complexion while letting your skin breathe.",
  skin: "Enriched with skin-loving ingredients that hydrate, protect, and enhance your skin's natural radiance. Formulated for all skin types.",
  sets: "A curated collection of bestsellers, hand-picked to work in perfect harmony. Everything you need for a complete, glowing look in one beautiful set.",
};

const FEATURES = {
  lips: ["Long-wearing formula", "Intensely pigmented", "Comfortable all day", "Flatters all skin tones"],
  eyes: ["Crease-resistant", "Buildable intensity", "Long-lasting wear", "Suitable for sensitive eyes"],
  face: ["Buildable coverage", "Skin-caring formula", "Natural finish", "SPF-friendly base"],
  skin: ["Deeply hydrating", "All skin types", "Dermatologist tested", "Non-comedogenic"],
  sets: ["Curated pairing", "Value bundle", "Travel-friendly", "Perfect gift set"],
};

const REVIEWS = [
  { initials: "SM", name: "Sofia Marchetti", color: "#C4897A", date: "May 28, 2026", stars: 5,
    text: "The most perfect shade I've ever found. It doesn't budge through coffee, lunch, everything. The finish feels weightless and never dries me out. Already on my third repurchase.",
    helpful: 24 },
  { initials: "AJ", name: "Amara Johnson", color: "#8B6A5A", date: "May 14, 2026", stars: 5,
    text: "This is universally flattering — I gifted it to my mum and my sister and it looks incredible on all three of our different skin tones. A true classic that deserves all the hype.",
    helpful: 18 },
  { initials: "PN", name: "Priya Nair", color: "#7A5A4A", date: "Apr 30, 2026", stars: 4,
    text: "Gorgeous pigment and stays put for hours. I take off half a star only because you need a good base underneath, but once prepped it's flawless all day.",
    helpful: 9 },
];

const INFO_ITEMS = [
  { icon: Truck,      text: "Free shipping on orders over $50" },
  { icon: Check,      text: "In stock — ships in 1–2 days" },
  { icon: RefreshCw,  text: "30-day hassle-free returns" },
  { icon: Leaf,       text: "100% cruelty free & vegan" },
];

const TABS = ["Description", "Ingredients", "How to Use"];

const HOW_TO_USE = [
  "Prep your lips with a balm or primer for longer wear.",
  "Apply directly from the bullet for a precise look, or use a lip brush for more control.",
  "Blot with a tissue and reapply for a more matte, long-lasting finish.",
  "Layer with a clear gloss over the top for extra dimension.",
];

// ─── Product visual renderer ──────────────────────────────────────────────────

const NAMED_SHAPES = ["lipstick", "bottle", "compact", "eyeliner", "mascara"];

function ModalVisual({ product, transform, showCredit = true }) {
  const bg = product.bg || product.bgColor || "#F2D4C8";

  if (product.image) {
    return (
      <div className="absolute inset-0" style={{ backgroundColor: bg, transform }}>
        <ProductImage src={product.image} alt={product.name} category={product.category} />
        {showCredit && product.imageCredit && (
          <span className="absolute bottom-2 right-2 z-10 text-[9px] text-white/80 bg-black/30 px-1.5 py-0.5 rounded-full pointer-events-none">
            Photo: {product.imageCredit.name} / Unsplash
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0"
      style={{ background: bg, transform }}
    >
      {/* Named shape (lipstick, bottle, etc.) */}
      {product.shape && NAMED_SHAPES.includes(product.shape) && (
        <ProductShape shape={product.shape} glow={product.glow || ""} />
      )}

      {/* CSS-div shape (ProductsSection format) */}
      {(!product.shape || !NAMED_SHAPES.includes(product.shape)) && product.shapeColor && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            style={{
              width: product.shapeW || "56px",
              height: product.shapeH || "112px",
              background: product.shapeColor,
              borderRadius: "35%",
              transform: "rotate(12deg)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      )}

      {/* Palette */}
      {product.shape === "palette" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-32 rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)" }}>
            <div className="grid grid-cols-4 gap-2 h-full">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-md" style={{ background: `rgba(255,255,255,${0.06 + i * 0.035})`, border: "1px solid rgba(255,255,255,0.15)" }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Wand */}
      {product.shape === "wand" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center transform -rotate-[12deg]">
            <div className="w-3 h-16 rounded-t-full" style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)" }} />
            <div className="w-10 h-20 rounded-b-lg" style={{ background: "linear-gradient(120deg, rgba(255,255,255,0.05), rgba(255,255,255,0.18), rgba(255,255,255,0.05))", border: "1px solid rgba(255,255,255,0.25)" }} />
          </div>
        </div>
      )}

      {/* Pencil */}
      {product.shape === "pencil" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="transform -rotate-[15deg] flex flex-col items-center">
            <div className="w-2.5 h-4" style={{ background: "rgba(255,255,255,0.3)", clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
            <div className="w-4 h-28 rounded-sm" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.2), rgba(255,255,255,0.05))", border: "1px solid rgba(255,255,255,0.25)" }} />
            <div className="w-4 h-6 rounded-b-sm" style={{ background: "rgba(255,255,255,0.15)" }} />
          </div>
        </div>
      )}

      {/* Glow overlay */}
      {product.glow && (
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 35% 28%, ${product.glow}, transparent 55%)` }} />
      )}
    </div>
  );
}

// ─── Related product mini-card ────────────────────────────────────────────────

function RelatedCard({ product, index = 0, onAddToCart }) {
  const [added, setAdded] = useState(false);
  const addToWishlist = useWishlistStore((s) => s.addItem);
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);
  const wished = useWishlistStore((s) => s.isInWishlist(product.id));
  const bg = product.bg || product.bgColor || "#F2D4C8";

  function handleToggleWishlist() {
    if (wished) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist.");
    } else {
      addToWishlist({ ...product, bg: product.bg || product.bgColor });
      toast.success("Added to wishlist!");
    }
  }
  const tagLabel = product.tag === "new" ? "NEW" : product.tag === "bestseller" ? "BESTSELLER" : product.tag === "limited" ? `SALE · $${product.salePrice || product.price}` : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl border border-[#EDD8CC] overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative h-[160px]" style={{ background: bg }}>
        <ModalVisual product={product} />
        {tagLabel && (
          <span className={`absolute top-2 left-2 z-10 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${
            product.tag === "new" ? "bg-[#D46880] text-white" :
            product.tag === "bestseller" ? "bg-[#2C1810] text-white" :
            "bg-[#2C1810] text-white"
          }`}>
            {tagLabel}
          </span>
        )}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-colors ${wished ? "text-[#C4614A]" : "text-[#7A4A3A]"}`}
        >
          <Heart className={`h-3.5 w-3.5 ${wished ? "fill-current" : ""}`} />
        </button>
      </div>
      <div className="p-3">
        <div className="text-[9px] font-black tracking-[0.2em] text-[#C4614A] uppercase mb-0.5">{product.brand}</div>
        <div className="text-[13px] font-semibold text-[#2C1810] mb-1 leading-snug line-clamp-2">{product.name}</div>
        <div className="flex items-center gap-1 mb-2">
          <div className="flex gap-px">
            {[1,2,3,4,5].map(s => (
              <span key={s} style={{ color: s <= Math.round(product.rating) ? "#C4614A" : "#E8C4B8", fontSize: "11px" }}>★</span>
            ))}
          </div>
          <span className="text-[10px] text-[#7A4A3A]">{product.rating}</span>
        </div>
        <div className="text-[15px] font-black text-[#2C1810] mb-2">${product.price}</div>
        <button
          onClick={() => { onAddToCart(product); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
          className="w-full py-2 rounded-xl bg-[#7A3048] hover:bg-[#5C1E30] text-white font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
        >
          <ShoppingBag className="h-3 w-3" />
          {added ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export default function HomeProductQuickViewModal({ product, relatedProducts = [], onClose }) {
  const [thumbIdx,       setThumbIdx]       = useState(0);
  const [selectedShade,  setSelectedShade]  = useState(0);
  const [qty,            setQty]            = useState(1);
  const [activeTab,      setActiveTab]      = useState(0);
  const [reviews,        setReviews]        = useState(REVIEWS);
  const [helpfulVotes,   setHelpfulVotes]   = useState([false, false, false]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText,     setReviewText]     = useState("");
  const [reviewStars,    setReviewStars]    = useState(5);

  const addToCart          = useCartStore((s) => s.addItem);
  const addToWishlist      = useWishlistStore((s) => s.addItem);
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);
  const isWished           = useWishlistStore((s) => s.isInWishlist);
  const wished             = isWished(product.id);

  const shades = product.shades || SHADE_PRESETS[product.category] || SHADE_PRESETS.lips;
  const description = product.description || DESCRIPTIONS[product.category] || DESCRIPTIONS.lips;
  const features    = product.features    || FEATURES[product.category]    || FEATURES.lips;

  const thumbTransforms = [
    undefined,
    "scale(1.18)",
    "scale(0.88) rotate(-6deg)",
    "scale(1.06) rotate(6deg)",
  ];

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function handleAddToCart() {
    const bg = product.bg || product.bgColor;
    addToCart({ ...product, shade: shades[selectedShade]?.name, bg }, qty);
    toast.success(`${product.name} added to cart!`);
  }

  async function handleShare(label) {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} by ${product.brand} on GlowCart!`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    if (label === "Copy link" || !navigator.share) {
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard!");
      } catch {
        toast.error("Couldn't copy link.");
      }
      return;
    }
    try {
      await navigator.share(shareData);
    } catch {
      // user cancelled the native share sheet — nothing to do
    }
  }

  function handleSubmitReview(e) {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setReviews((prev) => [
      {
        initials: "YOU",
        name: "You",
        color: "#C4614A",
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        stars: reviewStars,
        text: reviewText.trim(),
        helpful: 0,
      },
      ...prev,
    ]);
    setHelpfulVotes((prev) => [false, ...prev]);
    setReviewText("");
    setReviewStars(5);
    setShowReviewForm(false);
    toast.success("Thanks for your review!");
  }

  function handleAddRelated(p) {
    addToCart({ ...p, bg: p.bg || p.bgColor });
    toast.success(`${p.name} added to cart!`);
  }

  function handleToggleWishlist() {
    if (wished) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist.");
    } else {
      addToWishlist({ ...product, bg: product.bg || product.bgColor });
      toast.success("Added to wishlist!");
    }
  }

  return (
    <>
      <style jsx global>{`
        @keyframes qvFadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes qvSlideUp { from { opacity:0; transform:translateY(32px) } to { opacity:1; transform:translateY(0) } }
        .qv-fade  { animation: qvFadeIn  .22s ease-out; }
        .qv-slide { animation: qvSlideUp .28s ease-out; }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/55 backdrop-blur-sm qv-fade flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="relative bg-white rounded-3xl w-full max-w-[980px] max-h-[92vh] overflow-y-auto qv-slide shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          style={{ scrollbarWidth: "thin", scrollbarColor: "#E8C4B8 transparent" }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="sticky top-4 left-0 ml-auto mr-4 z-30 w-10 h-10 rounded-full bg-white shadow border border-[#E8C4B8] flex items-center justify-center text-[#2C1810] hover:bg-[#F2D4C8] transition-colors"
            style={{ float: "right" }}
          >
            <X className="h-[18px] w-[18px]" />
          </button>

          {/* ── PRODUCT DETAIL (2 cols) ──────────────────────────────────── */}
          <div className="flex flex-col lg:flex-row" style={{ clear: "both" }}>

            {/* LEFT: Visual + thumbnails */}
            <div className="w-full lg:w-[46%] shrink-0 border-r border-[#F2D4C8]">
              {/* Main image */}
              <div className="relative overflow-hidden" style={{ height: "460px", borderRadius: "24px 0 0 0" }}>
                <ModalVisual product={product} transform={thumbTransforms[thumbIdx]} />

                {/* Badge */}
                {product.tag && (
                  <span className={`absolute top-4 left-4 z-10 text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow ${
                    product.tag === "new" ? "bg-[#D46880] text-white" :
                    product.tag === "bestseller" ? "bg-[#2C1810] text-white" :
                    "bg-[#E8A598] text-[#2C1810]"
                  }`}>
                    {product.tag === "new" ? "New" : product.tag === "bestseller" ? "Bestseller" : "Limited"}
                  </span>
                )}

                {/* Hover to zoom */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/85 backdrop-blur-sm rounded-full px-3 py-1.5 text-[11px] text-[#2C1810] font-medium">
                  <ZoomIn className="h-3 w-3" />
                  Hover to zoom
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 p-4 bg-[#FAFAFA]">
                {[0, 1, 2, 3].map((i) => (
                  <button
                    key={i}
                    onClick={() => setThumbIdx(i)}
                    className={`relative w-[76px] h-[76px] rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      thumbIdx === i
                        ? "border-[#C4614A] shadow-md"
                        : "border-[#E8C4B8] hover:border-[#C4897A]"
                    }`}
                  >
                    <ModalVisual product={product} transform={thumbTransforms[i]} showCredit={false} />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: Product info */}
            <div className="flex-1 p-8">
              {/* Brand */}
              <div className="text-[11px] font-black tracking-[0.28em] text-[#C4614A] uppercase mb-2">
                {product.brand}
              </div>

              {/* Name */}
              <h2
                className="text-[30px] lg:text-[34px] font-black text-[#2C1810] leading-tight mb-3"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {product.name}
              </h2>

              {/* Stars */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} style={{ color: s <= Math.round(product.rating) ? "#C4614A" : "#E8C4B8", fontSize: "16px" }}>★</span>
                  ))}
                </div>
                <span className="text-[14px] font-semibold text-[#2C1810]">{product.rating}</span>
                <button className="text-[13px] text-[#C4614A] underline">
                  ({(product.reviews || 0).toLocaleString()} reviews)
                </button>
              </div>

              {/* Price */}
              <div
                className="text-[34px] font-black text-[#2C1810] mb-5"
                style={{ fontFamily: "Georgia, serif" }}
              >
                ${parseFloat(product.price).toFixed(2)}
              </div>

              <div className="h-px bg-[#F2D4C8] mb-5" />

              {/* Shades */}
              <div className="mb-5">
                <div className="text-[13px] text-[#7A4A3A] mb-3">
                  Shade: <span className="font-bold text-[#2C1810]">{shades[selectedShade]?.name}</span>
                </div>
                <div className="flex gap-2.5 flex-wrap">
                  {shades.map((shade, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedShade(i)}
                      title={shade.name}
                      className="w-8 h-8 rounded-full border-[3px] transition-all hover:scale-110"
                      style={{
                        background: shade.color,
                        borderColor: selectedShade === i ? "#2C1810" : "transparent",
                        boxShadow: selectedShade === i ? "0 0 0 2px #F2D4C8, 0 0 0 4px #2C1810" : "0 0 0 1.5px #E8C4B8",
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="h-px bg-[#F2D4C8] mb-5" />

              {/* Quantity */}
              <div className="mb-5">
                <div className="text-[13px] font-semibold text-[#2C1810] mb-3">Quantity</div>
                <div className="inline-flex items-stretch border border-[#E8C4B8] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-11 h-11 flex items-center justify-center text-[#7A4A3A] hover:bg-[#F2D4C8] transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="w-12 h-11 flex items-center justify-center text-[15px] font-bold text-[#2C1810] border-x border-[#E8C4B8]">
                    {qty}
                  </div>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-11 h-11 flex items-center justify-center text-[#7A4A3A] hover:bg-[#F2D4C8] transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="w-full py-4 rounded-2xl bg-[#7A3048] hover:bg-[#5C1E30] text-white font-semibold text-[15px] flex items-center justify-center gap-3 transition-colors mb-3"
              >
                <ShoppingBag className="h-5 w-5" />
                Add to Cart · ${(parseFloat(product.price) * qty).toFixed(2)}
              </button>

              {/* Add to Wishlist */}
              <button
                onClick={handleToggleWishlist}
                className={`w-full py-4 rounded-2xl border-2 font-semibold text-[15px] flex items-center justify-center gap-3 transition-colors mb-6 ${
                  wished
                    ? "bg-[#F2D4C8] border-[#C4614A] text-[#C4614A]"
                    : "border-[#E8C4B8] text-[#2C1810] hover:border-[#C4614A] hover:text-[#C4614A]"
                }`}
              >
                <Heart className={`h-5 w-5 ${wished ? "fill-current" : ""}`} />
                {wished ? "Saved to Wishlist" : "Add to Wishlist"}
              </button>

              {/* Info list */}
              <div className="rounded-2xl border border-[#E8C4B8] p-4 mb-5">
                <div className="flex flex-col gap-3">
                  {INFO_ITEMS.map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#F2D4C8] flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-[#7A4A3A]" />
                      </div>
                      <span className="text-[13px] text-[#7A4A3A] font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-semibold text-[#2C1810]">Share:</span>
                {SHARE_ACTIONS.map(({ Icon, label }) => (
                  <button
                    key={label}
                    onClick={() => handleShare(label)}
                    aria-label={label}
                    title={label}
                    className="w-9 h-9 rounded-full border border-[#E8C4B8] flex items-center justify-center text-[#7A4A3A] hover:border-[#C4614A] hover:text-[#C4614A] transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── TABS ────────────────────────────────────────────────────────── */}
          <div className="border-t border-[#E8C4B8] px-8 pt-7 pb-8">
            <div className="flex border-b border-[#E8C4B8] mb-6">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`pb-3 pr-10 text-[15px] font-semibold relative transition-colors ${
                    activeTab === i ? "text-[#C4614A]" : "text-[#7A4A3A] hover:text-[#2C1810]"
                  }`}
                >
                  {tab}
                  {activeTab === i && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#C4614A] rounded-t-full" />}
                </button>
              ))}
            </div>

            {activeTab === 0 && (
              <div>
                <p className="text-[14px] text-[#7A4A3A] leading-relaxed mb-5">{description}</p>
                <div className="grid grid-cols-2 gap-3">
                  {features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#F2D4C8] flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-[#C4614A]" />
                      </div>
                      <span className="text-[13px] text-[#2C1810] font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <p className="text-[14px] text-[#7A4A3A] leading-relaxed">
                Ethylhexyl Palmitate, Octyldodecanol, Diisostearyl Malate, Polyglyceryl-2 Triisostearate, Beeswax / Cire d&apos;abeille, Microcrystalline Wax / Cire microcristalline, Phenyl Trimethicone, Neopentyl Glycol Diethylhexanoate, Candelilla Wax / Cire de candelilla, Carnauba Wax, Tocopheryl Acetate, Propylparaben, BHT. May Contain: CI 15850, CI 45380, CI 77491, CI 77492, CI 77499.
              </p>
            )}

            {activeTab === 2 && (
              <div className="flex flex-col gap-4">
                {HOW_TO_USE.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#C4614A] text-white text-[12px] font-black flex items-center justify-center shrink-0">{i + 1}</span>
                    <span className="text-[14px] text-[#7A4A3A] leading-relaxed pt-0.5">{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── CUSTOMER REVIEWS ────────────────────────────────────────────── */}
          <div className="border-t border-[#E8C4B8] px-8 pt-7 pb-8 bg-[#FFF8F5]">
            <h3
              className="text-[28px] font-black text-[#2C1810] mb-8"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Customer Reviews
            </h3>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Rating summary */}
              <div className="w-full lg:w-[260px] shrink-0 bg-white rounded-2xl border border-[#E8C4B8] p-6">
                <div
                  className="text-[56px] font-black text-[#2C1810] text-center leading-none mb-1"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {product.rating}
                </div>
                <div className="flex justify-center gap-0.5 mb-1">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} style={{ color: s <= Math.round(product.rating) ? "#C4614A" : "#E8C4B8", fontSize: "20px" }}>★</span>
                  ))}
                </div>
                <p className="text-center text-[12px] text-[#7A4A3A] mb-5">
                  Based on {(product.reviews || 0).toLocaleString()} reviews
                </p>
                {[[5, 89], [4, 8], [3, 2], [2, 1], [1, 0]].map(([star, pct]) => (
                  <div key={star} className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] text-[#7A4A3A] w-5">{star}★</span>
                    <div className="flex-1 h-2 bg-[#F2D4C8] rounded-full overflow-hidden">
                      <div className="h-full bg-[#C4614A] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[11px] text-[#7A4A3A] w-7 text-right">{pct}%</span>
                  </div>
                ))}
                <button
                  onClick={() => setShowReviewForm((v) => !v)}
                  className={`w-full mt-5 py-3 rounded-xl border-2 font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors ${
                    showReviewForm
                      ? "bg-[#C4614A] border-[#C4614A] text-white"
                      : "border-[#C4614A] text-[#C4614A] hover:bg-[#F2D4C8]"
                  }`}
                >
                  <Pencil className="h-4 w-4" /> {showReviewForm ? "Cancel" : "Write a Review"}
                </button>
              </div>

              {/* Review cards */}
              <div className="flex-1 flex flex-col gap-4">
                <AnimatePresence initial={false}>
                  {showReviewForm && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      onSubmit={handleSubmitReview}
                      className="overflow-hidden bg-white rounded-2xl border border-[#C4614A] p-5"
                    >
                      <div className="text-[13px] font-semibold text-[#2C1810] mb-2">Your rating</div>
                      <div className="flex gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => setReviewStars(s)}
                            className="text-2xl leading-none transition-transform hover:scale-110"
                            style={{ color: s <= reviewStars ? "#C4614A" : "#E8C4B8" }}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your experience with this product..."
                        rows={3}
                        required
                        className="w-full rounded-xl border border-[#E8C4B8] p-3 text-[13px] text-[#2C1810] placeholder:text-[#C4A090] focus:outline-none focus:ring-2 focus:ring-[#C4614A]/25 mb-3 resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-[#7A3048] hover:bg-[#5C1E30] text-white font-semibold text-[13px] transition-colors"
                        >
                          Submit Review
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="px-5 py-2.5 rounded-xl border border-[#E8C4B8] text-[#2C1810] font-semibold text-[13px] hover:border-[#C4614A] hover:text-[#C4614A] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
                {reviews.map((rev, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-[#E8C4B8] p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[13px] shrink-0"
                        style={{ background: rev.color }}
                      >
                        {rev.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[14px] text-[#2C1810]">{rev.name}</span>
                          <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            <Check className="h-2.5 w-2.5" /> Verified
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex gap-px">
                            {[1,2,3,4,5].map(s => (
                              <span key={s} style={{ color: s <= rev.stars ? "#C4614A" : "#E8C4B8", fontSize: "12px" }}>★</span>
                            ))}
                          </div>
                          <span className="text-[11px] text-[#7A4A3A]">{rev.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[13px] text-[#7A4A3A] leading-relaxed mb-3">{rev.text}</p>
                    <button
                      onClick={() => setHelpfulVotes(v => v.map((x, j) => j === i ? !x : x))}
                      className={`flex items-center gap-2 text-[12px] font-medium px-3 py-1.5 rounded-full border transition-colors ${
                        helpfulVotes[i]
                          ? "bg-[#F2D4C8] border-[#C4614A] text-[#C4614A]"
                          : "border-[#E8C4B8] text-[#7A4A3A] hover:border-[#C4614A] hover:text-[#C4614A]"
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      Helpful ({rev.helpful + (helpfulVotes[i] ? 1 : 0)})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── YOU MAY ALSO LOVE ────────────────────────────────────────────── */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-[#E8C4B8] px-8 pt-7 pb-8">
              <h3
                className="text-[28px] font-black text-[#2C1810] mb-1"
                style={{ fontFamily: "Georgia, serif" }}
              >
                You May Also Love
              </h3>
              <p className="text-[14px] text-[#7A4A3A] mb-6">Hand-picked pairings to complete your look.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.slice(0, 4).map((p, i) => (
                  <RelatedCard key={p.id} product={p} index={i} onAddToCart={handleAddRelated} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
