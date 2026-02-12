"use client";

import { useEffect, useState, useCallback } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  FileText,
  Eye,
  Loader2,
  Search,
  Printer,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Invoice {
  id: string;
  invoiceNumber: string;
  type: string;
  status: string;
  subtotal: number;
  tax: number;
  discount: number;
  shippingCost: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  issuedAt: string;
  dueDate: string | null;
  paidAt: string | null;
  customerName: string;
  organizationName: string | null;
  order: { orderNumber: string; status: string };
  items: { id: string; name: string; quantity: number; unitPrice: number; totalPrice: number }[];
}

const statusConfig: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "badge bg-surface-100 text-surface-600" },
  ISSUED: { label: "Pending", className: "badge-warning" },
  PAID: { label: "Paid", className: "badge-success" },
  OVERDUE: { label: "Overdue", className: "badge bg-red-100 text-red-800" },
  CANCELLED: { label: "Cancelled", className: "badge bg-surface-100 text-surface-600" },
};

const paymentLabels: Record<string, string> = {
  COD: "Cash on Delivery",
  JAZZCASH: "JazzCash",
  BANK_TRANSFER: "Bank Transfer",
};

export default function B2BInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "20" });
      if (searchTerm) params.set("search", searchTerm);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/invoices?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.invoices);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, statusFilter]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const viewInvoiceHTML = (invoiceId: string) => {
    window.open(`/api/invoices/${invoiceId}?format=html`, "_blank");
  };

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
          <p className="text-sm text-surface-500 mt-1">View and download your business invoices</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="input-field pl-9 py-2 text-xs w-full"
          />
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {["all", "ISSUED", "PAID", "OVERDUE"].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition",
              statusFilter === s ? "bg-primary-700 text-white" : "bg-surface-100 text-surface-600 hover:bg-surface-200"
            )}
          >
            {s === "all" ? "All" : statusConfig[s]?.label || s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-50">
                {["Invoice", "Order", "Amount", "Payment", "Status", "Date", "Due", "Actions"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-surface-500">
                    <FileText className="w-10 h-10 text-surface-300 mx-auto mb-3" />
                    <p className="font-medium">No invoices found</p>
                    <p className="text-xs text-surface-400 mt-1">Your invoices will appear here when orders are placed</p>
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => {
                  const sc = statusConfig[inv.status] || statusConfig.ISSUED;
                  return (
                    <tr key={inv.id} className="hover:bg-surface-50 transition">
                      <td className="px-6 py-4 text-xs font-bold text-surface-900">{inv.invoiceNumber}</td>
                      <td className="px-6 py-4 text-xs text-primary-700 font-medium">{inv.order.orderNumber}</td>
                      <td className="px-6 py-4 text-xs font-bold text-surface-900">{formatCurrency(inv.totalAmount)}</td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="text-[10px] text-surface-600 block">{paymentLabels[inv.paymentMethod] || inv.paymentMethod}</span>
                          <span className={cn("text-[10px] font-semibold", inv.paymentStatus === "PAID" ? "text-emerald-600" : "text-amber-600")}>
                            {inv.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className={sc.className}>{sc.label}</span></td>
                      <td className="px-6 py-4 text-xs text-surface-500">{formatDate(inv.issuedAt)}</td>
                      <td className="px-6 py-4 text-xs text-surface-500">{inv.dueDate ? formatDate(inv.dueDate) : "—"}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <button onClick={() => setSelectedInvoice(inv)} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-700 transition" title="View">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => viewInvoiceHTML(inv.id)} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-700 transition" title="Download">
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-3 border-t border-surface-100">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-surface-200 disabled:opacity-40 transition">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-surface-500">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg hover:bg-surface-200 disabled:opacity-40 transition">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-surface-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="font-display font-bold text-lg text-surface-900">{selectedInvoice.invoiceNumber}</h2>
                <p className="text-xs text-surface-500">Order: {selectedInvoice.order.orderNumber}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => viewInvoiceHTML(selectedInvoice.id)} className="btn-primary py-2 px-4 text-xs">
                  <Printer className="w-3.5 h-3.5" /> Print / PDF
                </button>
                <button onClick={() => setSelectedInvoice(null)} className="p-2 rounded-lg hover:bg-surface-100 transition">
                  <X className="w-5 h-5 text-surface-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex gap-2">
                <span className={statusConfig[selectedInvoice.status]?.className || "badge"}>{statusConfig[selectedInvoice.status]?.label}</span>
              </div>

              {/* Items */}
              <div className="border border-surface-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface-50">
                      <th className="text-left text-[10px] font-semibold text-surface-500 uppercase px-4 py-2">Item</th>
                      <th className="text-center text-[10px] font-semibold text-surface-500 uppercase px-4 py-2">Qty</th>
                      <th className="text-right text-[10px] font-semibold text-surface-500 uppercase px-4 py-2">Price</th>
                      <th className="text-right text-[10px] font-semibold text-surface-500 uppercase px-4 py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100">
                    {selectedInvoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2.5 text-xs text-surface-900 font-medium">{item.name}</td>
                        <td className="px-4 py-2.5 text-xs text-surface-600 text-center">{item.quantity}</td>
                        <td className="px-4 py-2.5 text-xs text-surface-600 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-4 py-2.5 text-xs font-bold text-surface-900 text-right">{formatCurrency(item.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="bg-surface-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-xs text-surface-600"><span>Subtotal</span><span>{formatCurrency(selectedInvoice.subtotal)}</span></div>
                {selectedInvoice.shippingCost > 0 && <div className="flex justify-between text-xs text-surface-600"><span>Shipping</span><span>{formatCurrency(selectedInvoice.shippingCost)}</span></div>}
                {selectedInvoice.discount > 0 && <div className="flex justify-between text-xs text-red-600"><span>Discount</span><span>-{formatCurrency(selectedInvoice.discount)}</span></div>}
                <div className="flex justify-between text-base font-bold text-surface-900 pt-2 border-t border-surface-200"><span>Total</span><span>{formatCurrency(selectedInvoice.totalAmount)}</span></div>
              </div>

              {/* Payment Info */}
              <div className="flex justify-between items-center bg-surface-50 rounded-xl p-4">
                <div>
                  <span className="text-xs text-surface-500 block">Payment</span>
                  <span className="text-sm font-medium text-surface-900">{paymentLabels[selectedInvoice.paymentMethod] || selectedInvoice.paymentMethod}</span>
                </div>
                <span className={cn("text-sm font-bold", selectedInvoice.paymentStatus === "PAID" ? "text-emerald-600" : "text-amber-600")}>
                  {selectedInvoice.paymentStatus}
                </span>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-surface-500 block">Issued</span><span className="font-medium text-surface-900">{formatDate(selectedInvoice.issuedAt)}</span></div>
                {selectedInvoice.dueDate && <div><span className="text-surface-500 block">Due</span><span className="font-medium text-surface-900">{formatDate(selectedInvoice.dueDate)}</span></div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
