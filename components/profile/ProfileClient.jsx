"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User as UserIcon,
  Package,
  Heart,
  Wand2,
  Sparkles,
  Lock,
  LogOut,
  Loader2,
  Camera,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Pencil,
  Check,
  X,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useProfileStore } from "@/store/profileStore";
import { useRoutinesStore } from "@/store/routinesStore";
import ToggleSwitch from "@/components/profile/ToggleSwitch";
import ProductImage from "@/components/shop/ProductImage";
import UserAvatar from "@/components/shared/UserAvatar";

const SIDEBAR_ITEMS = [
  { id: "info", label: "My Information", icon: UserIcon },
  { id: "orders", label: "Order History", icon: Package },
  { id: "wishlist", label: "My Wishlist", icon: Heart },
  { id: "routines", label: "My Routines", icon: Wand2 },
  { id: "beauty", label: "Beauty Profile", icon: Sparkles },
  { id: "security", label: "Security", icon: Lock },
];

function formatMemberSince(creationTime) {
  if (!creationTime) return "Recently";
  return new Date(creationTime).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function EmptyState({ icon: Icon, title, text, ctaLabel, ctaHref }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#EDD8CC]"
    >
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
        className="w-20 h-20 rounded-full bg-[#F2D4C8] flex items-center justify-center mb-4"
      >
        <Icon className="h-9 w-9 text-[#C4A090]" />
      </motion.div>
      <h3 className="text-[18px] font-black text-[#2C1810] mb-2">{title}</h3>
      <p className="text-[#7A4A3A] text-[14px] mb-6 max-w-xs">{text}</p>
      {ctaLabel && (
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C4614A] text-white font-semibold text-[14px] hover:bg-[#A84E39] transition-colors"
        >
          {ctaLabel}
        </Link>
      )}
    </motion.div>
  );
}

function InfoField({ icon: Icon, label, value, editing, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <div className="text-[11px] font-black tracking-[0.15em] text-[#C4A090] uppercase mb-1.5">{label}</div>
      {editing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-[42px] px-3 rounded-lg border border-[#E8C4B8] bg-[#FFF8F5] text-[#2C1810] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#C4614A]/20 transition-shadow"
        />
      ) : (
        <div className="flex items-center gap-2 text-[#2C1810] text-[15px]">
          <Icon className="h-3.5 w-3.5 text-[#C4614A] shrink-0" />
          <span className={value ? "" : "text-[#C4A090] italic"}>{value || "Not set"}</span>
        </div>
      )}
    </div>
  );
}

export default function ProfileClient({ repairImagesByName = {} }) {
  const router = useRouter();
  const { user, loading, logOut, updateDisplayName, changePassword } = useAuth();
  const [section, setSection] = useState("info");
  const [signingOut, setSigningOut] = useState(false);
  const fileInputRef = useRef(null);

  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const wishlistItems = useWishlistStore((s) => s.items);
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);
  const savedRoutines = useRoutinesStore((s) => s.routines);
  const removeRoutine = useRoutinesStore((s) => s.removeRoutine);

  const getProfile = useProfileStore((s) => s.getProfile);
  const updateProfileData = useProfileStore((s) => s.updateProfile);
  const updatePreference = useProfileStore((s) => s.updatePreference);
  const profile = user ? getProfile(user.uid) : null;

  const [editingInfo, setEditingInfo] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", birthday: "", location: "" });
  const [savingInfo, setSavingInfo] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/auth/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || !profile) return;
    const [fallbackFirst, ...rest] = (user.displayName || "").split(" ");
    setForm({
      firstName: profile.firstName || fallbackFirst || "",
      lastName: profile.lastName || rest.join(" ") || "",
      phone: profile.phone || "",
      birthday: profile.birthday || "",
      location: profile.location || "",
    });
  }, [user, profile?.firstName, profile?.lastName, profile?.phone, profile?.birthday, profile?.location]);

  if (loading || !user || !profile) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#FFF8F5]">
        <Loader2 className="h-6 w-6 text-[#C4614A] animate-spin" />
      </div>
    );
  }

  const isPasswordAccount = user.providerData?.[0]?.providerId === "password";
  const initial = (user.displayName || user.email || "?").charAt(0).toUpperCase();
  const avatarSrc = profile.avatarDataUrl || user.photoURL;

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await logOut();
      toast.success("Signed out — see you soon!");
      router.push("/");
    } catch {
      toast.error("Couldn't sign out. Please try again.");
      setSigningOut(false);
    }
  }

  function handleAvatarPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Please choose an image under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateProfileData(user.uid, { avatarDataUrl: reader.result });
      toast.success("Photo updated!");
    };
    reader.readAsDataURL(file);
  }

  async function handleSaveInfo(e) {
    e.preventDefault();
    setSavingInfo(true);
    try {
      updateProfileData(user.uid, form);
      const fullName = `${form.firstName} ${form.lastName}`.trim();
      if (fullName && fullName !== user.displayName) {
        await updateDisplayName(fullName);
      }
      toast.success("Information updated!");
      setEditingInfo(false);
    } catch {
      toast.error("Couldn't save your info. Please try again.");
    } finally {
      setSavingInfo(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("New password should be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password updated!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const code = error?.code;
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        toast.error("Current password is incorrect.");
      } else {
        toast.error("Couldn't update password. Please try again.");
      }
    } finally {
      setChangingPassword(false);
    }
  }

  const shadeProfile = profile?.shadeProfile || null;

  const stats = [
    { label: "In Your Bag", value: cartCount, emoji: "🛍️" },
    { label: "Wishlist Items", value: wishlistItems.length, emoji: "❤️" },
    { label: "Routines", value: savedRoutines.length, emoji: "💄" },
    { label: "Beauty Profile", value: shadeProfile ? shadeProfile.toneLabel : null, emoji: "✨" },
  ];

  return (
    <div className="bg-[#FFF8F5] min-h-screen">
      {/* Hero */}
      <section
        className="relative overflow-hidden px-6 pt-14 pb-10"
        style={{ background: "linear-gradient(180deg,#EDD8C8 0%,#FFF8F5 100%)" }}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 w-96 h-96 rounded-full blur-3xl opacity-25"
          style={{ background: "radial-gradient(circle, #C4614A, transparent 70%)" }}
          animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="max-w-[1100px] mx-auto relative">
          <div className="flex items-center gap-6 mb-10">
            <div className="relative shrink-0">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                className="relative w-[88px] h-[88px] rounded-full overflow-hidden flex items-center justify-center text-white font-black text-[32px] shadow-lg ring-4 ring-white"
                style={{ background: "linear-gradient(135deg, #C4614A, #E8A598, #D4697A)" }}
              >
                <UserAvatar src={avatarSrc} alt={user.displayName || "Profile"} initial={initial} />
              </motion.div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white text-[#C4614A] border border-[#E8C4B8] flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                aria-label="Change photo"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarPick} className="hidden" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-[30px] lg:text-[36px] font-black text-[#2C1810] leading-tight" style={{ fontFamily: "Georgia, serif" }}>
                {user.displayName || "Welcome"}
              </h1>
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-[13px] text-[#7A4A3A] mt-1">
                <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{user.email}</span>
                <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Member since {formatMemberSince(user.metadata?.creationTime)}</span>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl p-5 bg-white border border-[#EDD8CC]"
              >
                <div className="text-[20px] mb-2">{stat.emoji}</div>
                {stat.value !== null ? (
                  <div className="text-[24px] font-black text-[#2C1810]">{stat.value}</div>
                ) : (
                  <button
                    onClick={() => setSection("beauty")}
                    className="text-[14px] font-bold text-[#C4614A] underline decoration-[#C4614A]/40 underline-offset-2"
                  >
                    Take the quiz
                  </button>
                )}
                <div className="text-[12px] text-[#7A4A3A]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-[1100px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start">
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl border border-[#EDD8CC] p-3 lg:sticky lg:top-20"
        >
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`relative shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl text-[14px] font-semibold text-left transition-colors ${
                    active ? "text-white" : "text-[#7A4A3A] hover:bg-[#FFF8F5] hover:text-[#2C1810]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="profileSidebarPill"
                      className="absolute inset-0 rounded-xl bg-[#C4614A]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon className="h-4 w-4 relative z-10 shrink-0" />
                  <span className="relative z-10 whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="h-px bg-[#F2D4C8] my-2 hidden lg:block" />
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="hidden lg:flex w-full items-center gap-2.5 px-4 py-3 rounded-xl text-[14px] font-semibold text-[#C4614A] hover:bg-[#FFF8F5] transition-colors disabled:opacity-60"
          >
            {signingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            Sign Out
          </button>
        </motion.aside>

        {/* Content */}
        <div>
          <AnimatePresence mode="wait">
            {section === "info" && (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-[26px] font-black text-[#2C1810] mb-5" style={{ fontFamily: "Georgia, serif" }}>
                  My Information
                </h2>

                <form onSubmit={handleSaveInfo} className="bg-white rounded-2xl border border-[#EDD8CC] p-6 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[17px] font-bold text-[#2C1810]">Personal Information</h3>
                    {editingInfo ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingInfo(false)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E8C4B8] text-[#7A4A3A] text-[13px] font-semibold hover:border-[#C4614A] hover:text-[#C4614A] transition-colors"
                        >
                          <X className="h-3.5 w-3.5" /> Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={savingInfo}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#C4614A] hover:bg-[#A84E39] text-white text-[13px] font-semibold transition-colors disabled:opacity-60"
                        >
                          {savingInfo ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Save
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditingInfo(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F2D4C8] hover:bg-[#E8C4B8] text-[#2C1810] text-[13px] font-semibold transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                    <InfoField icon={UserIcon} label="First Name" value={form.firstName} editing={editingInfo}
                      onChange={(v) => setForm((f) => ({ ...f, firstName: v }))} placeholder="First name" />
                    <InfoField icon={UserIcon} label="Last Name" value={form.lastName} editing={editingInfo}
                      onChange={(v) => setForm((f) => ({ ...f, lastName: v }))} placeholder="Last name" />
                    <InfoField icon={Mail} label="Email" value={user.email} editing={false} onChange={() => {}} />
                    <InfoField icon={Phone} label="Phone" value={form.phone} editing={editingInfo} type="tel"
                      onChange={(v) => setForm((f) => ({ ...f, phone: v }))} placeholder="+1 555 123 4567" />
                    <InfoField icon={Calendar} label="Birthday" value={form.birthday} editing={editingInfo} type="date"
                      onChange={(v) => setForm((f) => ({ ...f, birthday: v }))} />
                    <InfoField icon={MapPin} label="Location" value={form.location} editing={editingInfo}
                      onChange={(v) => setForm((f) => ({ ...f, location: v }))} placeholder="City, Country" />
                  </div>
                </form>

                <div className="bg-white rounded-2xl border border-[#EDD8CC] p-6">
                  <h3 className="text-[17px] font-bold text-[#2C1810] mb-5">Preferences</h3>
                  <div className="flex flex-col divide-y divide-[#F2D4C8]">
                    {[
                      { key: "newsletter", label: "Newsletter subscription", desc: "Drops, restocks & member offers" },
                      { key: "sms", label: "SMS notifications", desc: "Order updates by text message" },
                      { key: "personalizedRecs", label: "Personalized recommendations", desc: "Tailored picks from the AI assistant" },
                      { key: "darkMode", label: "Dark mode", desc: "Coming soon to GlowCart", disabled: true },
                    ].map((pref) => (
                      <div key={pref.key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                        <div>
                          <div className="text-[14px] font-semibold text-[#2C1810]">{pref.label}</div>
                          <div className="text-[12px] text-[#7A4A3A]">{pref.desc}</div>
                        </div>
                        <ToggleSwitch
                          checked={pref.disabled ? false : !!profile.preferences?.[pref.key]}
                          disabled={pref.disabled}
                          onChange={(val) => updatePreference(user.uid, pref.key, val)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {section === "orders" && (
              <motion.div key="orders" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                <h2 className="text-[26px] font-black text-[#2C1810] mb-5" style={{ fontFamily: "Georgia, serif" }}>Order History</h2>
                <EmptyState icon={Package} title="No orders yet" text="Your order history will show up here once you place your first order." ctaLabel="Start Shopping" ctaHref="/shop" />
              </motion.div>
            )}

            {section === "wishlist" && (
              <motion.div key="wishlist" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[26px] font-black text-[#2C1810]" style={{ fontFamily: "Georgia, serif" }}>My Wishlist</h2>
                  {wishlistItems.length > 0 && (
                    <Link href="/wishlist" className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#C4614A] hover:underline">
                      View All <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
                {wishlistItems.length === 0 ? (
                  <EmptyState icon={Heart} title="Your wishlist is empty" text="Save items you love and find them here." ctaLabel="Browse Products" ctaHref="/shop" />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistItems.slice(0, 4).map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.06 }}
                        className="bg-white rounded-2xl border border-[#EDD8CC] p-3 flex items-center gap-3"
                      >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0" style={{ background: product.bg || product.bgColor || "#F2D4C8" }}>
                          <ProductImage src={product.image || repairImagesByName[product.name]} alt={product.name} category={product.category} padding="p-2" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-semibold text-[#2C1810] truncate">{product.name}</div>
                          <div className="text-[13px] font-bold text-[#C4614A]">${parseFloat(product.price).toFixed(2)}</div>
                        </div>
                        <button
                          onClick={() => { removeFromWishlist(product.id); toast.success("Removed from wishlist."); }}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[#C4A090] hover:text-[#C4614A] hover:bg-[#FFF8F5] transition-colors shrink-0"
                          aria-label="Remove"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {section === "routines" && (
              <motion.div key="routines" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[26px] font-black text-[#2C1810]" style={{ fontFamily: "Georgia, serif" }}>My Routines</h2>
                  {savedRoutines.length > 0 && (
                    <Link href="/routines" className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#C4614A] hover:underline">
                      Build Another <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
                {savedRoutines.length === 0 ? (
                  <EmptyState icon={Wand2} title="No saved routines yet" text="Build a personalized skincare or makeup routine and save it here." ctaLabel="Build a Routine" ctaHref="/routines" />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedRoutines.map((routine, i) => (
                      <motion.div
                        key={routine.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.06 }}
                        className="bg-white rounded-2xl border border-[#EDD8CC] p-4 flex items-center gap-3"
                      >
                        <div className="w-11 h-11 rounded-xl bg-[#F2D4C8] flex items-center justify-center shrink-0">
                          <Wand2 className="h-5 w-5 text-[#C4614A]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] font-semibold text-[#2C1810] truncate">{routine.name}</div>
                          <div className="text-[12px] text-[#7A4A3A]">
                            {routine.count} products · <span className="font-bold text-[#C4614A]">${routine.total}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => { removeRoutine(routine.id); toast.success("Routine deleted."); }}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[#C4A090] hover:text-[#C4614A] hover:bg-[#FFF8F5] transition-colors shrink-0"
                          aria-label="Delete routine"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {section === "beauty" && (
              <motion.div key="beauty" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                <h2 className="text-[26px] font-black text-[#2C1810] mb-5" style={{ fontFamily: "Georgia, serif" }}>Beauty Profile</h2>
                {shadeProfile ? (
                  <div className="bg-white rounded-2xl border border-[#EDD8CC] p-6">
                    <div className="flex items-center gap-4 mb-5">
                      <div
                        className="w-14 h-14 rounded-full border-2 border-white shadow-md shrink-0"
                        style={{ backgroundColor: shadeProfile.toneColor }}
                      />
                      <div>
                        <div className="text-[11px] font-black tracking-[0.2em] text-[#C4614A] uppercase mb-0.5">
                          Your Shade Profile
                        </div>
                        <h3 className="text-[20px] font-black text-[#2C1810]">
                          {shadeProfile.toneLabel} · {shadeProfile.typeLabel} Skin
                        </h3>
                      </div>
                    </div>

                    {shadeProfile.concernLabels?.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {shadeProfile.concernLabels.map((label) => (
                          <span key={label} className="text-[12px] font-semibold text-[#7A4A3A] bg-[#F2D4C8] px-3 py-1 rounded-full">
                            {label}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[13px] text-[#C4A090] mb-6">No specific skin concerns noted.</p>
                    )}

                    <Link
                      href="/shade-match"
                      className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#C4614A] hover:underline"
                    >
                      Retake the quiz
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ) : (
                  <EmptyState icon={Sparkles} title="Find your perfect shade" text="Take our quick Shade Match quiz to build your beauty profile and get personalized recommendations." ctaLabel="Try Shade Match" ctaHref="/shade-match" />
                )}
              </motion.div>
            )}

            {section === "security" && (
              <motion.div key="security" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="max-w-md">
                <h2 className="text-[26px] font-black text-[#2C1810] mb-5" style={{ fontFamily: "Georgia, serif" }}>Security</h2>

                {isPasswordAccount ? (
                  <form onSubmit={handleChangePassword} className="bg-white rounded-2xl border border-[#EDD8CC] p-6 flex flex-col gap-4">
                    <h3 className="text-[15px] font-bold text-[#2C1810] flex items-center gap-2 mb-1">
                      <Lock className="h-4 w-4 text-[#C4614A]" /> Change Password
                    </h3>
                    <input
                      type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current password"
                      className="w-full h-[46px] px-4 rounded-xl border border-[#E8C4B8] bg-[#FFF8F5] text-[#2C1810] placeholder:text-[#C4A090] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#C4614A]/20 transition-shadow"
                    />
                    <input
                      type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password (min. 6 characters)"
                      className="w-full h-[46px] px-4 rounded-xl border border-[#E8C4B8] bg-[#FFF8F5] text-[#2C1810] placeholder:text-[#C4A090] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#C4614A]/20 transition-shadow"
                    />
                    <input
                      type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full h-[46px] px-4 rounded-xl border border-[#E8C4B8] bg-[#FFF8F5] text-[#2C1810] placeholder:text-[#C4A090] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#C4614A]/20 transition-shadow"
                    />
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={changingPassword}
                      className="w-full py-3.5 rounded-xl bg-[#2C1810] hover:bg-black text-white font-semibold text-[14px] flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                    >
                      {changingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Password"}
                    </motion.button>
                  </form>
                ) : (
                  <div className="bg-white rounded-2xl border border-[#EDD8CC] p-6">
                    <h3 className="text-[15px] font-bold text-[#2C1810] mb-1">Signed in with Google</h3>
                    <p className="text-[13px] text-[#7A4A3A]">Your password is managed by your Google account.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile sign out */}
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="lg:hidden mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#E8C4B8] text-[#C4614A] text-[14px] font-semibold disabled:opacity-60"
          >
            {signingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
