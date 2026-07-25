import HeroSection from "@/components/home/HeroSection";
import FeaturesBanner from "@/components/home/FeaturesBanner";
import ProductsSection from "@/components/home/ProductsSection";
import FeaturedThisWeek from "@/components/home/FeaturedThisWeek";
import ShadeMatchBanner from "@/components/home/ShadeMatchBanner";
import JustLanded from "@/components/home/JustLanded";
import LookOfTheDay from "@/components/home/LookOfTheDay";
import TopBrands from "@/components/home/TopBrands";
import AIAssistant from "@/components/home/AIAssistant";
import BestSellersSection from "@/components/home/BestSellersSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import {
  getHomeCategoryProducts,
  getFeaturedThisWeek,
  getNewArrivals,
  getBestSellers,
  getHeroImages,
  getFeaturedLook,
} from "@/lib/products";

export default async function Home() {
  const [categoryProducts, featuredProducts, newArrivals, bestSellers, heroImages, featuredLook] = await Promise.all([
    getHomeCategoryProducts(),
    getFeaturedThisWeek(),
    getNewArrivals(),
    getBestSellers(),
    getHeroImages(),
    getFeaturedLook(1),
  ]);

  return (
    <>
      <HeroSection portrait={heroImages.portrait} accent={heroImages.accent} />
      <FeaturesBanner />
      <ProductsSection products={categoryProducts} />
      <FeaturedThisWeek products={featuredProducts} />
      <ShadeMatchBanner />
      <JustLanded products={newArrivals} />
      <LookOfTheDay look={featuredLook} />
      <TopBrands />
      <AIAssistant />
      <BestSellersSection products={bestSellers} />
      <NewsletterSection />
    </>
  );
}
