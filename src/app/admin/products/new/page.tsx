"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Plus, X } from "lucide-react";
import { categories } from "@/lib/mock-data";

export default function NewProductPage() {
    const [images, setImages] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        categoryId: "",
        supplyChainId: "",
        b2cPrice: "",
        b2bPrice: "",
        stock: "",
        featured: false,
        trending: false,
        flashDeal: false,
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/products"
                    className="p-2 rounded-xl hover:bg-surface-100 transition"
                >
                    <ArrowLeft className="w-5 h-5 text-surface-600" />
                </Link>
                <div>
                    <h1 className="font-display font-bold text-2xl text-surface-900">
                        Add New Product
                    </h1>
                    <p className="text-sm text-surface-500 mt-1">
                        Create a new product in your catalog
                    </p>
                </div>
            </div>

            <form className="space-y-6">
                {/* Basic Info */}
                <div className="card p-6 space-y-4">
                    <h2 className="font-display font-semibold text-sm text-surface-900">
                        Basic Information
                    </h2>

                    <div>
                        <label className="text-xs font-semibold text-surface-700 mb-1 block">
                            Product Name *
                        </label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g., Professional Surgical Scissors — Titanium"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-surface-700 mb-1 block">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="input-field resize-none"
                            placeholder="Detailed product description..."
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">
                                Category *
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="">Select category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">
                                Supply Chain
                            </label>
                            <select
                                name="supplyChainId"
                                value={formData.supplyChainId}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="">Select supply chain</option>
                                <option value="1">MedTech Supplies Co.</option>
                                <option value="2">Global Surgical</option>
                                <option value="3">HealthCare Direct</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="card p-6 space-y-4">
                    <h2 className="font-display font-semibold text-sm text-surface-900">
                        Product Images
                    </h2>
                    <div className="border-2 border-dashed border-surface-200 rounded-2xl p-8 text-center hover:border-primary-400 transition cursor-pointer">
                        <Upload className="w-8 h-8 text-surface-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-surface-700">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-surface-500 mt-1">
                            PNG, JPG up to 5MB. Recommended: 800×800px
                        </p>
                    </div>
                </div>

                {/* Pricing */}
                <div className="card p-6 space-y-4">
                    <h2 className="font-display font-semibold text-sm text-surface-900">
                        Pricing & Inventory
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">
                                B2C Price (PKR) *
                            </label>
                            <input
                                name="b2cPrice"
                                value={formData.b2cPrice}
                                onChange={handleChange}
                                type="number"
                                className="input-field"
                                placeholder="Consumer price"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">
                                B2B Price (PKR) *
                            </label>
                            <input
                                name="b2bPrice"
                                value={formData.b2bPrice}
                                onChange={handleChange}
                                type="number"
                                className="input-field"
                                placeholder="Wholesale price"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">
                                Stock Quantity *
                            </label>
                            <input
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                type="number"
                                className="input-field"
                                placeholder="Available units"
                            />
                        </div>
                    </div>
                </div>

                {/* Flags */}
                <div className="card p-6 space-y-4">
                    <h2 className="font-display font-semibold text-sm text-surface-900">
                        Product Flags
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        {[
                            { name: "featured", label: "Featured Product" },
                            { name: "trending", label: "Trending" },
                            { name: "flashDeal", label: "Flash Deal" },
                        ].map((flag) => (
                            <label
                                key={flag.name}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    name={flag.name}
                                    checked={formData[flag.name as keyof typeof formData] as boolean}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm text-surface-700">{flag.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end gap-3">
                    <Link href="/admin/products" className="btn-outline">
                        Cancel
                    </Link>
                    <button type="submit" className="btn-primary">
                        <Plus className="w-4 h-4" />
                        Create Product
                    </button>
                </div>
            </form>
        </div>
    );
}
