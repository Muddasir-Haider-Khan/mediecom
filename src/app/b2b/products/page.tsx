"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Search, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";

export default function B2BProductsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { addItem } = useCartStore();

    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    const searchQuery = searchParams.get("search") || "";
    const categoryQuery = searchParams.get("category") || "all";

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                let url = "/api/products?limit=50";
                if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;
                if (categoryQuery !== "all") url += `&categoryId=${categoryQuery}`;

                const [prodRes, catRes] = await Promise.all([
                    fetch(url),
                    fetch("/api/categories")
                ]);

                if (prodRes.ok && catRes.ok) {
                    const prodData = await prodRes.json();
                    const catData = await catRes.json();
                    setProducts(prodData.products);
                    setCategories(catData);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [searchQuery, categoryQuery]);

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("search", term);
        } else {
            params.delete("search");
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    const handleCategory = (catId: string) => {
        const params = new URLSearchParams(searchParams);
        if (catId !== "all") {
            params.set("category", catId);
        } else {
            params.delete("category");
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    const handleAddToCart = (product: any) => {
        const qty = quantities[product.id] || 1;
        addItem({
            id: product.id,
            name: product.name,
            slug: product.slug,
            image: product.images[0] || "",
            price: product.b2bPrice,
            stock: product.stock,
        });
        // We might want to add specific quantity, but cart store `addItem` currently adds 1 or increments.
        // If we want to add multiple, we'd need to loop or update store to accept quantity.
        // For now, let's just add 1 logic or calling it `qty` times (hacky) or better: update store later. 
        // Actually `addItem` in cart.ts adds 1.
        // Let's just add 1 for now to be safe, or loop.
        for (let i = 1; i < qty; i++) {
            addItem({
                id: product.id,
                name: product.name,
                slug: product.slug,
                image: product.images[0] || "",
                price: product.b2bPrice,
                stock: product.stock,
            });
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display font-bold text-2xl text-surface-900">Wholesale Catalog</h1>
                <p className="text-sm text-surface-500 mt-1">Browse products at B2B wholesale pricing</p>
            </div>

            <div className="card p-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input
                        defaultValue={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search products..."
                        className="input-field pl-10 py-2.5"
                    />
                </div>
                <select
                    value={categoryQuery}
                    onChange={(e) => handleCategory(e.target.value)}
                    className="input-field py-2.5 sm:w-48"
                >
                    <option value="all">All Categories</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <div key={product.id} className="card p-5 hover:shadow-lg transition flex flex-col">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-16 h-16 rounded-xl bg-surface-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-surface-200">
                                    {product.images?.[0] ? (
                                        <Image src={product.images[0]} alt={product.name} width={64} height={64} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl">📦</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-[10px] font-semibold text-primary-600 uppercase">
                                        {product.category?.name || "Product"}
                                    </span>
                                    <h3 className="text-sm font-semibold text-surface-900 line-clamp-2 mt-0.5">{product.name}</h3>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-lg font-bold text-primary-700">{formatCurrency(product.b2bPrice)}</span>
                                        <span className="text-[10px] text-surface-400 line-through">{formatCurrency(product.b2cPrice)}</span>
                                    </div>
                                    <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                                        Save {formatCurrency(product.b2cPrice - product.b2bPrice)} per unit
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-surface-100">
                                <input
                                    type="number"
                                    min={1}
                                    value={quantities[product.id] || 1}
                                    onChange={(e) => setQuantities({ ...quantities, [product.id]: parseInt(e.target.value) || 1 })}
                                    className="input-field w-20 py-1.5 text-center text-xs"
                                />
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="btn-primary flex-1 py-2 text-xs justify-center"
                                >
                                    <ShoppingCart className="w-3.5 h-3.5 mr-2" /> Add to Order
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!loading && products.length === 0 && (
                <div className="text-center py-12 text-surface-500">
                    No products found matching your criteria.
                </div>
            )}
        </div>
    );
}
