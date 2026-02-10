"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingCart, FileText, TrendingUp, ArrowUpRight, Loader2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusColors: Record<string, string> = {
    PENDING: "badge bg-yellow-100 text-yellow-800",
    PROCESSING: "badge bg-blue-100 text-blue-800",
    SHIPPED: "badge bg-purple-100 text-purple-800",
    DELIVERED: "badge-success",
    CANCELLED: "badge bg-red-100 text-red-800",
};

export default function B2BDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [organization, setOrganization] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [statsRes, ordersRes] = await Promise.all([
                    fetch("/api/b2b/stats"),
                    fetch("/api/orders?limit=5")
                ]);

                if (statsRes.ok) {
                    const data = await statsRes.json();
                    setStats(data.stats);
                    setOrganization(data.organization);
                }

                if (ordersRes.ok) {
                    const data = await ordersRes.json();
                    setOrders(data.orders);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    const statCards = [
        { label: "Total Orders", value: stats?.totalOrders || 0, change: "All time", icon: ShoppingCart, color: "text-blue-600 bg-blue-50" },
        { label: "Total Spent", value: formatCurrency(stats?.totalSpent || 0), change: "Lifetime value", icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
        { label: "Products Ordered", value: stats?.productsOrdered || 0, change: "Total quantity", icon: Package, color: "text-purple-600 bg-purple-50" },
        { label: "Pending Orders", value: stats?.pendingOrders || 0, change: "Need attention", icon: FileText, color: "text-amber-600 bg-amber-50" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display font-bold text-2xl text-surface-900">Dashboard</h1>
                <p className="text-sm text-surface-500 mt-1">
                    Welcome back, {organization?.name || "Partner"}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
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
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-surface-500">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-surface-50 transition">
                                        <td className="px-6 py-4 text-xs font-semibold text-primary-700">{order.orderNumber}</td>
                                        <td className="px-6 py-4 text-xs text-surface-600">{order.items.length} items</td>
                                        <td className="px-6 py-4 text-xs font-bold text-surface-900">{formatCurrency(order.totalAmount)}</td>
                                        <td className="px-6 py-4"><span className={statusColors[order.status] || "badge"}>{order.status}</span></td>
                                        <td className="px-6 py-4 text-xs text-surface-500">{formatDate(order.createdAt)}</td>
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
