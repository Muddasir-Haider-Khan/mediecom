"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, User, Phone, MapPin, Lock, ArrowRight } from "lucide-react";

export default function B2BRegisterPage() {
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
                    <form className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">Organization Name *</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                <input type="text" className="input-field pl-10" placeholder="Hospital / Pharmacy name" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-surface-700 mb-1 block">Contact Person *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                    <input type="text" className="input-field pl-10" placeholder="Full name" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-surface-700 mb-1 block">Phone *</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                    <input type="tel" className="input-field pl-10" placeholder="+92 300 1234567" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">Address *</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-surface-400" />
                                <textarea className="input-field pl-10 resize-none" rows={2} placeholder="Full business address" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">Email *</label>
                            <input type="email" className="input-field" placeholder="business@email.com" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">Password *</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                <input type="password" className="input-field pl-10" placeholder="Create password" />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary w-full justify-center">
                            Register Client <ArrowRight className="w-4 h-4" />
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
