"use client";

import { ShoppingCart, Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { products, categories } from "@/lib/mock-data";
import { useState } from "react";

export default function B2BProductsPage() {
    const [search, setSearch] = useState("");
    const [cat, setCat] = useState("all");

    const filtered = products.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = cat === "all" || p.categoryId === cat;
        return matchSearch && matchCat;
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display font-bold text-2xl text-surface-900">Wholesale Catalog</h1>
                <p className="text-sm text-surface-500 mt-1">Browse products at B2B wholesale pricing</p>
            </div>

            <div className="card p-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="input-field pl-10 py-2.5" />
                </div>
                <select value={cat} onChange={(e) => setCat(e.target.value)} className="input-field py-2.5 sm:w-48">
                    <option value="all">All Categories</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((product) => (
                    <div key={product.id} className="card p-5 hover:shadow-lg transition">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-xl bg-surface-100 flex items-center justify-center text-3xl flex-shrink-0">🏥</div>
                            <div className="flex-1 min-w-0">
                                <span className="text-[10px] font-semibold text-primary-600 uppercase">{product.category.name}</span>
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
                        <div className="flex items-center gap-2 mt-4">
                            <input type="number" defaultValue={1} min={1} className="input-field w-20 py-1.5 text-center text-xs" />
                            <button className="btn-primary flex-1 py-2 text-xs">
                                <ShoppingCart className="w-3.5 h-3.5" /> Add to Order
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
