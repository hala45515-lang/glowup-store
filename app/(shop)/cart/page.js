import CartClient from "@/components/cart/CartClient";
import { getProductsByIds, getShadeMatchImages } from "@/lib/products";

export const metadata = {
  title: "My Bag — GlowCart",
  description: "Review your cart before checkout.",
};

export default async function CartPage() {
  const [suggestions, repairImages] = await Promise.all([
    getProductsByIds([8, 11, 1, 3]),
    getShadeMatchImages(),
  ]);
  return <CartClient suggestions={suggestions} repairImages={repairImages} />;
}
