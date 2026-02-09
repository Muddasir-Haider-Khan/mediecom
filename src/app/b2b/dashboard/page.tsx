"use client";

import { Package, ShoppingCart, FileText, TrendingUp, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const stats = [
    { label: "Total Orders", value: "48", change: "+5 this month", icon: ShoppingCart, color: "text-blue-600 bg-blue-50" },
    { label: "Total Spent", value: formatCurrency(4850000), change: "+12%", icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
    { label: "Products Ordered", value: "125", change: "Across 48 orders", icon: Package, color: "text-purple-600 bg-purple-50" },
    { label: "Pending Invoices", value: "3", change: formatCurrency(285000), icon: FileText, color: "text-amber-600 bg-amber-50" },
];

const recentOrders = [
    { id: "MSX-B2B-001", items: 15, amount: 1285000, status: "SHIPPED", date: "Feb 9, 2026" },
    { id: "MSX-B2B-002", items: 8, amount: 92000, status: "DELIVERED", date: "Feb 7, 2026" },
    { id: "MSX-B2B-003", items: 25, amount: 3450000, status: "PROCESSING", date: "Feb 10, 2026" },
];

const statusColors: Record<string, string> = {
    PROCESSING: "badge bg-blue-100 text-blue-800",
    SHIPPED: "badge bg-purple-100 text-purple-800",
    DELIVERED: "badge-success",
};

export default function B2BDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display font-bold text-2xl text-surface-900">Dashboard</h1>
                <p className="text-sm text-surface-500 mt-1">Welcome back, City Hospital Lahore</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="card p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-xl font-bold text-surface-900">{stat.value}</p>
                        <p className="text-xs text-surface-500 mt-0.5">{stat.label}</p>
                        <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-0.5">
                            <ArrowUpRight className="w-3 h-3" /> {stat.change}
                        </p>
                    </div>
                ))}
            </div>

            <div className="card overflow-hidden">
                <div className="p-6 border-b border-surface-100">
                    <h3 className="font-display font-bold text-sm">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-50">
                                {["Order ID", "Items", "Amount", "Status", "Date"].map((h) => (
                                    <th key={h} className="text-left text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-surface-50 transition">
                                    <td className="px-6 py-4 text-xs font-semibold text-primary-700">{order.id}</td>
                                    <td className="px-6 py-4 text-xs text-surface-600">{order.items} items</td>
                                    <td className="px-6 py-4 text-xs font-bold text-surface-900">{formatCurrency(order.amount)}</td>
                                    <td className="px-6 py-4"><span className={statusColors[order.status]}>{order.status}</span></td>
                                    <td className="px-6 py-4 text-xs text-surface-500">{order.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
