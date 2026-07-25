import SearchClient from "@/components/search/SearchClient";
import { getShopProducts } from "@/lib/products";

export const metadata = {
  title: "Search — GlowCart",
  description: "Search GlowCart's full collection of makeup and skincare.",
};

export default async function SearchPage({ searchParams }) {
  const products = await getShopProducts();
  return <SearchClient products={products} initialQuery={searchParams?.q || ""} />;
}
