import { db as prisma } from "@/lib/db";
import HeroSlider from "@/components/storefront/HeroSlider";
import CategoryGrid from "@/components/storefront/CategoryGrid";
import FlashDeals from "@/components/storefront/FlashDeals";
import FeaturedProducts from "@/components/storefront/FeaturedProducts";
import TrendingProducts from "@/components/storefront/TrendingProducts";
import TrustBadges, { CTABanner } from "@/components/storefront/TrustBadges";

export const dynamic = "force-dynamic";

async function getData() {
    const [categories, flashDeals, featuredProducts, trendingProducts] = await Promise.all([
        prisma.category.findMany({
            orderBy: { name: "asc" },
        }),
        prisma.product.findMany({
            where: { flashDeal: true },
            include: { category: true },
            take: 4,
        }),
        prisma.product.findMany({
            where: { featured: true },
            include: { category: true },
            take: 8,
        }),
        prisma.product.findMany({
            where: { trending: true },
            include: { category: true },
            take: 8,
        }),
    ]);

    return {
        categories,
        flashDeals,
        featuredProducts,
        trendingProducts,
    };
}

export default async function HomePage() {
    const data = await getData();

    return (
        <>
            <HeroSlider />
            <TrustBadges />
            <CategoryGrid categories={data.categories} />
            <FlashDeals products={data.flashDeals} />
            <FeaturedProducts products={data.featuredProducts} />
            <TrendingProducts products={data.trendingProducts} />
            <CTABanner />
        </>
    );
}
