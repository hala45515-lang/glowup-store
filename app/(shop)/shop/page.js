import ShopClient from "@/components/shop/ShopClient";
import { getShopProducts } from "@/lib/products";

export const metadata = {
  title: "Shop — GlowCart",
  description: "Discover our full collection of luxury makeup — curated shades, clean formulas and cult-favourite icons.",
};

export default async function ShopPage() {
  const products = await getShopProducts();
  return <ShopClient products={products} />;
}
