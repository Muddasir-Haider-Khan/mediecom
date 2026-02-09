"use client";

import { formatCurrency } from "@/lib/utils";
import { Clock, Package, Truck, CheckCircle, FileText } from "lucide-react";

const orders = [
    { id: "MSX-B2B-001", items: 15, amount: 1285000, status: "SHIPPED", date: "Feb 9, 2026", delivery: "Feb 11, 2026" },
    { id: "MSX-B2B-002", items: 8, amount: 92000, status: "DELIVERED", date: "Feb 7, 2026", delivery: "Feb 7, 2026" },
    { id: "MSX-B2B-003", items: 25, amount: 3450000, status: "PROCESSING", date: "Feb 10, 2026", delivery: "Feb 12, 2026" },
    { id: "MSX-B2B-004", items: 5, amount: 45000, status: "DELIVERED", date: "Feb 3, 2026", delivery: "Feb 3, 2026" },
    { id: "MSX-B2B-005", items: 12, amount: 780000, status: "DELIVERED", date: "Jan 28, 2026", delivery: "Jan 29, 2026" },
];

const statusConfig: Record<string, { label: string; class: string; icon: React.ElementType }> = {
    PENDING: { label: "Pending", class: "badge-warning", icon: Clock },
    PROCESSING: { label: "Processing", class: "badge bg-blue-100 text-blue-800", icon: Package },
    SHIPPED: { label: "Shipped", class: "badge bg-purple-100 text-purple-800", icon: Truck },
    DELIVERED: { label: "Delivered", class: "badge-success", icon: CheckCircle },
};

export default function B2BOrdersPage() {
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
                            {orders.map((order) => {
                                const status = statusConfig[order.status];
                                return (
                                    <tr key={order.id} className="hover:bg-surface-50 transition">
                                        <td className="px-6 py-4 text-xs font-semibold text-primary-700">{order.id}</td>
                                        <td className="px-6 py-4 text-xs text-surface-600">{order.items}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-surface-900">{formatCurrency(order.amount)}</td>
                                        <td className="px-6 py-4"><span className={status.class}>{status.label}</span></td>
                                        <td className="px-6 py-4 text-xs text-surface-500">{order.date}</td>
                                        <td className="px-6 py-4 text-xs text-surface-500">{order.delivery}</td>
                                        <td className="px-6 py-4">
                                            <button className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 transition">
                                                <FileText className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
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
