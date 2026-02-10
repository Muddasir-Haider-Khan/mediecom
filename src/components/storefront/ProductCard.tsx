"use client";

import Link from "next/link";
import NextImage from "next/image";
import { ShoppingCart, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

interface ProductCardProps {
    id: string;
    name: string;
    slug: string;
    image: string;
    b2cPrice: number;
    b2bPrice?: number;
    stock: number;
    featured?: boolean;
    trending?: boolean;
    flashDeal?: boolean;
    category?: string;
}

export default function ProductCard({
    id,
    name,
    slug,
    image,
    b2cPrice,
    stock,
    featured,
    trending,
    flashDeal,
    category,
}: ProductCardProps) {
    const addItem = useCartStore((s) => s.addItem);

    const discount = flashDeal ? Math.round(Math.random() * 20 + 15) : 0;
    const originalPrice = flashDeal
        ? Math.round(b2cPrice / (1 - discount / 100))
        : b2cPrice;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            id,
            name,
            slug,
            image,
            price: b2cPrice,
            stock,
        });
    };

    return (
        <Link href={`/products/${slug}`} className="group">
            <div className="card-hover overflow-hidden">
                {/* Image */}
                <div className="relative aspect-square bg-gradient-to-br from-surface-50 to-surface-100 overflow-hidden">
                    {image ? (
                        <NextImage
                            src={image}
                            alt={name}
                            fill
                            className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20 group-hover:scale-110 transition-transform duration-500">
                            🏥
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        {flashDeal && (
                            <span className="badge bg-red-500 text-white text-[10px] shadow-sm">
                                -{discount}% OFF
                            </span>
                        )}
                        {featured && (
                            <span className="badge-primary text-[10px]">Featured</span>
                        )}
                        {trending && (
                            <span className="badge bg-purple-100 text-purple-800 text-[10px]">
                                🔥 Trending
                            </span>
                        )}
                    </div>

                    {/* Quick Add */}
                    <button
                        onClick={handleAddToCart}
                        className="absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-primary-700 text-white flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary-800 shadow-lg z-10"
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    {category && (
                        <p className="text-[10px] font-semibold text-primary-600 uppercase tracking-wider mb-1">
                            {category}
                        </p>
                    )}
                    <h3 className="text-sm font-semibold text-surface-900 line-clamp-2 group-hover:text-primary-700 transition mb-2 leading-snug">
                        {name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3 h-3 ${i < 4
                                    ? "fill-accent-400 text-accent-400"
                                    : "fill-surface-200 text-surface-200"
                                    }`}
                            />
                        ))}
                        <span className="text-[10px] text-surface-400 ml-1">(24)</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-surface-900">
                            {formatCurrency(b2cPrice)}
                        </span>
                        {flashDeal && (
                            <span className="text-xs text-surface-400 line-through">
                                {formatCurrency(originalPrice)}
                            </span>
                        )}
                    </div>

                    {stock <= 10 && stock > 0 && (
                        <p className="text-[10px] text-red-500 font-medium mt-1">
                            Only {stock} left in stock
                        </p>
                    )}
                    {stock === 0 && (
                        <p className="text-[10px] text-red-500 font-medium mt-1">
                            Out of stock
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
