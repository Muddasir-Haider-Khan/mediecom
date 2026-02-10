"use client";

import { useEffect, useState, Suspense } from "react";
import { SlidersHorizontal, ChevronDown, Loader2 } from "lucide-react";
import ProductCard from "@/components/storefront/ProductCard";
import { useSearchParams } from "next/navigation";

const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Best Selling", value: "best-selling" },
];

function ProductsContent() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search");

    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [sortBy, setSortBy] = useState("newest");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                let url = "/api/products?limit=100";
                if (searchQuery) {
                    url += `&q=${encodeURIComponent(searchQuery)}`;
                }

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
    }, [searchQuery]);

    const filteredProducts =
        selectedCategory === "all"
            ? products
            : products.filter((p) => p.categoryId === selectedCategory);

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case "price-asc":
                return a.b2cPrice - b.b2cPrice;
            case "price-desc":
                return b.b2cPrice - a.b2cPrice;
            default:
                return 0;
        }
    });

    return (
        <div className="min-h-screen bg-surface-50">
            {/* Page Header */}
            <div className="bg-white border-b border-surface-100">
                <div className="container-custom py-6">
                    <h1 className="font-display font-bold text-2xl text-surface-900">
                        All Products
                    </h1>
                    <p className="text-sm text-surface-500 mt-1">
                        {sortedProducts.length} products found
                    </p>
                </div>
            </div>

            <div className="container-custom py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters — Desktop */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="card p-6 sticky top-24">
                            <h3 className="font-display font-bold text-sm text-surface-900 mb-4">
                                Categories
                            </h3>
                            <div className="space-y-1">
                                <button
                                    onClick={() => setSelectedCategory("all")}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${selectedCategory === "all"
                                        ? "bg-primary-50 text-primary-700"
                                        : "text-surface-600 hover:bg-surface-50"
                                        }`}
                                >
                                    All Products
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${selectedCategory === cat.id
                                            ? "bg-primary-50 text-primary-700"
                                            : "text-surface-600 hover:bg-surface-50"
                                            }`}
                                    >
                                        <span>{cat.icon}</span>
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            <hr className="my-6 border-surface-100" />

                            <h3 className="font-display font-bold text-sm text-surface-900 mb-4">
                                Price Range
                            </h3>
                            <div className="space-y-2">
                                {["Under PKR 5,000", "PKR 5,000 - 50,000", "PKR 50,000 - 200,000", "Above PKR 200,000"].map(
                                    (range) => (
                                        <label
                                            key={range}
                                            className="flex items-center gap-2 text-sm text-surface-600 cursor-pointer hover:text-surface-900"
                                        >
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            {range}
                                        </label>
                                    )
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6 gap-4">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="lg:hidden btn-outline py-2 px-3 text-xs"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Filters
                            </button>

                            <div className="flex items-center gap-3 ml-auto">
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-surface-200 bg-white text-xs font-medium text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                    >
                                        {sortOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-surface-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Mobile Filters */}
                        {isFilterOpen && (
                            <div className="lg:hidden card p-4 mb-6 animate-slide-up">
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSelectedCategory("all")}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${selectedCategory === "all"
                                            ? "bg-primary-700 text-white"
                                            : "bg-surface-100 text-surface-600 hover:bg-surface-200"
                                            }`}
                                    >
                                        All
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${selectedCategory === cat.id
                                                ? "bg-primary-700 text-white"
                                                : "bg-surface-100 text-surface-600 hover:bg-surface-200"
                                                }`}
                                        >
                                            {cat.icon} {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Product Grid */}
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-surface-400" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                                {sortedProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        name={product.name}
                                        slug={product.slug}
                                        image={product.images[0] || ""}
                                        b2cPrice={product.b2cPrice}
                                        stock={product.stock}
                                        featured={product.featured}
                                        trending={product.trending}
                                        flashDeal={product.flashDeal}
                                        category={product.category?.name}
                                    />
                                ))}
                            </div>
                        )}

                        {!loading && sortedProducts.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-4xl mb-4">🔍</p>
                                <p className="font-display font-semibold text-surface-900">
                                    No products found
                                </p>
                                <p className="text-sm text-surface-500 mt-1">
                                    Try adjusting your filters
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>}>
            <ProductsContent />
        </Suspense>
    );
}
