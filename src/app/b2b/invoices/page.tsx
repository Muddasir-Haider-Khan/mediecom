"use client";

import { formatCurrency } from "@/lib/utils";
import { FileText, Download, Eye } from "lucide-react";

const invoices = [
    { id: "INV-2026-001", orderId: "MSX-B2B-001", amount: 1285000, status: "PAID", date: "Feb 9, 2026", due: "Mar 9, 2026" },
    { id: "INV-2026-002", orderId: "MSX-B2B-002", amount: 92000, status: "PAID", date: "Feb 7, 2026", due: "Mar 7, 2026" },
    { id: "INV-2026-003", orderId: "MSX-B2B-003", amount: 3450000, status: "PENDING", date: "Feb 10, 2026", due: "Mar 10, 2026" },
    { id: "INV-2026-004", orderId: "MSX-B2B-004", amount: 45000, status: "PAID", date: "Feb 3, 2026", due: "Mar 3, 2026" },
    { id: "INV-2026-005", orderId: "MSX-B2B-005", amount: 780000, status: "OVERDUE", date: "Jan 28, 2026", due: "Feb 28, 2026" },
];

const statusColors: Record<string, string> = {
    PAID: "badge-success",
    PENDING: "badge-warning",
    OVERDUE: "badge bg-red-100 text-red-800",
};

export default function B2BInvoicesPage() {
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
                            {invoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-surface-50 transition">
                                    <td className="px-6 py-4 text-xs font-semibold text-surface-900">{inv.id}</td>
                                    <td className="px-6 py-4 text-xs text-primary-700 font-medium">{inv.orderId}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-surface-900">{formatCurrency(inv.amount)}</td>
                                    <td className="px-6 py-4"><span className={statusColors[inv.status]}>{inv.status}</span></td>
                                    <td className="px-6 py-4 text-xs text-surface-500">{inv.date}</td>
                                    <td className="px-6 py-4 text-xs text-surface-500">{inv.due}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1">
                                            <button className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 transition"><Eye className="w-3.5 h-3.5" /></button>
                                            <button className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 transition"><Download className="w-3.5 h-3.5" /></button>
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
