"use client";

import { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Clock, Package, Truck, CheckCircle, FileText, Loader2 } from "lucide-react";

const statusConfig: Record<string, { label: string; class: string; icon: React.ElementType }> = {
    PENDING: { label: "Pending", class: "badge-warning", icon: Clock },
    PROCESSING: { label: "Processing", class: "badge bg-blue-100 text-blue-800", icon: Package },
    SHIPPED: { label: "Shipped", class: "badge bg-purple-100 text-purple-800", icon: Truck },
    DELIVERED: { label: "Delivered", class: "badge-success", icon: CheckCircle },
    CANCELLED: { label: "Cancelled", class: "badge bg-red-100 text-red-800", icon: FileText },
};

export default function B2BOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await fetch("/api/orders?limit=50");
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
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display font-bold text-2xl text-surface-900">Order History</h1>
                <p className="text-sm text-surface-500 mt-1">Track and manage your wholesale orders</p>
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-50">
                                {["Order ID", "Items", "Amount", "Status", "Order Date", "Delivery", "Invoice"].map((h) => (
                                    <th key={h} className="text-left text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-surface-500">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => {
                                    const status = statusConfig[order.status] || statusConfig["PENDING"];
                                    return (
                                        <tr key={order.id} className="hover:bg-surface-50 transition">
                                            <td className="px-6 py-4 text-xs font-semibold text-primary-700">{order.orderNumber}</td>
                                            <td className="px-6 py-4 text-xs text-surface-600">{order.items.length} items</td>
                                            <td className="px-6 py-4 text-xs font-bold text-surface-900">{formatCurrency(order.totalAmount)}</td>
                                            <td className="px-6 py-4"><span className={status.class}>{status.label}</span></td>
                                            <td className="px-6 py-4 text-xs text-surface-500">{formatDate(order.createdAt)}</td>
                                            <td className="px-6 py-4 text-xs text-surface-500">
                                                {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : "TBD"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 transition" disabled>
                                                    <FileText className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
