import HeroSlider from "@/components/storefront/HeroSlider";
import CategoryGrid from "@/components/storefront/CategoryGrid";
import FlashDeals from "@/components/storefront/FlashDeals";
import FeaturedProducts from "@/components/storefront/FeaturedProducts";
import TrendingProducts from "@/components/storefront/TrendingProducts";
import TrustBadges, { CTABanner } from "@/components/storefront/TrustBadges";

export default function HomePage() {
    return (
        <>
            <HeroSlider />
            <TrustBadges />
            <CategoryGrid />
            <FlashDeals />
            <FeaturedProducts />
            <TrendingProducts />
            <CTABanner />
        </>
    );
}
