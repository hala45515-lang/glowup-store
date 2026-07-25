import LooksClient from "@/components/looks/LooksClient";
import { getLookbook } from "@/lib/products";

export const metadata = {
  title: "Looks — GlowCart",
  description: "Browse curated, shoppable makeup looks and get every product in one click.",
};

export default async function LooksPage() {
  const looks = await getLookbook();
  return <LooksClient looks={looks} />;
}
