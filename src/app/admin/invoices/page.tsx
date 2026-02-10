"use client";

import { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FileText, Download, Eye, Loader2, Search } from "lucide-react";

const statusColors: Record<string, string> = {
    PAID: "badge-success",
    PENDING: "badge-warning",
    OVERDUE: "badge bg-red-100 text-red-800",
};

export default function AdminInvoicesPage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchInvoices() {
            try {
                // Fetch orders first to simulate invoices (since we don't have a separate invoice API yet)
                // In a real scenario, this would be /api/invoices
                const res = await fetch("/api/orders?limit=100");
                if (res.ok) {
                    const data = await res.json();

                    // Transform orders to invoices
                    // We'll filter for orders that are SHIPPED or DELIVERED to assume an invoice exists
                    const simulatedInvoices = data.orders
                        .filter((order: any) => ["SHIPPED", "DELIVERED", "PROCESSING"].includes(order.status))
                        .map((order: any) => ({
                            id: `INV-${order.orderNumber}`,
                            orderNumber: order.orderNumber,
                            customer: order.user?.name || order.user?.email || "Unknown Customer",
                            amount: order.totalAmount,
                            status: order.status === "DELIVERED" ? "PAID" : "PENDING",
                            date: order.createdAt,
                            dueDate: new Date(new Date(order.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                        }));

                    setInvoices(simulatedInvoices);
                }
            } catch (error) {
                console.error("Failed to fetch invoices", error);
            } finally {
                setLoading(false);
            }
        }
        fetchInvoices();
    }, []);

    const filteredInvoices = invoices.filter(inv =>
        inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display font-bold text-2xl text-surface-900">Invoices</h1>
                    <p className="text-sm text-surface-500 mt-1">Manage and track customer invoices</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input
                        type="text"
                        placeholder="Search invoices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-white border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 w-full sm:w-64"
                    />
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-50">
                                {["Invoice ID", "Order", "Customer", "Amount", "Status", "Issued Date", "Due Date", "Actions"].map((h) => (
                                    <th key={h} className="text-left text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-sm text-surface-500">
                                        No invoices found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredInvoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-surface-50 transition">
                                        <td className="px-6 py-4 text-xs font-semibold text-surface-900">{inv.id}</td>
                                        <td className="px-6 py-4 text-xs text-primary-700 font-medium">{inv.orderNumber}</td>
                                        <td className="px-6 py-4 text-xs text-surface-600">{inv.customer}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-surface-900">{formatCurrency(inv.amount)}</td>
                                        <td className="px-6 py-4"><span className={statusColors[inv.status] || "badge"}>{inv.status}</span></td>
                                        <td className="px-6 py-4 text-xs text-surface-500">{formatDate(inv.date)}</td>
                                        <td className="px-6 py-4 text-xs text-surface-500">{formatDate(inv.dueDate)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1">
                                                <button className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 transition" title="View Details">
                                                    <Eye className="w-3.5 h-3.5" />
                                                </button>
                                                <button className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 transition" title="Download PDF">
                                                    <Download className="w-3.5 h-3.5" />
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
