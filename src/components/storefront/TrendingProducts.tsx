import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import ProductCard from "./ProductCard";
import { products } from "@/lib/mock-data";

export default function TrendingProducts() {
    const trendingProducts = products.filter((p) => p.trending);

    return (
        <section className="py-12 lg:py-16">
            <div className="container-custom">
                <div className="flex items-end justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="font-display font-bold text-2xl lg:text-3xl text-surface-900">
                                Trending Now
                            </h2>
                            <p className="text-surface-500 mt-0.5 text-sm">
                                Most popular products this week
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/products?trending=true"
                        className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary-700 hover:text-primary-800 transition group"
                    >
                        View All
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                    {trendingProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            slug={product.slug}
                            image={product.images[0]}
                            b2cPrice={product.b2cPrice}
                            stock={product.stock}
                            trending={product.trending}
                            category={product.category.name}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
