"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Upload, Plus, X, Loader2 } from "lucide-react";

export default function NewProductPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [categories, setCategories] = useState<any[]>([]);
    const [supplyChains, setSupplyChains] = useState<any[]>([]);
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

    useEffect(() => {
        async function fetchOptions() {
            try {
                const [catRes, scRes] = await Promise.all([
                    fetch("/api/categories"),
                    fetch("/api/supply-chains")
                ]);

                if (catRes.ok && scRes.ok) {
                    const catData = await catRes.json();
                    const scData = await scRes.json();
                    setCategories(catData);
                    setSupplyChains(scData);
                }
            } catch (error) {
                console.error("Failed to fetch options", error);
            }
        }
        fetchOptions();
    }, []);

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

    const handleFileSelect = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        setUploadError("");
        setUploading(true);

        try {
            const formPayload = new FormData();
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file.type.startsWith("image/")) {
                    setUploadError(`"${file.name}" is not a valid image file.`);
                    setUploading(false);
                    return;
                }
                if (file.size > 5 * 1024 * 1024) {
                    setUploadError(`"${file.name}" exceeds the 5MB size limit.`);
                    setUploading(false);
                    return;
                }
                formPayload.append("files", file);
            }

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formPayload,
            });

            if (!res.ok) {
                const data = await res.json();
                setUploadError(data.error || "Upload failed");
                setUploading(false);
                return;
            }

            const data = await res.json();
            setImages((prev) => [...prev, ...data.paths]);
        } catch {
            setUploadError("Upload failed. Please try again.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleFileSelect(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    images: images.length > 0 ? images : ["/product-placeholder.png"],
                }),
            });

            if (res.ok) {
                router.push("/admin/products");
            } else {
                alert("Failed to create product");
            }
        } catch (error) {
            console.error("Error creating product", error);
        }
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

            <form onSubmit={handleSubmit} className="space-y-6">
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
                            required
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
                            required
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
                                required
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
                                {supplyChains.map((sc) => (
                                    <option key={sc.id} value={sc.id}>
                                        {sc.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="card p-6 space-y-4">
                    <h2 className="font-display font-semibold text-sm text-surface-900">
                        Product Images
                    </h2>

                    {/* Image Previews */}
                    {images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {images.map((src, i) => (
                                <div key={i} className="relative group rounded-xl overflow-hidden border border-surface-200 aspect-square">
                                    <Image
                                        src={src}
                                        alt={`Product image ${i + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Upload Area */}
                    <div
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className={`border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer ${
                            uploading
                                ? "border-primary-400 bg-primary-50"
                                : "border-surface-200 hover:border-primary-400"
                        }`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileSelect(e.target.files)}
                        />
                        {uploading ? (
                            <>
                                <Loader2 className="w-8 h-8 text-primary-500 mx-auto mb-3 animate-spin" />
                                <p className="text-sm font-medium text-primary-700">
                                    Uploading...
                                </p>
                            </>
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-surface-400 mx-auto mb-3" />
                                <p className="text-sm font-medium text-surface-700">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-surface-500 mt-1">
                                    PNG, JPG, WebP up to 5MB. Recommended: 800×800px
                                </p>
                            </>
                        )}
                    </div>

                    {uploadError && (
                        <p className="text-xs text-red-600 font-medium">{uploadError}</p>
                    )}
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
                                required
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
                                required
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
                                required
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
