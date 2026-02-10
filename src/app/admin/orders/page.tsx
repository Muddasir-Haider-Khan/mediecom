"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Search,
    Eye,
    Truck,
    FileText,
    ChevronDown,
    Clock,
    Package,
    CheckCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const statusConfig: Record<string, { label: string; class: string; icon: React.ElementType }> = {
    PENDING: { label: "Pending", class: "badge-warning", icon: Clock },
    PROCESSING: { label: "Processing", class: "badge bg-blue-100 text-blue-800", icon: Package },
    SHIPPED: { label: "Shipped", class: "badge bg-purple-100 text-purple-800", icon: Truck },
    DELIVERED: { label: "Delivered", class: "badge-success", icon: CheckCircle },
};

const riders = ["Hassan", "Ali", "Omar", "Bilal", "Imran"];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            const res = await fetch("/api/orders?limit=100");
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    }

    const filteredOrders = orders.filter((o) => {
        const matchesSearch =
            (o.orderNumber || o.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
            (o.user?.name || "Guest").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) fetchOrders();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display font-bold text-2xl text-surface-900">
                    Orders
                </h1>
                <p className="text-sm text-surface-500 mt-1">
                    Manage all customer and B2B orders
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(statusConfig).map(([key, config]) => {
                    const count = orders.filter((o) => o.status === key).length;
                    return (
                        <button
                            key={key}
                            onClick={() => setStatusFilter(statusFilter === key ? "all" : key)}
                            className={`card p-4 text-left transition ${statusFilter === key ? "ring-2 ring-primary-500" : ""
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <config.icon className="w-4 h-4 text-surface-500" />
                                <span className="text-xs text-surface-500">{config.label}</span>
                            </div>
                            <p className="text-xl font-bold text-surface-900">{count}</p>
                        </button>
                    );
                })}
            </div>

            {/* Search */}
            <div className="card p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by order ID or customer..."
                        className="input-field pl-10 py-2.5"
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-50">
                                {["Order ID", "Customer", "Amount", "Items", "Status", "Date", "Actions"].map(
                                    (h) => (
                                        <th
                                            key={h}
                                            className="text-left text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-6 py-3"
                                        >
                                            {h}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-surface-500">
                                        Loading orders...
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-surface-500">
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-surface-50 transition">
                                        <td className="px-6 py-4 text-xs font-semibold text-primary-700">
                                            {order.orderNumber || order.id.slice(0, 8)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-semibold text-surface-900">
                                                {order.user?.name || "Guest"}
                                            </p>
                                            <p className="text-[10px] text-surface-500">{order.user?.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-semibold text-surface-900">
                                            {formatCurrency(order.totalAmount)}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-surface-600">
                                            {order.items?.length || 0} items
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                className="text-[10px] font-semibold rounded-full px-2 py-1 border-0 bg-surface-100 focus:ring-2 focus:ring-primary-500/20"
                                            >
                                                {Object.entries(statusConfig).map(([key, config]) => (
                                                    <option key={key} value={key}>
                                                        {config.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-surface-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <button className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500 transition">
                                                    <Eye className="w-3.5 h-3.5" />
                                                </button>
                                                <button className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500 transition">
                                                    <FileText className="w-3.5 h-3.5" />
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
