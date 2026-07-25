"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  animate,
} from "framer-motion";
import { ShoppingBag, ArrowRight, Check, Sparkles, Heart, Droplet, Star } from "lucide-react";

const trustBadges = ["Free Shipping", "100% Cruelty Free", "30-Day Returns"];
const GLOW_WORDS = ["Glow", "Confidence", "Radiance", "Beauty"];

const SPARKLES = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  left: 8 + ((i * 37) % 90),
  top: 6 + ((i * 53) % 88),
  size: 4 + (i % 3) * 3,
  delay: (i * 0.6) % 3,
  duration: 2.4 + (i % 4) * 0.6,
}));

const MICRO_CHIPS = [
  { id: "heart", Icon: Heart, style: "top-[6%] left-[0%]", depth: 26, delay: 0.9, duration: 3.4, tone: "#C4614A" },
  { id: "droplet", Icon: Droplet, style: "bottom-[20%] left-[-4%]", depth: -20, delay: 1.2, duration: 3.9, tone: "#A86050" },
  { id: "star", Icon: Star, style: "top-[42%] right-[-2%]", depth: 18, delay: 1.5, duration: 4.1, tone: "#C4614A" },
];

const GRAIN_URL = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`
)}")`;

function CountUp({ to = 2, suffix = "M+" }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, to, {
      duration: 1.6,
      delay: 0.6,
      ease: "easeOut",
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [to]);

  return (
    <span ref={ref}>
      {value.toFixed(1).replace(/\.0$/, "")}
      {suffix}
    </span>
  );
}

function SplitWords({ text, delay = 0, className = "" }) {
  const words = text.split(" ");
  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.09, delayChildren: delay } } }}
      className={className}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block mr-[0.28em]"
        >
          {w}
        </motion.span>
      ))}
    </motion.span>
  );
}

function Magnetic({ children, className = "", strength = 0.35 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 14, mass: 0.25 });
  const springY = useSpring(y, { stiffness: 200, damping: 14, mass: 0.25 });

  function handleMove(e) {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

function TiltPortrait({ src, parallaxX, parallaxY }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 18 });
  const shineX = useTransform(x, [-0.5, 0.5], ["20%", "80%"]);

  function handleMouseMove(e) {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, x: parallaxX, y: parallaxY, transformPerspective: 900 }}
      className="relative w-[300px] h-[380px] lg:w-[340px] lg:h-[430px]"
    >
      <div
        className="relative w-full h-full overflow-hidden shadow-2xl"
        style={{ borderRadius: "48% 52% 58% 42% / 55% 45% 55% 45%" }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="Glowing skin, makeup portrait" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#C4896A]" />
        )}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.35) 45%, transparent 60%)",
            backgroundPositionX: shineX,
          }}
        />
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 60px rgba(44,24,16,0.15)" }} />
      </div>
    </motion.div>
  );
}

export default function HeroSection({ portrait, accent }) {
  const [wordIndex, setWordIndex] = useState(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const spotlightX = useTransform(springX, [-0.5, 0.5], ["15%", "85%"]);
  const spotlightY = useTransform(springY, [-0.5, 0.5], ["10%", "90%"]);
  const spotlightBackground = useMotionTemplate`radial-gradient(560px circle at ${spotlightX} ${spotlightY}, rgba(196,97,74,0.14), transparent 70%)`;

  const blob1X = useTransform(springX, [-0.5, 0.5], [-26, 26]);
  const blob1Y = useTransform(springY, [-0.5, 0.5], [-16, 16]);
  const blob2X = useTransform(springX, [-0.5, 0.5], [22, -22]);
  const blob2Y = useTransform(springY, [-0.5, 0.5], [18, -18]);

  const portraitX = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const portraitY = useTransform(springY, [-0.5, 0.5], [-6, 6]);
  const badgeX = useTransform(springX, [-0.5, 0.5], [8, -8]);
  const cardX = useTransform(springX, [-0.5, 0.5], [-10, 10]);

  // Fixed-length (MICRO_CHIPS.length === 3): safe to call per-index at top level.
  const chipX0 = useTransform(springX, [-0.5, 0.5], [-MICRO_CHIPS[0].depth, MICRO_CHIPS[0].depth]);
  const chipX1 = useTransform(springX, [-0.5, 0.5], [-MICRO_CHIPS[1].depth, MICRO_CHIPS[1].depth]);
  const chipX2 = useTransform(springX, [-0.5, 0.5], [-MICRO_CHIPS[2].depth, MICRO_CHIPS[2].depth]);
  const chipParallaxX = [chipX0, chipX1, chipX2];

  useEffect(() => {
    const id = setInterval(() => setWordIndex((i) => (i + 1) % GLOW_WORDS.length), 2200);
    return () => clearInterval(id);
  }, []);

  function handleSectionMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleSectionMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section
      onMouseMove={handleSectionMouseMove}
      onMouseLeave={handleSectionMouseLeave}
      className="relative bg-[#FFF8F5] overflow-hidden"
    >
      {/* Cursor-reactive spotlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[6]"
        style={{ background: spotlightBackground }}
      />

      {/* Film grain texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: GRAIN_URL, backgroundSize: "180px 180px" }}
      />

      {/* Animated gradient blobs (parallax depth) */}
      <motion.div aria-hidden className="absolute -top-24 -left-24 w-[420px] h-[420px]" style={{ x: blob1X, y: blob1Y }}>
        <motion.div
          className="w-full h-full rounded-full blur-3xl opacity-40"
          style={{ background: "radial-gradient(circle, #F2D4C8, transparent 70%)" }}
          animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <motion.div aria-hidden className="absolute top-1/3 -right-32 w-[480px] h-[480px]" style={{ x: blob2X, y: blob2Y }}>
        <motion.div
          className="w-full h-full rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, #C4614A, transparent 70%)" }}
          animate={{ x: [0, -30, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </motion.div>

      {/* Sparkles */}
      {SPARKLES.map((s) => (
        <motion.span
          key={s.id}
          aria-hidden
          className="absolute z-10 text-[#C4614A]"
          style={{ left: `${s.left}%`, top: `${s.top}%`, fontSize: s.size + 6 }}
          animate={{ opacity: [0, 1, 0], scale: [0.6, 1, 0.6], y: [0, -14, 0] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        >
          ✦
        </motion.span>
      ))}

      <div className="container relative z-[7] mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[580px]">

          {/* ── Left ── */}
          <div className="space-y-8 z-10">
            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 text-[#C4614A]"
            >
              <div className="w-8 h-px bg-[#C4614A]" />
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase">New Collection</span>
            </motion.div>

            {/* Heading */}
            <h1 className="text-[52px] lg:text-[64px] xl:text-[72px] font-black leading-[1.02] text-[#2C1810]">
              <SplitWords text="Unleash Your" delay={0.1} />
              <br />
              <SplitWords text="Inner" delay={0.28} className="mr-1" />{" "}
              <span
                className="relative inline-block text-[#C4614A] align-bottom"
                style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontStyle: "italic", minWidth: "280px" }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={GLOW_WORDS[wordIndex]}
                    initial={{ opacity: 0, y: 24, rotateX: 40 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -24, rotateX: -40 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block"
                  >
                    {GLOW_WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <br />
              <SplitWords text="This Summer" delay={0.5} />
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.75 }}
              className="text-[15px] text-[#7A4A3A] leading-relaxed max-w-[440px]"
            >
              Discover makeup that celebrates your unique beauty — from
              bold terracotta lips to sun-kissed, luminous skin. Clean, kind,
              and made to glow.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.85 }}
              className="flex flex-wrap gap-4"
            >
              <Magnetic strength={0.3}>
                <Link href="/shop" className="group relative overflow-hidden inline-flex items-center gap-2.5 bg-[#2C1810] hover:bg-black text-white px-8 py-4 rounded-full font-semibold text-sm transition-colors">
                  <span
                    className="absolute inset-y-0 w-1/3 -skew-x-[20deg] bg-white/20 -translate-x-[200%] group-hover:translate-x-[380%] transition-transform duration-700 ease-out"
                  />
                  <ShoppingBag className="h-4 w-4" />
                  Shop Now
                </Link>
              </Magnetic>
              <Magnetic strength={0.3}>
                <Link href="/looks" className="group inline-flex items-center gap-2 border-2 border-[#C4614A] text-[#C4614A] hover:bg-[#C4614A] hover:text-white px-8 py-4 rounded-full font-semibold text-sm transition-colors">
                  Explore Looks
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Magnetic>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 1.0 } } }}
              className="flex flex-wrap gap-6"
            >
              {trustBadges.map((badge) => (
                <motion.div
                  key={badge}
                  variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                  className="flex items-center gap-2 text-sm text-[#7A4A3A]"
                >
                  <Check className="h-4 w-4 text-[#C4614A] shrink-0" strokeWidth={2.5} />
                  {badge}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── Right ── */}
          <div className="relative h-[500px] flex items-center justify-center lg:justify-end">
            {/* Rotating aura halo */}
            <motion.div
              aria-hidden
              className="absolute right-[6%] top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-2xl opacity-40"
              style={{ background: "conic-gradient(from 0deg, #F2D4C8, #C4614A, #E8A598, #F2D4C8)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />

            {/* Dashed ring, slowly rotating */}
            <motion.div
              aria-hidden
              className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border-[1.5px] border-dashed border-[#C4614A]/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            />

            {/* Rotating circular text ring */}
            <motion.svg
              aria-hidden
              viewBox="0 0 200 200"
              className="absolute right-[-30px] top-1/2 -translate-y-1/2 w-[430px] h-[430px]"
              animate={{ rotate: -360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            >
              <defs>
                <path id="heroCirclePath" d="M 100,100 m -92,0 a 92,92 0 1,1 184,0 a 92,92 0 1,1 -184,0" />
              </defs>
              <text fill="#C4614A" fontSize="7.2" fontWeight="700" letterSpacing="2.5">
                <textPath href="#heroCirclePath" startOffset="0%">
                  ✦ NEW COLLECTION &#160; ✦ SUMMER GLOW &#160; ✦ GLOWCART &#160; ✦ NEW COLLECTION &#160; ✦ SUMMER GLOW &#160; ✦ GLOWCART &#160;
                </textPath>
              </text>
            </motion.svg>

            {/* Portrait */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              <TiltPortrait src={portrait?.url} parallaxX={portraitX} parallaxY={portraitY} />
            </motion.div>

            {/* Micro floating chips */}
            {MICRO_CHIPS.map(({ id, Icon, style, delay, duration, tone }, i) => (
              <motion.div
                key={id}
                aria-hidden
                className={`absolute z-20 hidden sm:block ${style}`}
                style={{ x: chipParallaxX[i] }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                  transition={{
                    opacity: { duration: 0.4, delay },
                    scale: { duration: 0.4, delay, type: "spring", stiffness: 260 },
                    y: { duration, repeat: Infinity, ease: "easeInOut", delay: delay + 0.4 },
                  }}
                  className="w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center"
                >
                  <Icon className="h-4 w-4" style={{ color: tone }} />
                </motion.div>
              </motion.div>
            ))}

            {/* "2M+ Glow lovers" badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              style={{ x: badgeX }}
              transition={{
                opacity: { duration: 0.4, delay: 0.9 },
                scale: { duration: 0.4, delay: 0.9, type: "spring", stiffness: 260 },
                y: { duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 1.3 },
              }}
              className="absolute top-4 right-0 lg:right-2 bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 z-20"
            >
              <div className="w-9 h-9 rounded-full bg-[#F2D4C8] flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-[#C4614A]" />
              </div>
              <div className="leading-tight">
                <div className="font-bold text-[#2C1810] text-[15px]">
                  <CountUp to={2} suffix="M+" />
                </div>
                <div className="text-[11px] text-[#7A4A3A]">Glow lovers</div>
              </div>
            </motion.div>

            {/* Floating product card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: -8, y: 20 }}
              animate={{ opacity: 1, scale: 1, rotate: -4, y: [0, 10, 0] }}
              style={{ x: cardX }}
              transition={{
                opacity: { duration: 0.4, delay: 1.1 },
                scale: { duration: 0.4, delay: 1.1, type: "spring", stiffness: 260 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.6 },
              }}
              whileHover={{ rotate: 0, scale: 1.04 }}
              className="absolute bottom-2 left-0 lg:left-4 z-20 bg-white rounded-3xl shadow-2xl p-4 w-[210px]"
            >
              <div className="w-full h-[150px] bg-[#F5D5C8] rounded-2xl mb-3 overflow-hidden flex items-center justify-center">
                {accent?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={accent.url} alt="Featured cosmetic product" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-14 h-28 rounded-[40%] shadow-2xl" style={{ background: "linear-gradient(160deg, #8B3A2A, #6B2A1A)" }} />
                )}
              </div>
              <div className="text-[10px] font-black tracking-[0.22em] text-[#C4614A] mb-1 uppercase">
                GlowCart
              </div>
              <div className="font-semibold text-[#2C1810] text-[13px] mb-2.5">
                Velvet Matte Lip
              </div>
              <div className="flex items-center justify-between">
                <span className="font-black text-[#2C1810] text-base">$24</span>
                <div className="flex items-center gap-px">
                  {[1, 2, 3, 4].map((s) => (
                    <span key={s} className="text-[#C4614A] text-[13px]">★</span>
                  ))}
                  <span className="text-[#E8A598] text-[13px]">★</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {(portrait?.credit || accent?.credit) && (
        <div className="relative z-[7] pb-4 text-center text-[10px] text-[#7A4A3A]/50">
          Photos:{" "}
          {[portrait, accent]
            .filter(Boolean)
            .map((p, i) => (
              <a key={i} href={p.creditUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#C4614A]">
                {p.credit}
              </a>
            ))
            .reduce((prev, curr) => [prev, ", ", curr])}{" "}
          / Unsplash
        </div>
      )}
    </section>
  );
}
