"use client";

import { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FileText, Download, Eye, Loader2 } from "lucide-react";

const statusColors: Record<string, string> = {
    PAID: "badge-success",
    PENDING: "badge-warning",
    OVERDUE: "badge bg-red-100 text-red-800",
};

export default function B2BInvoicesPage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInvoices() {
            try {
                // In a real app, we would fetch from /api/invoices
                // For now, we simulate invoices based on orders
                const res = await fetch("/api/orders?limit=50");
                if (res.ok) {
                    const data = await res.json();

                    // Transform orders to invoices
                    const transformed = data.orders.map((order: any) => ({
                        id: `INV-${order.orderNumber}`,
                        orderId: order.orderNumber,
                        amount: order.totalAmount,
                        // Simulate payment status based on order status
                        status: order.status === "DELIVERED" ? "PAID" : "PENDING",
                        date: order.createdAt,
                        due: new Date(new Date(order.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days due
                    }));
                    setInvoices(transformed);
                }
            } catch (error) {
                console.error("Failed to fetch invoices", error);
            } finally {
                setLoading(false);
            }
        }
        fetchInvoices();
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
                <h1 className="font-display font-bold text-2xl text-surface-900">Invoices</h1>
                <p className="text-sm text-surface-500 mt-1">View and download your invoices</p>
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-50">
                                {["Invoice", "Order", "Amount", "Status", "Date", "Due", "Actions"].map((h) => (
                                    <th key={h} className="text-left text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-surface-500">
                                        No invoices found.
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-surface-50 transition">
                                        <td className="px-6 py-4 text-xs font-semibold text-surface-900">{inv.id}</td>
                                        <td className="px-6 py-4 text-xs text-primary-700 font-medium">{inv.orderId}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-surface-900">{formatCurrency(inv.amount)}</td>
                                        <td className="px-6 py-4"><span className={statusColors[inv.status] || "badge"}>{inv.status}</span></td>
                                        <td className="px-6 py-4 text-xs text-surface-500">{formatDate(inv.date)}</td>
                                        <td className="px-6 py-4 text-xs text-surface-500">{formatDate(inv.due)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1">
                                                <button className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 transition"><Eye className="w-3.5 h-3.5" /></button>
                                                <button className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 transition" disabled><Download className="w-3.5 h-3.5" /></button>
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
