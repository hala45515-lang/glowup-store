import RoutinesClient from "@/components/routines/RoutinesClient";
import { getRoutinesImages } from "@/lib/products";

export const metadata = {
  title: "Build Your Routine — GlowCart",
  description: "Create a personalized step-by-step makeup routine and shop everything in one click.",
};

export default async function RoutinesPage() {
  const images = await getRoutinesImages();
  return <RoutinesClient images={images} />;
}
