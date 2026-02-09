"use client";

import { useState } from "react";
import { Plus, DollarSign, MessageCircle, Facebook, Instagram, Video } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const channels = [
    { id: "WHATSAPP", label: "WhatsApp", icon: MessageCircle, color: "bg-[#25D366]" },
    { id: "FACEBOOK", label: "Facebook", icon: Facebook, color: "bg-[#1877F2]" },
    { id: "INSTAGRAM", label: "Instagram", icon: Instagram, color: "bg-[#E4405F]" },
    { id: "TIKTOK", label: "TikTok", icon: Video, color: "bg-black" },
];

const mockSales = [
    { id: "1", channel: "WHATSAPP", amount: 45000, notes: "Dr. Ahmed — 3x surgical kits", date: "2026-02-10" },
    { id: "2", channel: "FACEBOOK", amount: 12000, notes: "Lead from FB ad — gloves bulk", date: "2026-02-09" },
    { id: "3", channel: "INSTAGRAM", amount: 8500, notes: "DM order — stethoscope", date: "2026-02-09" },
    { id: "4", channel: "WHATSAPP", amount: 285000, notes: "City Hospital — monitor + bed", date: "2026-02-08" },
    { id: "5", channel: "TIKTOK", amount: 3200, notes: "Viral product — oximeter", date: "2026-02-08" },
];

export default function SalesTrackingPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [channel, setChannel] = useState("WHATSAPP");
    const [amount, setAmount] = useState("");
    const [notes, setNotes] = useState("");

    const totalByChannel = channels.map((ch) => ({
        ...ch,
        total: mockSales.filter((s) => s.channel === ch.id).reduce((sum, s) => sum + s.amount, 0),
        count: mockSales.filter((s) => s.channel === ch.id).length,
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display font-bold text-2xl text-surface-900">Sales Tracking</h1>
                    <p className="text-sm text-surface-500 mt-1">Track manual sales from social media channels</p>
                </div>
                <button onClick={() => setIsFormOpen(true)} className="btn-primary">
                    <Plus className="w-4 h-4" /> Record Sale
                </button>
            </div>

            {/* Channel Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {totalByChannel.map((ch) => (
                    <div key={ch.id} className="card p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-8 h-8 rounded-lg ${ch.color} flex items-center justify-center`}>
                                <ch.icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xs font-semibold text-surface-600">{ch.label}</span>
                        </div>
                        <p className="text-lg font-bold text-surface-900">{formatCurrency(ch.total)}</p>
                        <p className="text-[10px] text-surface-500 mt-0.5">{ch.count} sales recorded</p>
                    </div>
                ))}
            </div>

            {/* Add Sale Form */}
            {isFormOpen && (
                <div className="card p-6 animate-slide-up border-2 border-primary-200">
                    <h2 className="font-display font-semibold text-sm mb-4">Record Manual Sale</h2>
                    <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">Channel</label>
                            <select value={channel} onChange={(e) => setChannel(e.target.value)} className="input-field">
                                {channels.map((ch) => (
                                    <option key={ch.id} value={ch.id}>{ch.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">Amount (PKR)</label>
                            <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" className="input-field" placeholder="Sale amount" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-surface-700 mb-1 block">Notes</label>
                            <input value={notes} onChange={(e) => setNotes(e.target.value)} className="input-field" placeholder="Customer / details" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setIsFormOpen(false)} className="btn-ghost text-xs">Cancel</button>
                        <button className="btn-primary text-xs"><Plus className="w-3 h-3" /> Save Sale</button>
                    </div>
                </div>
            )}

            {/* Sales History */}
            <div className="card overflow-hidden">
                <div className="p-6 border-b border-surface-100">
                    <h3 className="font-display font-bold text-sm">Recent Manual Sales</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-50">
                                {["Channel", "Amount", "Notes", "Date"].map((h) => (
                                    <th key={h} className="text-left text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {mockSales.map((sale) => {
                                const ch = channels.find((c) => c.id === sale.channel)!;
                                return (
                                    <tr key={sale.id} className="hover:bg-surface-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-6 h-6 rounded ${ch.color} flex items-center justify-center`}>
                                                    <ch.icon className="w-3 h-3 text-white" />
                                                </div>
                                                <span className="text-xs font-medium">{ch.label}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-surface-900">{formatCurrency(sale.amount)}</td>
                                        <td className="px-6 py-4 text-xs text-surface-600">{sale.notes}</td>
                                        <td className="px-6 py-4 text-xs text-surface-500">{sale.date}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
