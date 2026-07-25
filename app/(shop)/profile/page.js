import ProfileClient from "@/components/profile/ProfileClient";
import { getProductsByIds } from "@/lib/products";

export const metadata = {
  title: "My Profile — GlowCart",
  description: "Manage your GlowCart account.",
};

// "Velvet Matte Lip" is a legacy hardcoded product name from an earlier version
// of the homepage hero — anyone who wishlisted it before that redesign has a
// localStorage entry with no image. Repair it by name using today's closest
// real catalog match (same price, same lipstick category).
export default async function ProfilePage() {
  const [lipstick] = await getProductsByIds([1]);
  const repairImagesByName = {
    "Velvet Matte Lip": lipstick?.image || null,
  };
  return <ProfileClient repairImagesByName={repairImagesByName} />;
}
