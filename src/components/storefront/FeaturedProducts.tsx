import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
// import { products } from "@/lib/mock-data";

export default function FeaturedProducts({ products = [] }: { products: any[] }) {
    return (
        <section className="py-12 lg:py-16 bg-surface-50">
            <div className="container-custom">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="font-display font-bold text-2xl lg:text-3xl text-surface-900">
                            Featured <span className="gradient-text">Products</span>
                        </h2>
                        <p className="text-surface-500 mt-2 text-sm">
                            Hand-picked premium medical equipment for professionals
                        </p>
                    </div>
                    <Link
                        href="/products?featured=true"
                        className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary-700 hover:text-primary-800 transition group"
                    >
                        View All
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            slug={product.slug}
                            image={product.images[0]}
                            b2cPrice={product.b2cPrice}
                            stock={product.stock}
                            featured={product.featured}
                            trending={product.trending}
                            category={product.category.name}
                        />
                    ))}
                </div>

                <Link
                    href="/products?featured=true"
                    className="sm:hidden btn-outline w-full justify-center mt-6"
                >
                    View All Featured Products
                </Link>
            </div>
        </section>
    );
}
