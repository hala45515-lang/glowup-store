import WishlistClient from "@/components/wishlist/WishlistClient";
import { getShadeMatchImages, getProductsByIds } from "@/lib/products";

export const metadata = {
  title: "My Wishlist — GlowCart",
  description: "Your saved favourites, all in one place.",
};

// "Velvet Matte Lip" is a legacy hardcoded product name from an earlier
// homepage hero — its numeric id (1) collides with an unrelated shade-match
// product, so it needs its own name-keyed repair rather than the id-keyed one.
export default async function WishlistPage() {
  const [repairImages, [lipstick]] = await Promise.all([
    getShadeMatchImages(),
    getProductsByIds([1]),
  ]);
  const repairImagesByName = { "Velvet Matte Lip": lipstick?.image || null };
  return <WishlistClient repairImages={repairImages} repairImagesByName={repairImagesByName} />;
}
