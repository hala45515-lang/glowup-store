"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Search,
  Trash2,
  ShoppingBag,
  Bookmark,
  Download,
  GripVertical,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useRoutinesStore } from "@/store/routinesStore";
import { toast } from "sonner";

// ─── Static product data per step ────────────────────────────────────────────

const STEP_PRODUCTS = {
  1: [
    { id: 101, brand: "charlotte tilbury", name: "Flawless Filter",       price: "49", shade: "3 Medium" },
    { id: 102, brand: "mac",               name: "Prep + Prime",           price: "32", shade: ""         },
    { id: 103, brand: "nyx",               name: "Marshmallow Primer",     price: "14", shade: ""         },
    { id: 104, brand: "smashbox",          name: "Photo Finish Primer",    price: "42", shade: ""         },
    { id: 105, brand: "fenty beauty",      name: "Pro Filt'r Primer",      price: "36", shade: ""         },
    { id: 106, brand: "tatcha",            name: "The Silk Canvas Primer", price: "54", shade: ""         },
  ],
  2: [
    { id: 201, brand: "charlotte tilbury", name: "Beautiful Skin Foundation",    price: "55", shade: "4 Neutral" },
    { id: 202, brand: "maybelline",        name: "Fit Me Matte + Poreless",      price: "8",  shade: "120 Classic Ivory" },
    { id: 203, brand: "nars",              name: "Radiant Creamy Concealer",     price: "32", shade: "Vanilla" },
    { id: 204, brand: "fenty beauty",      name: "Pro Filt'r Foundation",        price: "40", shade: "130N" },
    { id: 205, brand: "mac",               name: "Studio Fix Fluid Foundation",  price: "38", shade: "NC15" },
    { id: 206, brand: "tarte",             name: "Shape Tape Concealer",         price: "30", shade: "12N Fair" },
  ],
  3: [
    { id: 301, brand: "nars",              name: "Orgasm Blush",                 price: "38", shade: "Orgasm" },
    { id: 302, brand: "charlotte tilbury", name: "Filmstar Bronze & Glow",       price: "68", shade: ""       },
    { id: 303, brand: "benefit",           name: "Hoola Matte Bronzer",          price: "32", shade: ""       },
    { id: 304, brand: "fenty beauty",      name: "Killawatt Freestyle Highlighter", price: "38", shade: "Trophy Wife" },
    { id: 305, brand: "rare beauty",       name: "Soft Pinch Liquid Blush",      price: "23", shade: "Joy" },
    { id: 306, brand: "too faced",         name: "Chocolate Soleil Bronzer",     price: "36", shade: "Medium Deep" },
  ],
  4: [
    { id: 401, brand: "urban decay",       name: "Naked3 Palette",               price: "54", shade: ""       },
    { id: 402, brand: "charlotte tilbury", name: "Pillow Talk Eye Palette",      price: "75", shade: ""       },
    { id: 403, brand: "nyx",               name: "Epic Ink Liner",               price: "10", shade: "Black" },
    { id: 404, brand: "benefit",           name: "BADgal BANG! Mascara",         price: "28", shade: "Black" },
    { id: 405, brand: "mac",               name: "Technakohl Liner",             price: "21", shade: "Graphblack" },
    { id: 406, brand: "anastasia beverly hills", name: "Norvina Pro Palette",   price: "65", shade: ""       },
  ],
  5: [
    { id: 501, brand: "charlotte tilbury", name: "Matte Revolution Lipstick",    price: "36", shade: "Pillow Talk" },
    { id: 502, brand: "mac",               name: "Ruby Woo Retro Matte Lipstick",price: "21", shade: "Ruby Woo" },
    { id: 503, brand: "nyx",               name: "Butter Gloss",                 price: "8",  shade: "Crème Brulee" },
    { id: 504, brand: "rare beauty",       name: "Kind Words Matte Lipstick",    price: "20", shade: "Fearless" },
    { id: 505, brand: "fenty beauty",      name: "Gloss Bomb Universal Lip Luminizer", price: "22", shade: "Fenty Glow" },
    { id: 506, brand: "too faced",         name: "Lip Injection Maximum Plump",  price: "30", shade: "Clear" },
  ],
  6: [
    { id: 601, brand: "urban decay",       name: "All Nighter Setting Spray",    price: "34", shade: ""       },
    { id: 602, brand: "charlotte tilbury", name: "Airbrush Flawless Powder",     price: "48", shade: "1 Fair" },
    { id: 603, brand: "mac",               name: "Prep + Prime Fix+",            price: "29", shade: ""       },
    { id: 604, brand: "laura mercier",     name: "Translucent Loose Setting Powder", price: "42", shade: "Translucent" },
    { id: 605, brand: "nyx",               name: "Matte Finish Setting Spray",   price: "10", shade: ""       },
    { id: 606, brand: "caudalie",          name: "Beauty Elixir Face Mist",      price: "49", shade: ""       },
  ],
};

// ─── Step definitions ─────────────────────────────────────────────────────────

const ROUTINE_STEPS = [
  { id: 1, name: "Skin Prep", category: "Moisturizer & Primer",        emoji: "💧" },
  { id: 2, name: "Base",      category: "Foundation & Concealer",       emoji: "🎨" },
  { id: 3, name: "Cheeks",    category: "Blush, Bronzer & Highlighter", emoji: "🌸" },
  { id: 4, name: "Eyes",      category: "Eyeshadow, Liner & Mascara",   emoji: "👁️" },
  { id: 5, name: "Lips",      category: "Lipstick & Lip Liner",         emoji: "💄" },
  { id: 6, name: "Setting",   category: "Setting Spray & Powder",       emoji: "✨" },
];

// Each step circle gets a distinct brand-aligned color
const STEP_COLORS = ["#6B5228", "#8B3A2A", "#C4614A", "#7A3060", "#8B1840", "#7A6820"];

// Warm gradient fallback for thumbnails while a real photo is loading / unavailable
const THUMB_GRADIENTS = [
  "linear-gradient(135deg,#F2D4C8,#E0B8A0)",
  "linear-gradient(135deg,#EDD5C0,#D4B090)",
  "linear-gradient(135deg,#F0C8C0,#D8A090)",
  "linear-gradient(135deg,#E8D0E0,#C8A8C0)",
  "linear-gradient(135deg,#F0C0C8,#D89098)",
  "linear-gradient(135deg,#E8D8B8,#C8B888)",
];

const LOOK_GRADIENTS = {
  1: "linear-gradient(135deg,#E8D5B0 0%,#C8B080 100%)",
  2: "linear-gradient(135deg,#8B3030 0%,#5A1818 100%)",
  3: "linear-gradient(135deg,#D4A0A0 0%,#B87878 100%)",
};

function pick(stepId, productId) {
  return STEP_PRODUCTS[stepId]?.find((p) => p.id === productId) || null;
}

// Turns [[stepId, productId], ...] into the { stepId: [product, ...] } shape
// used by component state, so presets/saved routines share one format.
function buildSelection(pairs) {
  const map = {};
  pairs.forEach(([stepId, productId]) => {
    const product = pick(stepId, productId);
    if (!product) return;
    map[stepId] = [...(map[stepId] || []), product];
  });
  return map;
}

function selectionStats(map) {
  const all = Object.values(map).flat();
  return { count: all.length, price: Math.round(all.reduce((s, p) => s + formatPrice(p.price), 0)) };
}

const LOOK_PRESETS = [
  {
    id: 1,
    name: "5-Minute Morning Glow",
    description: "Quick, effortless everyday look for busy mornings.",
    level: "BEGINNER",
    pairs: [[1, 103], [2, 202], [5, 503], [6, 605]],
  },
  {
    id: 2,
    name: "Full Glam Night Out",
    description: "Bold, dramatic look for special occasions.",
    level: "ADVANCED",
    pairs: [[1, 106], [2, 201], [2, 203], [3, 302], [4, 401], [4, 404], [5, 501], [6, 601]],
  },
  {
    id: 3,
    name: "No-Makeup Makeup",
    description: "Natural, fresh-faced look that enhances your features.",
    level: "BEGINNER",
    pairs: [[1, 103], [2, 206], [3, 305], [5, 504], [6, 605]],
  },
];

function formatPrice(p) {
  const n = parseFloat(p);
  return isNaN(n) ? 0 : n;
}

// ─── Small building blocks ────────────────────────────────────────────────────

function StepThumb({ photoUrl, gradient, emoji, alt }) {
  const [failed, setFailed] = useState(false);
  const showPhoto = photoUrl && !failed;
  return (
    <div
      className="w-[60px] h-[60px] rounded-xl shrink-0 flex items-center justify-center overflow-hidden relative"
      style={{ background: gradient }}
    >
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <span className="text-2xl">{emoji}</span>
      )}
    </div>
  );
}

function LookImage({ photoUrl, gradient, emoji }) {
  const [failed, setFailed] = useState(false);
  const showPhoto = photoUrl && !failed;
  return (
    <div className="absolute inset-0" style={{ background: gradient }}>
      {showPhoto && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      )}
      {!showPhoto && (
        <div className="absolute inset-0 flex items-center justify-center text-[64px]">{emoji}</div>
      )}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 100%)" }}
      />
    </div>
  );
}

const LOOK_EMOJI = { 1: "🌅", 2: "💄", 3: "🌸" };

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RoutinesClient({ images = { stepVariants: {}, looks: {} } }) {
  const addToCart = useCartStore((s) => s.addItem);
  const builderRef = useRef(null);

  const [routineName,   setRoutineName]   = useState("");
  const [expanded,      setExpanded]      = useState({ 1: true });
  const [stepSearch,    setStepSearch]    = useState({});
  const [selected,      setSelected]      = useState({});
  const [editingId,     setEditingId]     = useState(null);
  const [editValue,     setEditValue]     = useState("");

  const savedRoutines  = useRoutinesStore((s) => s.routines);
  const addRoutine     = useRoutinesStore((s) => s.addRoutine);
  const removeRoutine  = useRoutinesStore((s) => s.removeRoutine);
  const renameRoutine  = useRoutinesStore((s) => s.renameRoutine);

  function toggleStep(step) {
    setExpanded((p) => ({ ...p, [step.id]: !p[step.id] }));
  }

  function toggleProduct(stepId, product) {
    setSelected((prev) => {
      const cur    = prev[stepId] || [];
      const exists = cur.find((p) => p.id === product.id);
      return {
        ...prev,
        [stepId]: exists ? cur.filter((p) => p.id !== product.id) : [...cur, product],
      };
    });
  }

  function visibleProducts(stepId) {
    const prods = STEP_PRODUCTS[stepId] || [];
    const q     = (stepSearch[stepId] || "").toLowerCase();
    if (!q) return prods;
    return prods.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }

  const allSelected = Object.values(selected).flat();
  const totalPrice  = allSelected.reduce((s, p) => s + formatPrice(p.price), 0);

  function scrollToBuilder() {
    builderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleAddAllToCart() {
    if (!allSelected.length) return;
    allSelected.forEach((p) => addToCart(p));
    toast.success(`${allSelected.length} products added to cart!`);
  }

  function handleSaveRoutine() {
    if (!allSelected.length) { toast.error("Add at least one product first."); return; }
    const name = routineName.trim() || "My Routine";
    const pairs = Object.entries(selected).flatMap(([stepId, prods]) =>
      prods.map((p) => [Number(stepId), p.id])
    );
    addRoutine({ id: Date.now(), name, pairs, count: allSelected.length, total: Math.round(totalPrice) });
    toast.success(`"${name}" saved!`);
  }

  function handleLoadSaved(routine) {
    const map = buildSelection(routine.pairs);
    setSelected(map);
    setRoutineName(routine.name);
    setExpanded(Object.keys(map).reduce((acc, k) => ({ ...acc, [k]: true }), {}));
    scrollToBuilder();
    toast.success(`Loaded "${routine.name}"`);
  }

  function handleDeleteSaved(id) {
    removeRoutine(id);
    if (editingId === id) setEditingId(null);
  }

  function startEdit(routine) {
    setEditingId(routine.id);
    setEditValue(routine.name);
  }

  function commitEdit(id) {
    const routine = savedRoutines.find((r) => r.id === id);
    renameRoutine(id, editValue.trim() || routine?.name);
    setEditingId(null);
  }

  function handleUseLook(look) {
    const map = buildSelection(look.pairs);
    setSelected(map);
    setRoutineName(look.name);
    setExpanded(Object.keys(map).reduce((acc, k) => ({ ...acc, [k]: true }), {}));
    scrollToBuilder();
    toast.success(`"${look.name}" loaded — customize it your way!`);
  }

  function handleAddCustomStep() {
    toast.info("Custom steps are coming soon!");
  }

  function handleViewAllRoutines() {
    toast.info("You're viewing all your saved routines.");
  }

  return (
    <div className="bg-[#FFF8F5] min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        className="relative w-full py-20 px-6 overflow-hidden"
        style={{ background: "linear-gradient(180deg,#EDD8C8 0%,#FFF8F5 100%)" }}
      >
        <div
          aria-hidden
          className="absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: "#C4614A" }}
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-16 w-[300px] h-[300px] rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: "#7A3060" }}
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2 mb-5"
          >
            <Sparkles className="h-4 w-4 text-[#C4614A]" />
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#C4614A] uppercase">
              Build Your Routine
            </span>
          </motion.div>
          <h1
            className="text-[52px] lg:text-[64px] font-black text-[#2C1810] leading-[1.05] mb-5"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Create Your Perfect<br />Makeup Routine
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#7A4A3A] text-[16px] max-w-[420px] leading-relaxed"
          >
            Build a personalized step-by-step routine and shop everything in one click.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Builder ───────────────────────────────────────────────────── */}
      <section ref={builderRef} className="max-w-[1240px] mx-auto px-6 pb-20 pt-10 scroll-mt-20">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Left: builder */}
          <div className="flex-1 min-w-0 w-full">

            {/* Routine name input */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <label className="block text-[14px] font-semibold text-[#2C1810] mb-2">
                Routine Name
              </label>
              <input
                type="text"
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
                placeholder="e.g. My Everyday Glam ✨"
                className="w-full h-[56px] px-5 rounded-2xl border border-[#E8C4B8] bg-white text-[#2C1810] placeholder:text-[#C4A090] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#C4614A]/25 transition-shadow"
              />
            </motion.div>

            {/* Section heading */}
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-[22px] font-black text-[#2C1810]">Build Your Routine</h2>
              <span className="px-3 py-1 rounded-full bg-[#F2D4C8] text-[#7A4A3A] text-[12px] font-semibold">
                {ROUTINE_STEPS.length} steps
              </span>
            </div>

            {/* Steps accordion */}
            <div className="flex flex-col gap-3">
              {ROUTINE_STEPS.map((step, idx) => {
                const isOpen   = !!expanded[step.id];
                const color    = STEP_COLORS[idx];
                const prods    = visibleProducts(step.id);
                const stepSel  = selected[step.id] || [];

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    layout
                    className={`rounded-2xl border transition-colors duration-200 ${
                      isOpen
                        ? "bg-white border-[#DDB8A8] shadow-[0_4px_20px_rgba(196,97,74,0.10)]"
                        : "bg-white border-[#EDD8CC]"
                    }`}
                  >
                    {/* Header row */}
                    <div className="flex items-center gap-3 px-4 py-[14px]">
                      <GripVertical className="h-4 w-4 text-[#DDB8A8] shrink-0 cursor-grab hidden sm:block" />

                      {/* Number badge */}
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-[13px] font-black"
                        style={{ backgroundColor: color }}
                      >
                        {step.id}
                      </div>

                      {/* Emoji */}
                      <span className="text-[20px] shrink-0">{step.emoji}</span>

                      {/* Name */}
                      <span className="font-bold text-[#2C1810] text-[15px] shrink-0">
                        {step.name}
                      </span>

                      {/* Category tag */}
                      <span className="px-2.5 py-[3px] rounded-full bg-[#F2D4C8] text-[#7A4A3A] text-[11px] font-medium shrink-0 hidden sm:inline-flex">
                        {step.category}
                      </span>

                      <div className="flex-1" />

                      {/* Add Product button — dark when open, muted when closed */}
                      {isOpen ? (
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          className="flex items-center gap-1.5 px-[18px] py-[9px] rounded-full bg-[#7A3048] text-white text-[12px] font-semibold hover:bg-[#5E1E34] transition-colors shrink-0"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Add Product</span>
                          <AnimatePresence mode="popLayout">
                            {stepSel.length > 0 && (
                              <motion.span
                                key={stepSel.length}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 24 }}
                                className="ml-0.5 bg-white/20 rounded-full px-1.5 py-px text-[11px]"
                              >
                                {stepSel.length}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => toggleStep(step)}
                          className="flex items-center gap-1.5 px-[18px] py-[9px] rounded-full bg-[#F2D4C8] text-[#7A4A3A] text-[12px] font-semibold hover:bg-[#E8C4B8] transition-colors shrink-0"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Add Product</span>
                        </motion.button>
                      )}

                      {/* Collapse/expand toggle */}
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleStep(step)}
                        className="w-8 h-8 rounded-full bg-[#F2D4C8] flex items-center justify-center text-[#7A4A3A] hover:bg-[#E8C4B8] transition-colors shrink-0"
                      >
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                          className="flex items-center justify-center"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.span>
                      </motion.button>
                    </div>

                    {/* Expanded body */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-5">
                            {/* Search */}
                            <div className="relative mb-4">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-[#C4A090]" />
                              <input
                                type="text"
                                value={stepSearch[step.id] || ""}
                                onChange={(e) =>
                                  setStepSearch((p) => ({ ...p, [step.id]: e.target.value }))
                                }
                                placeholder="Search products for this step..."
                                className="w-full h-11 pl-10 pr-4 rounded-2xl border border-[#E8C4B8] bg-[#FFF8F5] text-[#2C1810] placeholder:text-[#C4A090] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#C4614A]/20"
                              />
                            </div>

                            {/* Product list */}
                            <div className="flex flex-col">
                              {prods.length === 0 ? (
                                <p className="text-center text-[#C4A090] py-6 text-[13px]">
                                  No products found.
                                </p>
                              ) : (
                                prods.map((product, pIdx) => {
                                  const inStep = stepSel.some((p) => p.id === product.id);
                                  return (
                                    <motion.div
                                      key={product.id}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.25, delay: pIdx * 0.03 }}
                                      whileHover={{ backgroundColor: "#FFF8F5" }}
                                      className="flex items-center gap-4 py-[10px] px-2 rounded-xl"
                                    >
                                      {/* Thumbnail */}
                                      <StepThumb
                                        photoUrl={images.stepVariants?.[step.id]?.[pIdx % 2]?.url}
                                        gradient={THUMB_GRADIENTS[idx % THUMB_GRADIENTS.length]}
                                        emoji={step.emoji}
                                        alt={product.name}
                                      />

                                      {/* Info */}
                                      <div className="flex-1 min-w-0">
                                        <div className="text-[10px] font-black tracking-[0.18em] text-[#C4614A] uppercase mb-[2px]">
                                          {product.brand}
                                        </div>
                                        <div className="text-[14px] font-medium text-[#2C1810] leading-snug">
                                          {product.name}
                                        </div>
                                        <div className="text-[14px] font-bold text-[#2C1810] mt-[2px]">
                                          ${product.price}
                                        </div>
                                      </div>

                                      {/* Toggle button */}
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.85 }}
                                        onClick={() => toggleProduct(step.id, product)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                                          inStep
                                            ? "bg-[#2C1810] text-white"
                                            : "bg-[#7A3048] text-white hover:bg-[#5E1E34]"
                                        }`}
                                      >
                                        <AnimatePresence mode="wait" initial={false}>
                                          {inStep ? (
                                            <motion.span
                                              key="minus"
                                              initial={{ rotate: -90, opacity: 0 }}
                                              animate={{ rotate: 0, opacity: 1 }}
                                              exit={{ rotate: 90, opacity: 0 }}
                                              transition={{ duration: 0.15 }}
                                              className="text-[18px] leading-none"
                                            >
                                              −
                                            </motion.span>
                                          ) : (
                                            <motion.span
                                              key="plus"
                                              initial={{ rotate: -90, opacity: 0 }}
                                              animate={{ rotate: 0, opacity: 1 }}
                                              exit={{ rotate: 90, opacity: 0 }}
                                              transition={{ duration: 0.15 }}
                                            >
                                              <Plus className="h-[15px] w-[15px]" />
                                            </motion.span>
                                          )}
                                        </AnimatePresence>
                                      </motion.button>
                                    </motion.div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {/* Add Custom Step */}
              <motion.button
                whileHover={{ scale: 1.01, borderColor: "#C4614A" }}
                whileTap={{ scale: 0.99 }}
                onClick={handleAddCustomStep}
                className="w-full mt-2 py-[15px] rounded-2xl border-2 border-dashed border-[#E8C4B8] text-[#C4A090] text-[13px] font-semibold flex items-center justify-center gap-2 hover:text-[#C4614A] transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Custom Step
              </motion.button>
            </div>
          </div>

          {/* ── Right sidebar ────────────────────────────────────────── */}
          <div className="w-full lg:w-[300px] shrink-0 lg:sticky lg:top-24 flex flex-col gap-4">

            {/* YOUR ROUTINE card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-3xl border border-[#E8C4B8] p-6"
            >
              <div className="text-[10px] font-black tracking-[0.25em] text-[#C4614A] uppercase mb-1">
                Your Routine
              </div>
              <h3
                className="text-[24px] font-black text-[#2C1810] mb-6 leading-tight"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {routineName.trim() || "Untitled Routine"}
              </h3>

              <AnimatePresence mode="wait">
                {allSelected.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center py-4 mb-5"
                  >
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-[64px] h-[64px] rounded-full bg-[#F2D4C8] flex items-center justify-center mb-3"
                    >
                      <Sparkles className="h-7 w-7 text-[#C4A090]" />
                    </motion.div>
                    <p className="text-[#C4A090] text-[13px] text-center leading-relaxed max-w-[200px]">
                      Start adding products to see your routine come together.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="filled"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-5 space-y-3"
                  >
                    <AnimatePresence initial={false}>
                      {ROUTINE_STEPS.map((step) => {
                        const stepSel = selected[step.id] || [];
                        if (!stepSel.length) return null;
                        return (
                          <motion.div
                            key={step.id}
                            layout
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="text-[10px] font-bold tracking-[0.12em] text-[#C4A090] uppercase mb-1">
                              {step.emoji} {step.name}
                            </div>
                            <AnimatePresence initial={false}>
                              {stepSel.map((p) => (
                                <motion.div
                                  key={p.id}
                                  layout
                                  initial={{ opacity: 0, x: 8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -8 }}
                                  transition={{ duration: 0.2 }}
                                  className="flex items-center justify-between py-0.5"
                                >
                                  <span className="text-[12px] text-[#2C1810] truncate flex-1 mr-2">{p.name}</span>
                                  <span className="text-[12px] font-bold text-[#C4614A] shrink-0">${p.price}</span>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    <div className="border-t border-[#F2D4C8] pt-3 flex justify-between">
                      <span className="text-[13px] font-bold text-[#2C1810]">Total</span>
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={Math.round(totalPrice)}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.2 }}
                          className="text-[14px] font-black text-[#C4614A] inline-block"
                        >
                          ${Math.round(totalPrice)}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Add All to Cart */}
              <motion.button
                whileHover={allSelected.length ? { scale: 1.02 } : {}}
                whileTap={allSelected.length ? { scale: 0.97 } : {}}
                onClick={handleAddAllToCart}
                disabled={!allSelected.length}
                className="w-full py-[14px] rounded-2xl bg-[#C4614A] hover:bg-[#A84E39] text-white font-semibold text-[14px] flex items-center justify-center gap-2 mb-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#C4614A]"
              >
                <ShoppingBag className="h-4 w-4" />
                Add All to Cart
              </motion.button>

              {/* Save Routine */}
              <motion.button
                whileHover={allSelected.length ? { scale: 1.02 } : {}}
                whileTap={allSelected.length ? { scale: 0.97 } : {}}
                onClick={handleSaveRoutine}
                disabled={!allSelected.length}
                className="w-full py-[14px] rounded-2xl border-2 border-[#E8C4B8] text-[#C4A090] font-semibold text-[14px] flex items-center justify-center gap-2 hover:border-[#C4614A] hover:text-[#C4614A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Bookmark className="h-4 w-4" />
                Save Routine
              </motion.button>
            </motion.div>

            {/* MY SAVED ROUTINES card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-3xl border border-[#E8C4B8] p-6"
            >
              <h4 className="text-[11px] font-black tracking-[0.2em] text-[#2C1810] uppercase mb-4">
                My Saved Routines
              </h4>

              {savedRoutines.length === 0 ? (
                <p className="text-[#C4A090] text-[13px] leading-relaxed">
                  No saved routines yet — build one and hit Save.
                </p>
              ) : (
                <div className="flex flex-col gap-5">
                  <AnimatePresence initial={false}>
                    {savedRoutines.map((r) => {
                      const { count, price } = selectionStats(buildSelection(r.pairs));
                      const isEditing = editingId === r.id;
                      return (
                        <motion.div
                          key={r.id}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-start justify-between mb-1 gap-2">
                            <div className="flex-1 min-w-0">
                              {isEditing ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    autoFocus
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") commitEdit(r.id);
                                      if (e.key === "Escape") setEditingId(null);
                                    }}
                                    className="flex-1 min-w-0 h-8 px-2 rounded-lg border border-[#E8C4B8] text-[13px] text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#C4614A]/25"
                                  />
                                  <button
                                    onClick={() => commitEdit(r.id)}
                                    className="text-[#C4614A] p-1 shrink-0"
                                    aria-label="Save name"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="text-[#C4A090] p-1 shrink-0"
                                    aria-label="Cancel"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <div className="text-[14px] font-bold text-[#2C1810] truncate">{r.name}</div>
                                  <div className="text-[12px] text-[#C4A090] mt-0.5">
                                    {count} products ·{" "}
                                    <span className="text-[#C4614A] font-semibold">${price}</span>
                                  </div>
                                </>
                              )}
                            </div>
                            {!isEditing && (
                              <button
                                onClick={() => handleDeleteSaved(r.id)}
                                className="text-[#E0C0B0] hover:text-[#C4614A] transition-colors p-1 shrink-0"
                                aria-label="Delete routine"
                              >
                                <Trash2 className="h-[15px] w-[15px]" />
                              </button>
                            )}
                          </div>
                          {!isEditing && (
                            <div className="flex gap-2 mt-3">
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => handleLoadSaved(r)}
                                className="flex-1 py-[10px] rounded-xl bg-[#7A3048] hover:bg-[#5E1E34] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                              >
                                <Download className="h-3.5 w-3.5" />
                                Load
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => startEdit(r)}
                                className="flex-1 py-[10px] rounded-xl border border-[#E8C4B8] text-[#2C1810] text-[12px] font-semibold hover:border-[#C4614A] hover:text-[#C4614A] transition-colors"
                              >
                                Edit
                              </motion.button>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}

              <button
                onClick={handleViewAllRoutines}
                className="mt-5 text-[#C4614A] text-[12px] font-semibold hover:underline flex items-center gap-1"
              >
                View All Routines
                <span className="text-[15px]">›</span>
              </button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Get Inspired ──────────────────────────────────────────────── */}
      <section className="max-w-[1240px] mx-auto px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2
            className="text-[42px] font-black text-[#2C1810] mb-3"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Get Inspired
          </h2>
          <p className="text-[#7A4A3A] text-[15px]">
            Start with a curated routine and customize it your way.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LOOK_PRESETS.map((look, i) => {
            const { count, price } = selectionStats(buildSelection(look.pairs));
            return (
              <motion.div
                key={look.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group bg-white rounded-3xl overflow-hidden border border-[#E8C4B8] hover:shadow-xl transition-shadow duration-300"
              >
                {/* Visual header */}
                <div className="h-[220px] relative overflow-hidden">
                  <LookImage
                    photoUrl={images.looks?.[look.id]?.url}
                    gradient={LOOK_GRADIENTS[look.id]}
                    emoji={LOOK_EMOJI[look.id]}
                  />
                  <span className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.15em] bg-white/90 text-[#2C1810]">
                    {look.level}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5">
                  <h3 className="font-black text-[#2C1810] text-[19px] mb-1.5">{look.name}</h3>
                  <p className="text-[#7A4A3A] text-[13px] leading-relaxed mb-5">{look.description}</p>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[13px] text-[#C4A090]">{count} products</span>
                    <span className="text-[20px] font-black text-[#C4614A]">${price}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleUseLook(look)}
                    className="w-full py-[14px] rounded-2xl bg-[#7A3048] hover:bg-[#5E1E34] text-white font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors"
                  >
                    <Sparkles className="h-4 w-4" />
                    Use This Routine
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
