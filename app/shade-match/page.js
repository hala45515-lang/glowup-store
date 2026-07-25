import ShadeMatchClient from "@/components/shade-match/ShadeMatchClient";
import { getShadeMatchImages } from "@/lib/products";

export const metadata = {
  title: "Shade Match — GlowCart",
  description: "Answer a few questions and we'll match you with your ideal products.",
};

export default async function ShadeMatchPage() {
  const images = await getShadeMatchImages();
  return <ShadeMatchClient images={images} />;
}
