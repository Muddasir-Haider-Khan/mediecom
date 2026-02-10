"use client";

import { useEffect, useState } from "react";
import { Plus, Upload, Link2, X, Edit, Trash2, Building2 } from "lucide-react";

const mockSupplyChains = [
    { id: "1", name: "MedTech Supplies Co.", productsCount: 45 },
    { id: "2", name: "Global Surgical International", productsCount: 32 },
    { id: "3", name: "HealthCare Direct Pakistan", productsCount: 28 },
    { id: "4", name: "Prime Medical Solutions", productsCount: 18 },
];

export default function SupplyChainsPage() {
    const [supplyChains, setSupplyChains] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchSupplyChains();
    }, []);

    async function fetchSupplyChains() {
        try {
            const res = await fetch("/api/supply-chains");
            if (res.ok) {
                const data = await res.json();
                setSupplyChains(data);
            }
        } catch (error) {
            console.error("Failed to fetch supply chains", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit() {
        if (!newName) return;
        setSubmitting(true);
        try {
            const res = await fetch("/api/supply-chains", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName }),
            });
            if (res.ok) {
                setIsFormOpen(false);
                setNewName("");
                fetchSupplyChains();
            }
        } catch (error) {
            console.error("Failed to create supply chain", error);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display font-bold text-2xl text-surface-900">Supply Chains</h1>
                    <p className="text-sm text-surface-500 mt-1">Manage your product supply chain sources</p>
                </div>
                <button onClick={() => setIsFormOpen(true)} className="btn-primary">
                    <Plus className="w-4 h-4" /> Add Supply Chain
                </button>
            </div>

            {isFormOpen && (
                <div className="card p-6 animate-slide-up border-2 border-primary-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display font-semibold text-sm">New Supply Chain</h2>
                        <button onClick={() => setIsFormOpen(false)} className="text-surface-400 hover:text-surface-600">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">Name *</label>
                            <input value={newName} onChange={(e) => setNewName(e.target.value)} className="input-field" placeholder="Supply chain name" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">Logo</label>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg border-2 border-dashed border-surface-300 flex items-center justify-center cursor-pointer hover:border-primary-400 transition">
                                    <Upload className="w-4 h-4 text-surface-400" />
                                </div>
                                <span className="text-xs text-surface-500">Upload logo</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setIsFormOpen(false)} className="btn-ghost text-xs">Cancel</button>
                        <button onClick={handleSubmit} disabled={submitting} className="btn-primary text-xs">
                            <Plus className="w-3 h-3" /> {submitting ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <p className="text-surface-500">Loading supply chains...</p>
                ) : supplyChains.length === 0 ? (
                    <p className="text-surface-500">No supply chains found.</p>
                ) : (
                    supplyChains.map((sc) => (
                        <div key={sc.id} className="card p-6 hover:shadow-lg transition">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-primary-600" />
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 transition">
                                        <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button className="p-1.5 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-600 transition">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-display font-bold text-sm text-surface-900">{sc.name}</h3>
                            <div className="flex items-center gap-1.5 mt-2 text-xs text-surface-500">
                                <Link2 className="w-3.5 h-3.5" /> {sc._count?.products || 0} products
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
