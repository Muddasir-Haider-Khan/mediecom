"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    MoreVertical,
    Eye,
    Package,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { products, categories } from "@/lib/mock-data";

export default function AdminProductsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const filteredProducts = products.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || p.categoryId === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display font-bold text-2xl text-surface-900">
                        Products
                    </h1>
                    <p className="text-sm text-surface-500 mt-1">
                        Manage your product catalog ({products.length} products)
                    </p>
                </div>
                <Link href="/admin/products/new" className="btn-primary">
                    <Plus className="w-4 h-4" />
                    Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="card p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="input-field pl-10 py-2.5"
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="input-field py-2.5 w-full sm:w-48"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-50">
                                <th className="text-left text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">
                                    Product
                                </th>
                                <th className="text-left text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">
                                    Category
                                </th>
                                <th className="text-left text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">
                                    B2C Price
                                </th>
                                <th className="text-left text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">
                                    B2B Price
                                </th>
                                <th className="text-left text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">
                                    Stock
                                </th>
                                <th className="text-left text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">
                                    Status
                                </th>
                                <th className="text-right text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-surface-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center text-lg">
                                                🏥
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-surface-900 line-clamp-1">
                                                    {product.name}
                                                </p>
                                                <p className="text-[10px] text-surface-500">
                                                    SKU: {product.slug.slice(0, 15)}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="badge-primary text-[10px]">
                                            {product.category.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-semibold text-surface-900">
                                        {formatCurrency(product.b2cPrice)}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-semibold text-primary-700">
                                        {formatCurrency(product.b2bPrice)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`text-xs font-semibold ${product.stock > 50
                                                    ? "text-emerald-600"
                                                    : product.stock > 10
                                                        ? "text-amber-600"
                                                        : "text-red-600"
                                                }`}
                                        >
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="badge-success text-[10px]">Published</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500 transition">
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>
                                            <button className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500 transition">
                                                <Edit className="w-3.5 h-3.5" />
                                            </button>
                                            <button className="p-1.5 rounded-lg hover:bg-red-50 text-surface-500 hover:text-red-600 transition">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
