"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, Search, Menu, User, LogOut } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileStore } from "@/store/profileStore";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SignInModal from "@/components/auth/SignInModal";
import Wordmark from "@/components/layout/Wordmark";
import UserAvatar from "@/components/shared/UserAvatar";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Shade Match", href: "/shade-match" },
  { label: "Routines", href: "/routines" },
  { label: "Looks", href: "/looks" },
];

function CountBadge({ count }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-[#C4614A] text-white text-[9px] font-bold flex items-center justify-center"
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredHref, setHoveredHref] = useState(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { user, logOut } = useAuth();
  const getProfile = useProfileStore((s) => s.getProfile);
  const avatarSrc = user ? getProfile(user.uid).avatarDataUrl || user.photoURL : null;
  const initial = (user?.displayName || user?.email || "?").charAt(0).toUpperCase();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function isActive(href) {
    const [hrefPath, hrefQuery] = href.split("?");
    if (pathname !== hrefPath) return false;

    if (!hrefQuery) return searchParams.toString() === "";

    const hrefParams = new URLSearchParams(hrefQuery);
    return [...hrefParams.entries()].every(([key, value]) => searchParams.get(key) === value);
  }

  async function handleMobileSignOut() {
    try {
      await logOut();
      setMobileOpen(false);
      toast.success("Signed out — see you soon!");
      router.push("/");
    } catch {
      toast.error("Couldn't sign out. Please try again.");
    }
  }

  return (
    <>
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 w-full border-b transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled
          ? "border-[#E8C4B8] bg-[#FFF8F5]/95 shadow-[0_8px_30px_-12px_rgba(44,24,16,0.18)] backdrop-blur-md"
          : "border-[#E8C4B8]/60 bg-[#FFF8F5]/80 backdrop-blur-sm"
      }`}
    >
      <div
        className={`container mx-auto flex items-stretch justify-between px-6 lg:px-8 transition-[height] duration-300 ${
          scrolled ? "h-14" : "h-16"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="group shrink-0 flex items-center">
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 14 }}
            className="inline-block"
          >
            <Wordmark />
          </motion.span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-stretch">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            const hovered = hoveredHref === link.href;
            return (
              <div key={link.href} className="relative h-full flex items-center">
                <Link
                  href={link.href}
                  onMouseEnter={() => setHoveredHref(link.href)}
                  onMouseLeave={() => setHoveredHref(null)}
                  className="relative mx-0.5 px-4 py-2 text-[13px] font-medium rounded-full"
                >
                  <AnimatePresence>
                    {hovered && !active && (
                      <motion.span
                        layoutId="navHoverPill"
                        className="absolute inset-0 bg-[#F2D4C8] rounded-full"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{
                          layout: { type: "spring", stiffness: 380, damping: 32 },
                          opacity: { duration: 0.15 },
                          scale: { duration: 0.15 },
                        }}
                      />
                    )}
                  </AnimatePresence>
                  <motion.span
                    animate={{ y: hovered ? -1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`relative z-10 inline-block transition-colors duration-200 ${
                      active || hovered ? "text-[#C4614A]" : "text-[#2C1810]"
                    }`}
                  >
                    {link.label}
                  </motion.span>
                </Link>
                {active && (
                  <motion.span
                    layoutId="navActiveUnderline"
                    className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#C4614A] rounded-t-full"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <Link
            href="/search"
            className="p-2.5 rounded-full text-[#2C1810] hover:text-[#C4614A] hover:bg-[#F2D4C8] transition-all duration-200 hover:scale-110 active:scale-90"
            aria-label="Search"
          >
            <Search className="h-[18px] w-[18px]" />
          </Link>

          <Link
            href="/wishlist"
            className="relative p-2.5 rounded-full text-[#2C1810] hover:text-[#C4614A] hover:bg-[#F2D4C8] transition-all duration-200 hover:scale-110 active:scale-90"
            aria-label="Wishlist"
          >
            <Heart className="h-[18px] w-[18px]" />
            <CountBadge count={wishlistCount} />
          </Link>

          <Link
            href="/cart"
            className="relative p-2.5 rounded-full text-[#2C1810] hover:text-[#C4614A] hover:bg-[#F2D4C8] transition-all duration-200 hover:scale-110 active:scale-90"
            aria-label="Cart"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            <CountBadge count={cartCount} />
          </Link>

          {user ? (
            <Link
              href="/profile"
              className="ml-1 w-9 h-9 rounded-full bg-[#C4897A] text-white flex items-center justify-center hover:bg-[#A86050] transition-all duration-200 hover:scale-110 active:scale-90 overflow-hidden text-[13px] font-bold"
              aria-label="Profile"
            >
              <UserAvatar src={avatarSrc} alt={user.displayName || "Profile"} initial={initial} />
            </Link>
          ) : (
            <button
              onClick={() => setSignInOpen(true)}
              className="ml-1 w-9 h-9 rounded-full bg-[#C4897A] text-white flex items-center justify-center hover:bg-[#A86050] transition-all duration-200 hover:scale-110 active:scale-90"
              aria-label="Sign in"
            >
              <User className="h-4 w-4" />
            </button>
          )}

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="lg:hidden ml-1"
              render={
                <Button variant="ghost" size="icon" className="text-[#2C1810]" />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#FFF8F5] w-72 border-r border-[#E8C4B8]">
              <div className="mb-8 mt-2">
                <Wordmark size="text-[22px]" />
              </div>
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-base font-medium py-2.5 px-3 rounded-lg transition-colors ${
                      isActive(link.href)
                        ? "bg-[#F2D4C8] text-[#C4614A]"
                        : "text-[#2C1810] hover:bg-[#F2D4C8] hover:text-[#C4614A]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {user ? (
                  <div className="mt-6 flex flex-col gap-2">
                    <Link href="/profile" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full bg-[#C4614A] hover:bg-[#A84E39] text-white rounded-full">
                        My Account
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={handleMobileSignOut}
                      className="w-full rounded-full text-[#7A4A3A]"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => { setMobileOpen(false); setSignInOpen(true); }}
                    className="w-full bg-[#C4614A] hover:bg-[#A84E39] text-white rounded-full mt-6"
                  >
                    Sign In
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>

    <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </>
  );
}
