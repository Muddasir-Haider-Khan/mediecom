"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function B2BLoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-surface-900 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="font-display font-bold text-2xl text-white">B2B Portal Login</h1>
                    <p className="text-sm text-white/60 mt-1">For hospitals & pharmacies</p>
                </div>

                <div className="card p-8">
                    <form className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                <input type="email" className="input-field pl-10" placeholder="organization@email.com" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                <input type={showPassword ? "text" : "password"} className="input-field pl-10 pr-10" placeholder="Enter password" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="btn-primary w-full justify-center">
                            Sign In <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                    <p className="text-center text-xs text-surface-500 mt-4">
                        Need a B2B account?{" "}
                        <Link href="/b2b/register" className="text-primary-700 font-semibold hover:underline">Contact Sales Team</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
