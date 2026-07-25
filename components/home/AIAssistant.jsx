import Link from "next/link";
import { Sparkles, MessageCircle } from "lucide-react";

const PLUS_POSITIONS = [
  { top: "12%", left: "8%", size: 18, opacity: 0.35 },
  { top: "55%", left: "4%", size: 14, opacity: 0.25 },
  { top: "28%", left: "18%", size: 10, opacity: 0.2 },
  { top: "72%", left: "14%", size: 16, opacity: 0.3 },
  { top: "15%", right: "10%", size: 14, opacity: 0.3 },
  { top: "42%", right: "5%", size: 18, opacity: 0.35 },
  { top: "68%", right: "12%", size: 12, opacity: 0.2 },
  { top: "82%", left: "45%", size: 10, opacity: 0.25 },
  { top: "8%", left: "50%", size: 12, opacity: 0.2 },
];

function PlusIcon({ top, left, right, size, opacity }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{ top, left, right, opacity }}
    >
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path d="M8 1V15M1 8H15" stroke="#E8A598" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function AIAssistant() {
  return (
    <section className="bg-[#FFF8F5] py-10 lg:py-14">
      <div className="container mx-auto px-6 lg:px-8">
        <div
          className="relative rounded-3xl overflow-hidden py-20 px-8 text-center"
          style={{ background: "linear-gradient(160deg, #2C1810, #3D2018, #2C1810)" }}
        >
          {/* Decorative + symbols */}
          {PLUS_POSITIONS.map((pos, i) => (
            <PlusIcon key={i} {...pos} />
          ))}

          {/* Subtle radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, rgba(196,97,74,0.12), transparent 65%)",
            }}
          />

          <div className="relative z-10 max-w-xl mx-auto">
            {/* App icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 shadow-lg"
              style={{ background: "linear-gradient(135deg, #C4614A, #E8A598, #D4697A)" }}>
              <Sparkles className="h-7 w-7 text-white" />
            </div>

            {/* Heading */}
            <h2 className="text-[40px] lg:text-[52px] font-black text-white leading-tight mb-5">
              Meet Your AI Beauty
              <br />
              Assistant
            </h2>

            {/* Description */}
            <p className="text-[15px] text-[#C4897A] leading-relaxed mb-10 max-w-md mx-auto">
              Personalized product recommendations, powered by AI. Tell us your
              skin type, concerns and preferences — we'll build a routine that's
              unmistakably you.
            </p>

            {/* CTA */}
            <Link
              href="/ai-recommendations"
              className="inline-flex items-center gap-2.5 bg-[#C4614A] hover:bg-[#A84E39] text-white px-8 py-4 rounded-full font-semibold text-[15px] transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              Chat with AI Assistant
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
