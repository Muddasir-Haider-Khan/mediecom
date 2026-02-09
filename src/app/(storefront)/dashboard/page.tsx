"use client";

import Link from "next/link";
import {
    Package,
    Clock,
    CheckCircle,
    Truck,
    User,
    LogOut,
    ChevronRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Mock orders for development
const mockOrders = [
    {
        id: "1",
        orderNumber: "MSX-K1ABCD-XY12",
        status: "DELIVERED" as const,
        totalAmount: 23000,
        createdAt: new Date("2026-02-08"),
        items: [{ name: "Professional Surgical Scissors", quantity: 2, price: 4500 },
        { name: "Digital Stethoscope Pro", quantity: 1, price: 14000 }],
    },
    {
        id: "2",
        orderNumber: "MSX-K2EFGH-AB34",
        status: "SHIPPED" as const,
        totalAmount: 285000,
        createdAt: new Date("2026-02-09"),
        items: [{ name: "ICU Patient Monitor — 7 Parameter", quantity: 1, price: 285000 }],
    },
    {
        id: "3",
        orderNumber: "MSX-K3IJKL-CD56",
        status: "PROCESSING" as const,
        totalAmount: 3500,
        createdAt: new Date("2026-02-10"),
        items: [{ name: "N95 Respirator Mask — Pack of 50", quantity: 1, price: 3500 }],
    },
];

const statusConfig = {
    PENDING: { label: "Pending", icon: Clock, color: "text-amber-600 bg-amber-50" },
    PROCESSING: { label: "Processing", icon: Package, color: "text-blue-600 bg-blue-50" },
    SHIPPED: { label: "Shipped", icon: Truck, color: "text-purple-600 bg-purple-50" },
    DELIVERED: { label: "Delivered", icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
};

export default function CustomerDashboard() {
    return (
        <div className="min-h-screen bg-surface-50">
            {/* Header */}
            <div className="bg-white border-b border-surface-100">
                <div className="container-custom py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="font-display font-bold text-xl text-surface-900">
                                    My Dashboard
                                </h1>
                                <p className="text-sm text-surface-500">Welcome back, Customer</p>
                            </div>
                        </div>
                        <Link href="/" className="btn-ghost text-xs gap-1.5">
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container-custom py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Total Orders", value: "3", icon: Package, color: "text-primary-600 bg-primary-50" },
                        { label: "Delivered", value: "1", icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
                        { label: "In Transit", value: "1", icon: Truck, color: "text-purple-600 bg-purple-50" },
                        { label: "Processing", value: "1", icon: Clock, color: "text-blue-600 bg-blue-50" },
                    ].map((stat) => (
                        <div key={stat.label} className="card p-5">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
                                    <p className="text-xs text-surface-500">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Orders */}
                <div className="card">
                    <div className="p-6 border-b border-surface-100">
                        <h2 className="font-display font-bold text-lg text-surface-900">
                            Recent Orders
                        </h2>
                    </div>
                    <div className="divide-y divide-surface-100">
                        {mockOrders.map((order) => {
                            const status = statusConfig[order.status];
                            return (
                                <Link
                                    key={order.id}
                                    href={`/dashboard/orders/${order.id}`}
                                    className="flex items-center justify-between p-6 hover:bg-surface-50 transition group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl ${status.color} flex items-center justify-center`}>
                                            <status.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-surface-900">
                                                {order.orderNumber}
                                            </p>
                                            <p className="text-xs text-surface-500 mt-0.5">
                                                {order.items.length} item(s) · {order.createdAt.toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-surface-900">
                                                {formatCurrency(order.totalAmount)}
                                            </p>
                                            <span className={`text-[10px] font-semibold ${status.color} px-2 py-0.5 rounded-full`}>
                                                {status.label}
                                            </span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-surface-400 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
