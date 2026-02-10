"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, User, Phone, MapPin, Lock, ArrowRight } from "lucide-react";

export default function B2BRegisterPage() {
    const [formData, setFormData] = useState({
        orgName: "",
        contactName: "",
        phone: "",
        address: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/b2b/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/b2b/login?registered=true");
            } else {
                const data = await res.json();
                setError(data.error || "Registration failed");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-surface-900 flex items-center justify-center p-6">
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="font-display font-bold text-2xl text-white">Register B2B Client</h1>
                    <p className="text-sm text-white/60 mt-1">Field representative registration form</p>
                </div>

                <div className="card p-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">Organization Name *</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                <input
                                    required
                                    type="text"
                                    className="input-field pl-10"
                                    placeholder="Hospital / Pharmacy name"
                                    value={formData.orgName}
                                    onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-surface-700 mb-1 block">Contact Person *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                    <input
                                        required
                                        type="text"
                                        className="input-field pl-10"
                                        placeholder="Full name"
                                        value={formData.contactName}
                                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-surface-700 mb-1 block">Phone *</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                    <input
                                        required
                                        type="tel"
                                        className="input-field pl-10"
                                        placeholder="+92 300 1234567"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">Address *</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-surface-400" />
                                <textarea
                                    required
                                    className="input-field pl-10 resize-none"
                                    rows={2}
                                    placeholder="Full business address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">Email *</label>
                            <input
                                required
                                type="email"
                                className="input-field"
                                placeholder="business@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">Password *</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                <input
                                    required
                                    type="password"
                                    className="input-field pl-10"
                                    placeholder="Create password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                            {loading ? "Registering..." : (
                                <>Register Client <ArrowRight className="w-4 h-4 ml-2" /></>
                            )}
                        </button>
                    </form>
                    <p className="text-center text-xs text-surface-500 mt-4">
                        Already registered?{" "}
                        <Link href="/b2b/login" className="text-primary-700 font-semibold hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
