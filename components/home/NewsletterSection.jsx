"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section className="bg-[#FFF8F5] py-16 lg:py-24">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="relative bg-[#F2D4C8] rounded-3xl px-8 py-14 lg:px-16 lg:py-20 overflow-hidden text-center">
          {/* Decorative circles */}
          <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-[#E8A598]/30" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-[#C4614A]/10" />

          {/* Content */}
          <div className="relative z-10 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-[11px] font-bold tracking-widest text-[#C4614A] uppercase mb-6">
              <Sparkles className="h-3 w-3" />
              Join the Glow Club
            </div>

            <h2 className="text-3xl lg:text-4xl font-black text-[#2C1810] mb-4 leading-tight">
              Get 10% Off Your
              <br />
              First Order
            </h2>
            <p className="text-[#7A4A3A] text-[15px] mb-8 leading-relaxed">
              Sign up for exclusive deals, new launches, and personalised
              beauty tips delivered straight to your inbox.
            </p>

            {submitted ? (
              <div className="inline-flex items-center gap-2 bg-[#C4614A] text-white px-8 py-4 rounded-full font-semibold">
                <Sparkles className="h-4 w-4" /> Welcome to the Glow Club!
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-5 py-3.5 rounded-full border-2 border-[#E8C4B8] bg-white text-[#2C1810] placeholder:text-[#C4897A] focus:outline-none focus:border-[#C4614A] text-sm"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-[#C4614A] hover:bg-[#A84E39] text-white px-7 py-3.5 rounded-full font-semibold text-sm transition-colors whitespace-nowrap"
                >
                  Subscribe <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            <p className="text-[12px] text-[#7A4A3A] mt-4">
              No spam, unsubscribe anytime. 🌸
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
