"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getAuthErrorMessage } from "@/lib/authErrors";
import AuthShell from "@/components/auth/AuthShell";
import GoogleIcon from "@/components/auth/GoogleIcon";

export default function LoginClient() {
  const router = useRouter();
  const { signIn, signInWithGoogle, resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Welcome back!");
      router.push("/profile");
    } catch (error) {
      const message = getAuthErrorMessage(error);
      if (message) toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Welcome back!");
      router.push("/profile");
    } catch (error) {
      const message = getAuthErrorMessage(error);
      if (message) toast.error(message);
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    setResetLoading(true);
    try {
      await resetPassword(email);
      toast.success("Password reset email sent — check your inbox.");
      setForgotMode(false);
    } catch (error) {
      const message = getAuthErrorMessage(error);
      if (message) toast.error(message);
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to GlowCart"
      subtitle="Pick up right where you glowed off."
    >
      <AnimatePresence mode="wait">
        {forgotMode ? (
          <motion.form
            key="forgot"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleReset}
            className="flex flex-col gap-4"
          >
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4A090]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full h-[52px] pl-11 pr-4 rounded-2xl border border-[#E8C4B8] bg-white text-[#2C1810] placeholder:text-[#C4A090] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#C4614A]/20 transition-shadow"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={resetLoading}
              className="w-full py-4 rounded-2xl bg-[#2C1810] hover:bg-black text-white font-semibold text-[14px] flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {resetLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
            </motion.button>
            <button
              type="button"
              onClick={() => setForgotMode(false)}
              className="text-[13px] text-[#7A4A3A] hover:text-[#C4614A] transition-colors"
            >
              ← Back to sign in
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.25 }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4A090]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full h-[52px] pl-11 pr-4 rounded-2xl border border-[#E8C4B8] bg-white text-[#2C1810] placeholder:text-[#C4A090] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#C4614A]/20 transition-shadow"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4A090]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-[52px] pl-11 pr-11 rounded-2xl border border-[#E8C4B8] bg-white text-[#2C1810] placeholder:text-[#C4A090] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#C4614A]/20 transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C4A090] hover:text-[#C4614A] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setForgotMode(true)}
                className="self-end text-[12px] text-[#C4614A] hover:underline -mt-1"
              >
                Forgot password?
              </button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="group relative w-full py-4 rounded-2xl bg-[#C4614A] hover:bg-[#A84E39] text-white font-semibold text-[14px] flex items-center justify-center gap-2 transition-colors overflow-hidden disabled:opacity-60"
              >
                <span className="absolute inset-y-0 w-1/3 -skew-x-[20deg] bg-white/20 -translate-x-[200%] group-hover:translate-x-[380%] transition-transform duration-700 ease-out" />
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="h-px flex-1 bg-[#E8C4B8]" />
              <span className="text-[11px] text-[#C4A090] uppercase tracking-wider">or</span>
              <div className="h-px flex-1 bg-[#E8C4B8]" />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full py-3.5 rounded-2xl border border-[#E8C4B8] bg-white hover:bg-[#FFF8F5] text-[#2C1810] font-semibold text-[14px] flex items-center justify-center gap-3 transition-colors disabled:opacity-60"
            >
              {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
              Continue with Google
            </motion.button>

            <p className="text-center text-[13px] text-[#7A4A3A] mt-8">
              New to GlowCart?{" "}
              <Link href="/auth/signup" className="text-[#C4614A] font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
