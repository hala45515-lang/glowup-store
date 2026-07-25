export default function Wordmark({ size = "text-[26px]", theme = "light" }) {
  const glowColor = theme === "dark" ? "#E8A598" : "#C4614A";
  const cartColor = theme === "dark" ? "#FFF8F5" : "#2C1810";
  return (
    <span
      className={`${size} font-black italic tracking-tight leading-none`}
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      <span style={{ color: glowColor }}>Glow</span>
      <span style={{ color: cartColor }}>Cart</span>
    </span>
  );
}
