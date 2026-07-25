export default function ProductShape({ shape, glow }) {
  const glowLayer = (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ background: `radial-gradient(circle at 35% 28%, ${glow}, transparent 55%)` }}
    />
  );

  if (shape === "lipstick") {
    return (
      <div className="relative flex items-end justify-center h-full pb-6">
        {glowLayer}
        <div className="transform -rotate-[12deg] flex flex-col items-center relative z-10">
          <div className="w-7 h-7 rounded-t-sm" style={{ background: "linear-gradient(120deg,rgba(255,255,255,0.25),rgba(255,255,255,0.08))", boxShadow: "inset -1px 0 3px rgba(0,0,0,0.25)" }} />
          <div className="w-9 h-24 rounded-sm" style={{ background: "linear-gradient(90deg,rgba(255,255,255,0.04),rgba(255,255,255,0.18),rgba(255,255,255,0.04))", border: "1px solid rgba(255,255,255,0.22)" }} />
          <div className="w-11 h-4 rounded-b-sm" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }} />
        </div>
      </div>
    );
  }

  if (shape === "bottle") {
    return (
      <div className="relative flex items-center justify-center h-full">
        {glowLayer}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-5 h-5 rounded-full mb-1" style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }} />
          <div className="w-14 h-6 rounded-t-2xl" style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.25)" }} />
          <div style={{ width: "80px", height: "130px", background: "linear-gradient(120deg,rgba(255,255,255,0.04),rgba(255,255,255,0.18),rgba(255,255,255,0.04))", border: "1px solid rgba(255,255,255,0.22)", borderRadius: "14px", boxShadow: "inset 3px 0 10px rgba(255,255,255,0.06)" }} />
        </div>
      </div>
    );
  }

  if (shape === "compact") {
    return (
      <div className="relative flex items-center justify-center h-full">
        {glowLayer}
        <div className="relative z-10 w-36 h-36 rounded-full" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.28)", boxShadow: "inset -5px -5px 12px rgba(0,0,0,0.18),inset 3px 3px 12px rgba(255,255,255,0.1)" }}>
          <div className="absolute top-4 left-5 w-10 h-10 rounded-full" style={{ background: "radial-gradient(circle at 30% 30%,rgba(255,255,255,0.5),transparent 65%)" }} />
          <div className="absolute inset-4 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.15)" }} />
        </div>
      </div>
    );
  }

  if (shape === "eyeliner") {
    return (
      <div className="relative flex items-center justify-center h-full">
        {glowLayer}
        <div className="relative z-10 flex flex-col items-center transform -rotate-[10deg]">
          <div className="w-2 h-3 rounded-t-sm" style={{ background: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.3)" }} />
          <div style={{ width: "10px", height: "130px", background: "linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0.2),rgba(255,255,255,0.06))", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "3px" }} />
          <div className="w-2 h-4" style={{ background: "rgba(255,255,255,0.12)", clipPath: "polygon(50% 100%,0 0,100% 0)" }} />
        </div>
      </div>
    );
  }

  if (shape === "mascara") {
    return (
      <div className="relative flex items-center justify-center h-full">
        {glowLayer}
        <div className="relative z-10 flex flex-col items-center transform -rotate-[8deg]">
          <div style={{ width: "12px", height: "30px", background: "linear-gradient(90deg,rgba(255,255,255,0.15),rgba(255,255,255,0.35),rgba(255,255,255,0.15))", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "2px 2px 0 0" }} />
          <div style={{ width: "24px", height: "100px", background: "linear-gradient(90deg,rgba(255,255,255,0.05),rgba(255,255,255,0.18),rgba(255,255,255,0.05))", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "3px" }} />
          <div style={{ width: "28px", height: "16px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "0 0 4px 4px" }} />
        </div>
      </div>
    );
  }

  return null;
}
