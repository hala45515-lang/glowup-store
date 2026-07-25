const BRANDS = [
  "Maison Lumière",
  "Lumi Co.",
  "Côte Rose",
  "Atelier No.",
  "Verena",
  "Solène",
];

export default function TopBrands() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#C4614A]" />
            <span className="text-[11px] font-bold tracking-[0.3em] text-[#C4614A] uppercase">
              In Good Company
            </span>
            <div className="h-px w-8 bg-[#C4614A]" />
          </div>
          <h2 className="text-[42px] lg:text-[50px] font-black text-[#2C1810] mb-2 leading-tight">
            Top Brands
          </h2>
          <div className="flex justify-center">
            <svg width="160" height="10" viewBox="0 0 160 10" fill="none">
              <path
                d="M0 5 Q20 0 40 5 Q60 10 80 5 Q100 0 120 5 Q140 10 160 5"
                stroke="#E8A598"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Brand cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {BRANDS.map((brand) => (
            <button
              key={brand}
              className="bg-white border-2 border-[#F2D4C8] hover:border-[#C4614A] rounded-2xl px-4 py-6 text-center font-bold text-[#2C1810] text-[15px] hover:text-[#C4614A] transition-all hover:shadow-md"
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
