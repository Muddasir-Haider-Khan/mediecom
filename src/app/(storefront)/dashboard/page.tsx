"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Package,
    Clock,
    CheckCircle,
    Truck,
    User,
    LogOut,
    ChevronRight,
    Loader2
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusConfig: any = {
    PENDING: { label: "Pending", icon: Clock, color: "text-amber-600 bg-amber-50" },
    PROCESSING: { label: "Processing", icon: Package, color: "text-blue-600 bg-blue-50" },
    SHIPPED: { label: "Shipped", icon: Truck, color: "text-purple-600 bg-purple-50" },
    DELIVERED: { label: "Delivered", icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
    CANCELLED: { label: "Cancelled", icon: LogOut, color: "text-red-600 bg-red-50" },
};

export default function CustomerDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        delivered: 0,
        transit: 0,
        processing: 0,
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/dashboard");
        }
    }, [status, router]);

    useEffect(() => {
        if (status === "authenticated") {
            fetchOrders();
        }
    }, [status]);

    async function fetchOrders() {
        try {
            const res = await fetch("/api/orders?limit=100"); // Fetch recent orders, maybe limit is enough
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders);
                calculateStats(data.orders);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    }

    function calculateStats(orders: any[]) {
        setStats({
            total: orders.length,
            delivered: orders.filter((o) => o.status === "DELIVERED").length,
            transit: orders.filter((o) => o.status === "SHIPPED").length,
            processing: orders.filter((o) => ["PENDING", "PROCESSING"].includes(o.status)).length,
        });
    }

    if (status === "loading" || status === "unauthenticated" || (loading && status === "authenticated")) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

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
                                <p className="text-sm text-surface-500">Welcome back, {session?.user?.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="btn-ghost text-xs gap-1.5"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <div className="container-custom py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Total Orders", value: stats.total, icon: Package, color: "text-primary-600 bg-primary-50" },
                        { label: "Delivered", value: stats.delivered, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
                        { label: "In Transit", value: stats.transit, icon: Truck, color: "text-purple-600 bg-purple-50" },
                        { label: "Processing", value: stats.processing, icon: Clock, color: "text-blue-600 bg-blue-50" },
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
                    {orders.length === 0 ? (
                        <div className="p-8 text-center text-surface-500">
                            No orders found. <Link href="/products" className="text-primary-600 hover:underline">Start shopping</Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-surface-100">
                            {orders.map((order) => {
                                const status = statusConfig[order.status] || statusConfig.PENDING;
                                return (
                                    <Link
                                        key={order.id}
                                        href={`/order-confirmation/${order.id}`} // Using confirmation page as detail for now
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
                                                    {order.items.length} item(s) · {formatDate(order.createdAt)}
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
                    )}
                </div>
            </div>
        </div>
    );
}
