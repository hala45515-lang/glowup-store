import Link from "next/link";
import { Mail } from "lucide-react";
import Wordmark from "@/components/layout/Wordmark";

const FOOTER_LINKS = {
  Shop: [
    { label: "All Products", href: "/shop" },
    { label: "Lips", href: "/shop?category=lips" },
    { label: "Eyes", href: "/shop?category=eyes" },
    { label: "Face", href: "/shop?category=face" },
    { label: "Skin Care", href: "/shop?category=skin" },
    { label: "Makeup Sets", href: "/shop?category=sets" },
  ],
  Discover: [
    { label: "Best Sellers", href: "/shop?sort=bestseller" },
    { label: "New Arrivals", href: "/shop?sort=new" },
    { label: "Shade Match", href: "/shade-match" },
    { label: "Routines", href: "/routines" },
    { label: "Looks", href: "/looks" },
  ],
  Account: [
    { label: "Profile", href: "/profile" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Orders", href: "/profile/orders" },
    { label: "Sign In", href: "/auth/login" },
  ],
};

const SOCIAL = [
  { Icon: Mail, href: "mailto:hello@glowcart.com", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="bg-[#2C1810] text-white">
      <div className="container mx-auto px-6 lg:px-8 pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-3">
              <Wordmark size="text-[22px]" theme="dark" />
            </Link>
            <p className="text-[13px] text-[#C4897A] leading-relaxed max-w-xs mb-4">
              Your go-to destination for premium, cruelty-free makeup. Curated looks,
              personalised routines, and AI-powered shade matching — made to help you glow.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#C4614A] flex items-center justify-center transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-bold text-white text-[13px] uppercase tracking-wider mb-3">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-[#C4897A] hover:text-[#E8A598] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-[#7A4A3A]">
            © {new Date().getFullYear()} GlowCart. All rights reserved.
          </p>
          <p className="text-[12px] text-[#7A4A3A]">
            Powered by{" "}
            <span className="text-[#E8A598] font-medium">Makeup API</span>
            {" & "}
            <span className="text-[#E8A598] font-medium">Claude AI</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
