"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Heart,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  X,
  Star,
  SlidersHorizontal,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "sonner";
import ProductImage from "@/components/shop/ProductImage";
import ProductCard from "@/components/shop/ProductCard";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { CATEGORIES as BASE_CATEGORIES } from "@/lib/products";

const CATEGORIES = [{ id: "all", label: "All Products", emoji: null }, ...BASE_CATEGORIES];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "reviews", label: "Most Reviewed" },
];

const PER_PAGE = 6;

// ─── Quick View Modal ────────────────────────────────────────────────────────

function QuickViewModal({ product, onClose }) {
  const [added, setAdded]   = useState(false);
  const addToCart           = useCartStore((s) => s.addItem);
  const isWished            = useWishlistStore((s) => s.isInWishlist(product.id));
  const addToWishlist       = useWishlistStore((s) => s.addItem);
  const removeFromWishlist  = useWishlistStore((s) => s.removeItem);

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function handleAdd() {
    addToCart(product);
    setAdded(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleWishlist() {
    if (isWished) { removeFromWishlist(product.id); toast.success("Removed from wishlist"); }
    else           { addToWishlist(product);          toast.success("Added to wishlist!"); }
  }

  const fullStars = Math.floor(product.rating);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#2C1810]/40 backdrop-blur-sm"
        style={{ animation: "fadeIn 0.2s ease" }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-[820px] max-h-[90vh] overflow-y-auto bg-white rounded-[28px] shadow-2xl flex flex-col lg:flex-row lg:overflow-hidden"
        style={{ animation: "slideUp 0.28s cubic-bezier(0.34,1.4,0.64,1)" }}
      >
        {/* Left – product visual */}
        <div
          className="w-full lg:w-[46%] shrink-0 relative flex items-center justify-center h-[260px] lg:h-auto lg:min-h-[420px]"
          style={{ backgroundColor: product.bgColor }}
        >
          {product.tag === "bestseller" && (
            <span className="absolute top-4 left-4 z-10 text-[10px] font-black tracking-[0.18em] uppercase px-3 py-1.5 rounded-full bg-[#2C1810]/70 text-white backdrop-blur-sm">
              Bestseller
            </span>
          )}
          <ProductImage src={product.image} alt={product.name} category={product.category} />
          {product.imageCredit && (
            <span className="absolute bottom-3 right-3 z-10 text-[9px] text-white/80 bg-black/30 px-1.5 py-0.5 rounded-full pointer-events-none">
              Photo: {product.imageCredit.name} / Unsplash
            </span>
          )}
        </div>

        {/* Right – details */}
        <div className="flex-1 flex flex-col p-8 lg:p-10">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#F2D4C8] hover:bg-[#E8C4B8] flex items-center justify-center text-[#7A4A3A] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Brand */}
          <div className="text-[11px] font-black tracking-[0.25em] text-[#C4614A] uppercase mb-2">
            {product.brand}
          </div>

          {/* Name */}
          <h2
            className="text-[30px] font-black text-[#2C1810] leading-tight mb-3"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {product.name}
          </h2>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="h-4 w-4"
                  fill={s <= fullStars ? "#C4614A" : "none"}
                  stroke={s <= fullStars ? "#C4614A" : "#E8C4B8"}
                />
              ))}
            </div>
            <span className="text-[13px] text-[#7A4A3A] font-medium">
              {product.rating} · {product.reviews.toLocaleString()} reviews
            </span>
          </div>

          {/* Description */}
          <p className="text-[#7A4A3A] text-[14px] leading-relaxed mb-6 flex-1">
            {product.description}
          </p>

          {/* Price */}
          <div className="text-[36px] font-black text-[#2C1810] mb-6">
            ${product.price}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleAdd}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#C4614A] hover:bg-[#A84E39] text-white font-semibold text-[15px] transition-all active:scale-[0.98]"
            >
              <ShoppingBag className="h-5 w-5" />
              {added ? "Added to Cart!" : "Add to Cart"}
            </button>

            <button
              onClick={handleWishlist}
              className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all shrink-0 ${
                isWished
                  ? "bg-[#C4614A] border-[#C4614A] text-white"
                  : "border-[#E8C4B8] text-[#7A4A3A] hover:border-[#C4614A] hover:text-[#C4614A]"
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart className={`h-5 w-5 ${isWished ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  );
}

// ─── Product card ────────────────────────────────────────────────────────────

function ShopProductListRow({ product, onQuickView }) {
  const [added, setAdded] = useState(false);
  const addToCart          = useCartStore((s) => s.addItem);
  const isWished           = useWishlistStore((s) => s.isInWishlist(product.id));
  const addToWishlist      = useWishlistStore((s) => s.addItem);
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);

  function handleAdd(e) {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleWishlist(e) {
    e.preventDefault();
    if (isWished) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist.");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist!");
    }
  }

  const fullStars = Math.floor(product.rating);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex gap-0">
      <div
        className="relative w-28 sm:w-36 shrink-0"
        style={{ backgroundColor: product.bgColor }}
      >
        <ProductImage src={product.image} alt={product.name} category={product.category} />
        {product.tag === "bestseller" && (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2C1810] text-white uppercase tracking-wide">
            Bestseller
          </span>
        )}
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="text-[10px] font-black tracking-[0.22em] text-[#C4614A] uppercase mb-0.5">
            {product.brand}
          </div>
          <h3 className="font-semibold text-[#2C1810] text-[14px] mb-1 leading-snug">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="flex gap-px">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className="text-[11px]"
                  style={{ color: s <= fullStars ? "#C4614A" : "#E8C4B8" }}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-[11px] text-[#7A4A3A]">
              {product.rating} ({product.reviews.toLocaleString()})
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-y-2 mt-2">
          <span className="text-[20px] font-black text-[#2C1810]">${product.price}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleWishlist}
              className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                isWished
                  ? "border-[#C4614A] text-[#C4614A]"
                  : "border-[#E8C4B8] text-[#7A4A3A] hover:border-[#C4614A] hover:text-[#C4614A]"
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isWished ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#C4614A] hover:bg-[#A84E39] text-white text-[12px] font-semibold whitespace-nowrap transition-colors"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              {added ? "Added!" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dual range slider ───────────────────────────────────────────────────────

function PriceRangeSlider({ min, max, value, onChange }) {
  const [minVal, maxVal] = value;
  const range = max - min;
  const leftPct = ((minVal - min) / range) * 100;
  const rightPct = ((max - maxVal) / range) * 100;

  return (
    <div className="relative h-6 flex items-center">
      <div className="absolute w-full h-1.5 rounded-full bg-[#E8C4B8]">
        <div
          className="absolute h-full rounded-full bg-[#C4614A]"
          style={{ left: `${leftPct}%`, right: `${rightPct}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(e) => onChange([Math.min(Number(e.target.value), maxVal - 1), maxVal])}
        className="absolute w-full h-full opacity-0 cursor-pointer"
        style={{ zIndex: minVal >= maxVal - 5 ? 5 : 3 }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(e) => onChange([minVal, Math.max(Number(e.target.value), minVal + 1)])}
        className="absolute w-full h-full opacity-0 cursor-pointer"
        style={{ zIndex: 4 }}
      />
      <div
        className="absolute w-4 h-4 rounded-full bg-[#C4614A] border-2 border-white shadow pointer-events-none"
        style={{ left: `calc(${leftPct}% - 8px)` }}
      />
      <div
        className="absolute w-4 h-4 rounded-full bg-[#C4614A] border-2 border-white shadow pointer-events-none"
        style={{ left: `calc(${100 - rightPct}% - 8px)` }}
      />
    </div>
  );
}

// ─── Main shop component ─────────────────────────────────────────────────────

export default function ShopClient({ products }) {
  const BRANDS = useMemo(
    () => [...new Set(products.map((p) => p.brand))].sort(),
    [products]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 150]);
  const [minInput, setMinInput] = useState("0");
  const [maxInput, setMaxInput] = useState("150");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [view, setView] = useState("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  function toggleBrand(brand) {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setPage(1);
  }

  function handlePriceChange(val) {
    setPriceRange(val);
    setMinInput(String(val[0]));
    setMaxInput(String(val[1]));
    setPage(1);
  }

  function handleMinInput(e) {
    const v = e.target.value;
    setMinInput(v);
    const n = Number(v);
    if (!isNaN(n) && n >= 0 && n < priceRange[1]) {
      setPriceRange([n, priceRange[1]]);
    }
  }

  function handleMaxInput(e) {
    const v = e.target.value;
    setMaxInput(v);
    const n = Number(v);
    if (!isNaN(n) && n <= 150 && n > priceRange[0]) {
      setPriceRange([priceRange[0], n]);
    }
  }

  function clearAll() {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedBrands([]);
    setPriceRange([0, 150]);
    setMinInput("0");
    setMaxInput("150");
    setMinRating(0);
    setSortBy("featured");
    setPage(1);
  }

  const filtered = useMemo(() => {
    let list = products;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedBrands.length > 0) {
      list = list.filter((p) => selectedBrands.includes(p.brand));
    }

    list = list.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (minRating > 0) {
      list = list.filter((p) => p.rating >= minRating);
    }

    switch (sortBy) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        list = [...list].sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        break;
    }

    return list;
  }, [products, searchQuery, selectedCategory, selectedBrands, priceRange, minRating, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function categoryCount(catId) {
    if (catId === "all") return products.length;
    return products.filter((p) => p.category === catId).length;
  }

  function brandCount(brand) {
    return products.filter((p) => p.brand === brand).length;
  }

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedBrands.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 150 ||
    minRating > 0 ||
    searchQuery.trim() !== "";

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    selectedBrands.length +
    (priceRange[0] > 0 || priceRange[1] < 150 ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  function FiltersPanel() {
    return (
      <>
        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4614A]" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-3 rounded-full border-2 border-[#E8C4B8] bg-white text-[13px] text-[#2C1810] placeholder-[#C4897A] focus:outline-none focus:border-[#C4614A] transition-colors"
          />
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-[11px] font-black tracking-[0.2em] text-[#2C1810] uppercase mb-4">
            Categories
          </h3>
          <ul className="space-y-2.5">
            {CATEGORIES.map((cat) => {
              const count = categoryCount(cat.id);
              const checked = selectedCategory === cat.id;
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
                    className="w-full flex items-center gap-3 group"
                  >
                    <span
                      className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors shrink-0 ${
                        checked
                          ? "bg-[#C4614A] border-[#C4614A]"
                          : "border-[#E8C4B8] group-hover:border-[#C4614A]"
                      }`}
                    >
                      {checked && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className={`flex-1 text-left text-[13px] transition-colors ${checked ? "text-[#C4614A] font-semibold" : "text-[#2C1810] group-hover:text-[#C4614A]"}`}>
                      {cat.emoji && <span className="mr-1.5">{cat.emoji}</span>}
                      {cat.label}
                    </span>
                    <span className="text-[12px] text-[#C4897A]">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Brands */}
        <div className="mb-8">
          <h3 className="text-[11px] font-black tracking-[0.2em] text-[#2C1810] uppercase mb-4">
            Brands
          </h3>
          <ul className="space-y-2.5">
            {BRANDS.map((brand) => {
              const checked = selectedBrands.includes(brand);
              return (
                <li key={brand}>
                  <button
                    onClick={() => toggleBrand(brand)}
                    className="w-full flex items-center gap-3 group"
                  >
                    <span
                      className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors shrink-0 ${
                        checked
                          ? "bg-[#C4614A] border-[#C4614A]"
                          : "border-[#E8C4B8] group-hover:border-[#C4614A]"
                      }`}
                    >
                      {checked && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className={`flex-1 text-left text-[13px] transition-colors ${checked ? "text-[#C4614A] font-semibold" : "text-[#2C1810] group-hover:text-[#C4614A]"}`}>
                      {brand}
                    </span>
                    <span className="text-[12px] text-[#C4897A]">{brandCount(brand)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <h3 className="text-[11px] font-black tracking-[0.2em] text-[#2C1810] uppercase mb-4">
            Price Range
          </h3>
          <PriceRangeSlider
            min={0}
            max={150}
            value={priceRange}
            onChange={handlePriceChange}
          />
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1">
              <label className="text-[11px] text-[#7A4A3A] mb-1 block">Min $</label>
              <input
                type="number"
                min={0}
                max={150}
                value={minInput}
                onChange={handleMinInput}
                className="w-full border-2 border-[#E8C4B8] rounded-lg px-3 py-2 text-[13px] text-[#2C1810] focus:outline-none focus:border-[#C4614A] transition-colors"
              />
            </div>
            <div className="flex-1">
              <label className="text-[11px] text-[#7A4A3A] mb-1 block">Max $</label>
              <input
                type="number"
                min={0}
                max={150}
                value={maxInput}
                onChange={handleMaxInput}
                className="w-full border-2 border-[#E8C4B8] rounded-lg px-3 py-2 text-[13px] text-[#2C1810] focus:outline-none focus:border-[#C4614A] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-8">
          <h3 className="text-[11px] font-black tracking-[0.2em] text-[#2C1810] uppercase mb-4">
            Rating
          </h3>
          <div className="space-y-2">
            {[4, 3, 2].map((r) => (
              <button
                key={r}
                onClick={() => { setMinRating(minRating === r ? 0 : r); setPage(1); }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                  minRating === r
                    ? "bg-[#F2D4C8] text-[#C4614A]"
                    : "text-[#2C1810] hover:bg-[#FDE8E0]"
                }`}
              >
                <div className="flex gap-px">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className="text-[12px]"
                      style={{ color: s <= r ? "#C4614A" : "#E8C4B8" }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span>{r}★ &amp; up</span>
              </button>
            ))}
            <button
              onClick={() => { setMinRating(0); setPage(1); }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                minRating === 0
                  ? "bg-[#F2D4C8] text-[#C4614A]"
                  : "text-[#2C1810] hover:bg-[#FDE8E0]"
              }`}
            >
              <span className="text-base">✦</span>
              <span>All ratings</span>
            </button>
          </div>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full border-2 border-[#E8C4B8] text-[#7A4A3A] text-[13px] font-semibold hover:border-[#C4614A] hover:text-[#C4614A] transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Clear All Filters
          </button>
        )}
      </>
    );
  }

  return (
    <>
      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* Hero banner */}
      <section className="bg-[#F5EAE3] py-12 lg:py-16">
        <div className="container mx-auto px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-[13px] text-[#7A4A3A] mb-6">
            <Link href="/" className="hover:text-[#C4614A] transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[#C4614A] font-medium">Shop</span>
          </nav>
          <h1 className="text-[52px] lg:text-[68px] font-black text-[#C4614A] leading-tight mb-3">
            Discover Your Glow
          </h1>
          <p className="text-[#7A4A3A] text-[15px] max-w-md leading-relaxed">
            Explore our full collection of luxury makeup — curated shades, clean
            formulas and cult-favourite icons.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-[#FFF8F5] py-10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex gap-8">
            {/* ── Sidebar (desktop) ── */}
            <aside className="hidden lg:block w-[260px] shrink-0">
              <FiltersPanel />
            </aside>

            {/* ── Product area ── */}
            <div className="flex-1 min-w-0">
              {/* Sort + view bar */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <SheetTrigger
                      className="lg:hidden"
                      render={
                        <button className="relative flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-[#E8C4B8] text-[#2C1810] text-[13px] font-semibold hover:border-[#C4614A] hover:text-[#C4614A] transition-colors" />
                      }
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      Filters
                      {activeFilterCount > 0 && (
                        <span className="ml-0.5 w-5 h-5 rounded-full bg-[#C4614A] text-white text-[11px] font-bold flex items-center justify-center">
                          {activeFilterCount}
                        </span>
                      )}
                    </SheetTrigger>
                    <SheetContent side="left" className="bg-[#FFF8F5] w-[300px] p-6 overflow-y-auto border-r border-[#E8C4B8]">
                      <h2 className="text-[16px] font-black text-[#2C1810] uppercase tracking-wide mb-6">
                        Filters
                      </h2>
                      <FiltersPanel />
                    </SheetContent>
                  </Sheet>
                  <p className="text-[14px] text-[#7A4A3A]">
                    Showing{" "}
                    <span className="font-bold text-[#2C1810]">{filtered.length}</span>{" "}
                    product{filtered.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-[#7A4A3A]">Sort by</span>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                        className="appearance-none bg-white border-2 border-[#E8C4B8] rounded-xl pl-4 pr-8 py-2 text-[13px] text-[#2C1810] focus:outline-none focus:border-[#C4614A] cursor-pointer transition-colors"
                      >
                        {SORT_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#7A4A3A] rotate-90 pointer-events-none" />
                    </div>
                  </div>

                  {/* View toggle */}
                  <div className="flex items-center border-2 border-[#E8C4B8] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setView("grid")}
                      className={`p-2 transition-colors ${
                        view === "grid"
                          ? "bg-[#C4614A] text-white"
                          : "text-[#7A4A3A] hover:bg-[#F2D4C8]"
                      }`}
                      aria-label="Grid view"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setView("list")}
                      className={`p-2 transition-colors ${
                        view === "list"
                          ? "bg-[#C4614A] text-white"
                          : "text-[#7A4A3A] hover:bg-[#F2D4C8]"
                      }`}
                      aria-label="List view"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products */}
              {paginated.length > 0 ? (
                view === "grid" ? (
                  <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    <AnimatePresence mode="popLayout">
                      {paginated.map((product, i) => (
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
                  <div className="flex flex-col gap-4">
                    {paginated.map((product) => (
                      <ShopProductListRow
                        key={product.id}
                        product={product}
                        onQuickView={setQuickViewProduct}
                      />
                    ))}
                  </div>
                )
              ) : (
                <div className="py-24 text-center">
                  <p className="text-[#7A4A3A] text-lg mb-3">No products match your filters.</p>
                  <button
                    onClick={clearAll}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C4614A] text-white text-[13px] font-semibold hover:bg-[#A84E39] transition-colors"
                  >
                    <X className="h-4 w-4" /> Clear Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-10 h-10 rounded-full border-2 border-[#E8C4B8] flex items-center justify-center text-[#7A4A3A] hover:border-[#C4614A] hover:text-[#C4614A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-10 h-10 rounded-full text-[14px] font-semibold border-2 transition-colors ${
                        page === n
                          ? "bg-[#C4614A] border-[#C4614A] text-white"
                          : "border-[#E8C4B8] text-[#2C1810] hover:border-[#C4614A] hover:text-[#C4614A]"
                      }`}
                    >
                      {n}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-10 h-10 rounded-full border-2 border-[#E8C4B8] flex items-center justify-center text-[#7A4A3A] hover:border-[#C4614A] hover:text-[#C4614A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
