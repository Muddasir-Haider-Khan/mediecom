"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    ShoppingCart,
    Heart,
    Star,
    Truck,
    Shield,
    ArrowLeft,
    Minus,
    Plus,
    Share2,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/utils";
// import { products } from "@/lib/mock-data";

export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const addItem = useCartStore((s) => s.addItem);

    useEffect(() => {
        async function fetchProduct() {
            try {
                // params.slug could be an ID or a slug, the API handles both
                const res = await fetch(`/api/products/${params.slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        }
        if (params.slug) fetchProduct();
    }, [params.slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-surface-500">Loading product...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-6xl mb-4">😕</p>
                    <h2 className="font-display font-bold text-xl mb-2">
                        Product Not Found
                    </h2>
                    <Link href="/products" className="btn-primary mt-4">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addItem({
                id: product.id,
                name: product.name,
                slug: product.slug,
                image: product.images[0],
                price: product.b2cPrice,
                stock: product.stock,
            });
        }
    };

    return (
        <div className="min-h-screen bg-surface-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-surface-100">
                <div className="container-custom py-3">
                    <div className="flex items-center gap-2 text-xs text-surface-500">
                        <Link href="/" className="hover:text-primary-700 transition">
                            Home
                        </Link>
                        <span>/</span>
                        <Link
                            href="/products"
                            className="hover:text-primary-700 transition"
                        >
                            Products
                        </Link>
                        <span>/</span>
                        <span className="text-surface-900 font-medium truncate">
                            {product.name}
                        </span>
                    </div>
                </div>
            </div>

            <div className="container-custom py-8">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Images */}
                    <div>
                        <div className="card overflow-hidden">
                            <div className="aspect-square bg-gradient-to-br from-surface-50 to-surface-100 flex items-center justify-center relative">
                                <span className="text-[120px] opacity-30">🏥</span>
                                {product.flashDeal && (
                                    <span className="absolute top-4 left-4 badge bg-red-500 text-white">
                                        Flash Deal
                                    </span>
                                )}
                                <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-surface-500 hover:text-red-500 transition">
                                    <Heart className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-3 mt-4">
                            {[0, 1, 2].map((i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    className={`w-20 h-20 rounded-xl border-2 bg-surface-100 flex items-center justify-center text-2xl transition ${selectedImage === i
                                        ? "border-primary-600"
                                        : "border-surface-200 hover:border-surface-300"
                                        }`}
                                >
                                    🏥
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="badge-primary text-[10px]">
                                {product.category?.name}
                            </span>
                            {product.trending && (
                                <span className="badge bg-purple-100 text-purple-800 text-[10px]">
                                    🔥 Trending
                                </span>
                            )}
                        </div>

                        <h1 className="font-display font-bold text-2xl lg:text-3xl text-surface-900 leading-tight mb-4">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < 4
                                            ? "fill-accent-400 text-accent-400"
                                            : "fill-surface-200 text-surface-200"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-surface-500">
                                4.0 (24 reviews)
                            </span>
                            <button className="text-sm text-primary-700 hover:underline">
                                Write a review
                            </button>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-3xl font-bold text-surface-900">
                                {formatCurrency(product.b2cPrice)}
                            </span>
                            {product.flashDeal && (
                                <span className="text-lg text-surface-400 line-through">
                                    {formatCurrency(Math.round(product.b2cPrice * 1.3))}
                                </span>
                            )}
                        </div>

                        <p className="text-surface-600 leading-relaxed mb-8">
                            {product.description}
                        </p>

                        {/* Quantity & Actions */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-surface-700">
                                    Quantity:
                                </span>
                                <div className="flex items-center gap-1 bg-surface-100 rounded-xl p-1">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-9 h-9 rounded-lg bg-white flex items-center justify-center hover:bg-surface-50 transition shadow-sm"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-semibold text-sm">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() =>
                                            setQuantity(Math.min(product.stock, quantity + 1))
                                        }
                                        className="w-9 h-9 rounded-lg bg-white flex items-center justify-center hover:bg-surface-50 transition shadow-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <span className="text-xs text-surface-500">
                                    {product.stock} available
                                </span>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    className="btn-primary flex-1"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Add to Cart
                                </button>
                                <button className="btn-accent flex-1">Buy Now</button>
                                <button className="btn-outline px-3">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="mt-8 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-surface-600">
                                <Truck className="w-4 h-4 text-primary-600" />
                                <span>Same-day delivery available in major cities</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-surface-600">
                                <Shield className="w-4 h-4 text-primary-600" />
                                <span>100% authentic medical-grade product guaranteed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
