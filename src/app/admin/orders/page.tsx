"use client";

import { useState } from "react";
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

const mockOrders = [
    {
        id: "MSX-K1ABCD-XY12",
        customer: "Dr. Ahmed Khan",
        email: "ahmed@hospital.com",
        type: "B2C",
        amount: 45000,
        items: 3,
        status: "DELIVERED",
        date: "2026-02-08",
        rider: "Hassan",
    },
    {
        id: "MSX-K2EFGH-AB34",
        customer: "City Hospital Lahore",
        email: "procurement@cityhospital.pk",
        type: "B2B",
        amount: 1285000,
        items: 15,
        status: "SHIPPED",
        date: "2026-02-09",
        rider: "Ali",
    },
    {
        id: "MSX-K3IJKL-CD56",
        customer: "Sara Medical Store",
        email: "sara@medical.pk",
        type: "B2B",
        amount: 92000,
        items: 8,
        status: "PROCESSING",
        date: "2026-02-10",
        rider: null,
    },
    {
        id: "MSX-K4MNOP-EF78",
        customer: "Dr. Fatima Noor",
        email: "fatima@clinic.pk",
        type: "B2C",
        amount: 18500,
        items: 1,
        status: "PENDING",
        date: "2026-02-10",
        rider: null,
    },
    {
        id: "MSX-K5QRST-GH90",
        customer: "National Hospital",
        email: "orders@national.pk",
        type: "B2B",
        amount: 3450000,
        items: 25,
        status: "PROCESSING",
        date: "2026-02-10",
        rider: null,
    },
];

const statusConfig: Record<string, { label: string; class: string; icon: React.ElementType }> = {
    PENDING: { label: "Pending", class: "badge-warning", icon: Clock },
    PROCESSING: { label: "Processing", class: "badge bg-blue-100 text-blue-800", icon: Package },
    SHIPPED: { label: "Shipped", class: "badge bg-purple-100 text-purple-800", icon: Truck },
    DELIVERED: { label: "Delivered", class: "badge-success", icon: CheckCircle },
};

const riders = ["Hassan", "Ali", "Omar", "Bilal", "Imran"];

export default function AdminOrdersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredOrders = mockOrders.filter((o) => {
        const matchesSearch =
            o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.customer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

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
                    const count = mockOrders.filter((o) => o.status === key).length;
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
                                {["Order ID", "Customer", "Type", "Amount", "Items", "Status", "Rider", "Actions"].map(
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
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-surface-50 transition">
                                    <td className="px-6 py-4 text-xs font-semibold text-primary-700">
                                        {order.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs font-semibold text-surface-900">
                                            {order.customer}
                                        </p>
                                        <p className="text-[10px] text-surface-500">{order.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`badge text-[10px] ${order.type === "B2B"
                                                    ? "bg-primary-100 text-primary-800"
                                                    : "bg-surface-100 text-surface-800"
                                                }`}
                                        >
                                            {order.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-semibold text-surface-900">
                                        {formatCurrency(order.amount)}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-surface-600">
                                        {order.items}
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            defaultValue={order.status}
                                            className="text-[10px] font-semibold rounded-full px-2 py-1 border-0 bg-surface-100 focus:ring-2 focus:ring-primary-500/20"
                                        >
                                            {Object.entries(statusConfig).map(([key, config]) => (
                                                <option key={key} value={key}>
                                                    {config.label}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            defaultValue={order.rider || ""}
                                            className="text-[10px] font-medium rounded-full px-2 py-1 border-0 bg-surface-100 focus:ring-2 focus:ring-primary-500/20"
                                        >
                                            <option value="">Assign Rider</option>
                                            {riders.map((r) => (
                                                <option key={r} value={r}>
                                                    {r}
                                                </option>
                                            ))}
                                        </select>
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
