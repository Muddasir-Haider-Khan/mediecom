"use client";

import { useEffect, useState } from "react";
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
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            const res = await fetch("/api/products?limit=100");
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products);
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete product", error);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display font-bold text-2xl text-surface-900">
                        Products
                    </h1>
                    <p className="text-sm text-surface-500 mt-1">
                        Manage your product catalog
                    </p>
                </div>
                <Link href="/admin/products/new" className="btn-primary">
                    <Plus className="w-4 h-4" />
                    Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="card p-4 flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-50 border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg bg-surface-100 text-surface-600 hover:bg-surface-200">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Products Table */}
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
                                    Price
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
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-surface-500">
                                        Loading products...
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-surface-500">
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-surface-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-surface-100 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-semibold text-surface-900">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-xs text-surface-500">
                                                        SKU: {product.slug.slice(0, 8)}...
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-surface-600">
                                            {product.category?.name}
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-surface-900">
                                            {formatCurrency(product.b2cPrice)}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-surface-600">
                                            {product.stock} units
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.stock > 0 ? (
                                                <span className="badge-success">In Stock</span>
                                            ) : (
                                                <span className="badge-danger">Out of Stock</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-1.5 rounded-lg text-surface-400 hover:text-surface-900 hover:bg-surface-100">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-1.5 rounded-lg text-surface-400 hover:text-blue-600 hover:bg-blue-50">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-1.5 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
