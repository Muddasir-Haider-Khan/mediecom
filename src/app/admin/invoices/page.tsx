"use client";

import { useEffect, useState, useCallback } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  FileText,
  Eye,
  Loader2,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  Printer,
  Building2,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────

interface InvoiceItem {
  id: string;
  name: string;
  description?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  type: "B2C" | "B2B";
  status: "DRAFT" | "ISSUED" | "PAID" | "OVERDUE" | "CANCELLED" | "REFUNDED";
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  shippingCost: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  issuedAt: string;
  dueDate: string | null;
  paidAt: string | null;
  notes: string | null;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  customerAddress: string | null;
  organizationName: string | null;
  order: { orderNumber: string; status: string };
  items: InvoiceItem[];
}

interface Analytics {
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  b2cCount: number;
  b2bCount: number;
  totalRevenue: number;
  pendingRevenue: number;
}

// ─── Status Config ──────────────────────────────────────

const statusConfig: Record<
  string,
  { label: string; className: string; icon: React.ElementType }
> = {
  DRAFT: { label: "Draft", className: "badge bg-surface-100 text-surface-600", icon: FileText },
  ISSUED: { label: "Issued", className: "badge-warning", icon: Clock },
  PAID: { label: "Paid", className: "badge-success", icon: CheckCircle },
  OVERDUE: { label: "Overdue", className: "badge bg-red-100 text-red-800", icon: AlertTriangle },
  CANCELLED: { label: "Cancelled", className: "badge bg-surface-100 text-surface-600", icon: X },
  REFUNDED: { label: "Refunded", className: "badge bg-purple-100 text-purple-800", icon: RefreshCw },
};

const paymentLabels: Record<string, string> = {
  COD: "Cash on Delivery",
  JAZZCASH: "JazzCash",
  BANK_TRANSFER: "Bank Transfer",
};

// ─── Component ──────────────────────────────────────────

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        analytics: "true",
      });

      if (searchTerm) params.set("search", searchTerm);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (typeFilter !== "all") params.set("type", typeFilter);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);

      const res = await fetch(`/api/invoices?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.invoices);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
        if (data.analytics) setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, statusFilter, typeFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const updateInvoiceStatus = async (invoiceId: string, newStatus: string) => {
    setActionLoading(invoiceId);
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchInvoices();
      }
    } catch (error) {
      console.error("Failed to update invoice status:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const viewInvoiceHTML = (invoiceId: string) => {
    window.open(`/api/invoices/${invoiceId}?format=html`, "_blank");
  };

  const openPreview = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPreview(true);
  };

  const analyticsCards = analytics
    ? [
        {
          label: "Total Invoices",
          value: analytics.totalInvoices,
          icon: FileText,
          color: "bg-primary-50 text-primary-600",
        },
        {
          label: "Paid",
          value: analytics.paidInvoices,
          subtext: formatCurrency(analytics.totalRevenue),
          icon: CheckCircle,
          color: "bg-emerald-50 text-emerald-600",
        },
        {
          label: "Pending",
          value: analytics.pendingInvoices,
          subtext: formatCurrency(analytics.pendingRevenue),
          icon: Clock,
          color: "bg-amber-50 text-amber-600",
        },
        {
          label: "Overdue",
          value: analytics.overdueInvoices,
          icon: AlertTriangle,
          color: "bg-red-50 text-red-600",
        },
      ]
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-surface-900">Invoices</h1>
          <p className="text-sm text-surface-500 mt-1">Manage, track, and download customer invoices</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "btn-outline py-2 px-4 text-xs",
              showFilters && "border-primary-500 text-primary-700 bg-primary-50"
            )}
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
          </button>
          <button onClick={fetchInvoices} className="btn-ghost py-2 px-4 text-xs">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Analytics */}
      {analyticsCards && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {analyticsCards.map((card) => (
            <div key={card.label} className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("p-1.5 rounded-lg", card.color)}>
                  <card.icon className="w-4 h-4" />
                </div>
                <span className="text-xs text-surface-500 font-medium">{card.label}</span>
              </div>
              <p className="text-2xl font-bold text-surface-900">{card.value}</p>
              {card.subtext && (
                <p className="text-xs text-surface-500 mt-0.5">{card.subtext}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* B2C/B2B Split */}
      {analytics && (
        <div className="flex gap-4">
          <button
            onClick={() => { setTypeFilter(typeFilter === "B2C" ? "all" : "B2C"); setPage(1); }}
            className={cn("card p-3 px-5 flex items-center gap-2 transition", typeFilter === "B2C" && "ring-2 ring-primary-500")}
          >
            <User className="w-4 h-4 text-primary-600" />
            <span className="text-xs font-medium text-surface-600">B2C</span>
            <span className="text-sm font-bold text-surface-900">{analytics.b2cCount}</span>
          </button>
          <button
            onClick={() => { setTypeFilter(typeFilter === "B2B" ? "all" : "B2B"); setPage(1); }}
            className={cn("card p-3 px-5 flex items-center gap-2 transition", typeFilter === "B2B" && "ring-2 ring-primary-500")}
          >
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-medium text-surface-600">B2B</span>
            <span className="text-sm font-bold text-surface-900">{analytics.b2bCount}</span>
          </button>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="card p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-surface-700 mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  placeholder="Invoice ID, order, customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-9 py-2 text-xs"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-surface-700 mb-1 block">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="input-field py-2 text-xs"
              >
                <option value="all">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="ISSUED">Issued</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-surface-700 mb-1 block">From Date</label>
              <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className="input-field py-2 text-xs" />
            </div>
            <div>
              <label className="text-xs font-semibold text-surface-700 mb-1 block">To Date</label>
              <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} className="input-field py-2 text-xs" />
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <button
              onClick={() => { setSearchTerm(""); setStatusFilter("all"); setTypeFilter("all"); setDateFrom(""); setDateTo(""); setPage(1); }}
              className="text-xs text-surface-500 hover:text-surface-700 transition"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Quick Search */}
      {!showFilters && (
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 py-2 text-xs"
          />
        </div>
      )}

      {/* Status Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {["all", "ISSUED", "PAID", "OVERDUE", "CANCELLED"].map((s) => (
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

      {/* Loading */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-50">
                    {["Invoice", "Order", "Customer", "Type", "Amount", "Payment", "Status", "Issued", "Due", "Actions"].map((h) => (
                      <th key={h} className="text-left text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-12 text-center text-sm text-surface-500">
                        <FileText className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                        <p className="font-medium">No invoices found</p>
                        <p className="text-xs text-surface-400 mt-1">Invoices are generated automatically when orders are placed</p>
                      </td>
                    </tr>
                  ) : (
                    invoices.map((inv) => {
                      const sc = statusConfig[inv.status] || statusConfig.ISSUED;
                      return (
                        <tr key={inv.id} className="hover:bg-surface-50 transition">
                          <td className="px-4 py-3"><span className="text-xs font-bold text-surface-900">{inv.invoiceNumber}</span></td>
                          <td className="px-4 py-3"><span className="text-xs text-primary-700 font-medium">{inv.order.orderNumber}</span></td>
                          <td className="px-4 py-3">
                            <div>
                              <span className="text-xs font-medium text-surface-900 block">{inv.customerName}</span>
                              {inv.organizationName && <span className="text-[10px] text-surface-500">{inv.organizationName}</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn("badge text-[10px]", inv.type === "B2B" ? "bg-indigo-100 text-indigo-800" : "bg-teal-100 text-teal-800")}>{inv.type}</span>
                          </td>
                          <td className="px-4 py-3"><span className="text-xs font-bold text-surface-900">{formatCurrency(inv.totalAmount)}</span></td>
                          <td className="px-4 py-3">
                            <div>
                              <span className="text-[10px] text-surface-600 block">{paymentLabels[inv.paymentMethod] || inv.paymentMethod}</span>
                              <span className={cn("text-[10px] font-semibold", inv.paymentStatus === "PAID" ? "text-emerald-600" : inv.paymentStatus === "PENDING" ? "text-amber-600" : "text-red-600")}>
                                {inv.paymentStatus}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3"><span className={sc.className}>{sc.label}</span></td>
                          <td className="px-4 py-3 text-xs text-surface-500">{formatDate(inv.issuedAt)}</td>
                          <td className="px-4 py-3 text-xs text-surface-500">{inv.dueDate ? formatDate(inv.dueDate) : "—"}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <button onClick={() => openPreview(inv)} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-700 transition" title="Preview">
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => viewInvoiceHTML(inv.id)} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-700 transition" title="Print / PDF">
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                              {inv.status !== "PAID" && inv.status !== "CANCELLED" && (
                                <button
                                  onClick={() => updateInvoiceStatus(inv.id, "PAID")}
                                  disabled={actionLoading === inv.id}
                                  className="p-1.5 rounded-lg hover:bg-emerald-50 text-surface-400 hover:text-emerald-600 transition"
                                  title="Mark as Paid"
                                >
                                  {actionLoading === inv.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                </button>
                              )}
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
              <div className="flex items-center justify-between px-6 py-3 border-t border-surface-100 bg-surface-50">
                <p className="text-xs text-surface-500">
                  Showing {(page - 1) * 15 + 1}–{Math.min(page * 15, total)} of {total}
                </p>
                <div className="flex gap-1">
                  <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-surface-200 disabled:opacity-40 transition">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <button key={p} onClick={() => setPage(p)} className={cn("w-8 h-8 rounded-lg text-xs font-medium transition", page === p ? "bg-primary-700 text-white" : "hover:bg-surface-200 text-surface-600")}>
                        {p}
                      </button>
                    );
                  })}
                  <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg hover:bg-surface-200 disabled:opacity-40 transition">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Invoice Preview Modal */}
      {showPreview && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-surface-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="font-display font-bold text-lg text-surface-900">{selectedInvoice.invoiceNumber}</h2>
                <p className="text-xs text-surface-500">Order: {selectedInvoice.order.orderNumber}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => viewInvoiceHTML(selectedInvoice.id)} className="btn-primary py-2 px-4 text-xs">
                  <Printer className="w-3.5 h-3.5" /> Print / PDF
                </button>
                <button onClick={() => setShowPreview(false)} className="p-2 rounded-lg hover:bg-surface-100 transition">
                  <X className="w-5 h-5 text-surface-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status & Type */}
              <div className="flex gap-2">
                <span className={statusConfig[selectedInvoice.status]?.className || "badge"}>{statusConfig[selectedInvoice.status]?.label || selectedInvoice.status}</span>
                <span className={cn("badge text-[10px]", selectedInvoice.type === "B2B" ? "bg-indigo-100 text-indigo-800" : "bg-teal-100 text-teal-800")}>{selectedInvoice.type}</span>
              </div>

              {/* Customer */}
              <div className="bg-surface-50 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-surface-500 uppercase mb-2">Customer</h3>
                <p className="font-semibold text-surface-900">{selectedInvoice.customerName}</p>
                {selectedInvoice.organizationName && <p className="text-sm text-surface-600">{selectedInvoice.organizationName}</p>}
                {selectedInvoice.customerEmail && <p className="text-xs text-surface-500">{selectedInvoice.customerEmail}</p>}
                {selectedInvoice.customerPhone && <p className="text-xs text-surface-500">{selectedInvoice.customerPhone}</p>}
                {selectedInvoice.customerAddress && <p className="text-xs text-surface-500 mt-1">{selectedInvoice.customerAddress}</p>}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-surface-500 block">Issued</span>
                  <span className="text-sm font-medium text-surface-900">{formatDate(selectedInvoice.issuedAt)}</span>
                </div>
                {selectedInvoice.dueDate && (
                  <div>
                    <span className="text-xs text-surface-500 block">Due</span>
                    <span className="text-sm font-medium text-surface-900">{formatDate(selectedInvoice.dueDate)}</span>
                  </div>
                )}
                {selectedInvoice.paidAt && (
                  <div>
                    <span className="text-xs text-surface-500 block">Paid</span>
                    <span className="text-sm font-medium text-emerald-700">{formatDate(selectedInvoice.paidAt)}</span>
                  </div>
                )}
              </div>

              {/* Items */}
              <div>
                <h3 className="text-xs font-semibold text-surface-500 uppercase mb-2">Items</h3>
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
              </div>

              {/* Totals */}
              <div className="bg-surface-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-xs text-surface-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                </div>
                {selectedInvoice.tax > 0 && (
                  <div className="flex justify-between text-xs text-surface-600">
                    <span>Tax ({selectedInvoice.taxRate}%)</span>
                    <span>{formatCurrency(selectedInvoice.tax)}</span>
                  </div>
                )}
                {selectedInvoice.shippingCost > 0 && (
                  <div className="flex justify-between text-xs text-surface-600">
                    <span>Shipping</span>
                    <span>{formatCurrency(selectedInvoice.shippingCost)}</span>
                  </div>
                )}
                {selectedInvoice.discount > 0 && (
                  <div className="flex justify-between text-xs text-red-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(selectedInvoice.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-surface-900 pt-2 border-t border-surface-200">
                  <span>Total</span>
                  <span>{formatCurrency(selectedInvoice.totalAmount)}</span>
                </div>
              </div>

              {/* Payment */}
              <div className="flex justify-between items-center bg-surface-50 rounded-xl p-4">
                <div>
                  <span className="text-xs text-surface-500 block">Payment Method</span>
                  <span className="text-sm font-medium text-surface-900">{paymentLabels[selectedInvoice.paymentMethod] || selectedInvoice.paymentMethod}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-surface-500 block">Payment Status</span>
                  <span className={cn("text-sm font-bold", selectedInvoice.paymentStatus === "PAID" ? "text-emerald-600" : selectedInvoice.paymentStatus === "PENDING" ? "text-amber-600" : "text-red-600")}>
                    {selectedInvoice.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedInvoice.status !== "PAID" && selectedInvoice.status !== "CANCELLED" && (
                  <button onClick={() => { updateInvoiceStatus(selectedInvoice.id, "PAID"); setShowPreview(false); }} className="btn-primary py-2 px-4 text-xs">
                    <CheckCircle className="w-3.5 h-3.5" /> Mark as Paid
                  </button>
                )}
                {selectedInvoice.status === "ISSUED" && (
                  <button onClick={() => { updateInvoiceStatus(selectedInvoice.id, "OVERDUE"); setShowPreview(false); }} className="btn-outline py-2 px-4 text-xs text-red-600 border-red-200 hover:border-red-400 hover:text-red-700">
                    <AlertTriangle className="w-3.5 h-3.5" /> Mark Overdue
                  </button>
                )}
                {selectedInvoice.status !== "CANCELLED" && selectedInvoice.status !== "PAID" && (
                  <button onClick={() => { updateInvoiceStatus(selectedInvoice.id, "CANCELLED"); setShowPreview(false); }} className="btn-ghost py-2 px-4 text-xs text-surface-500">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                )}
              </div>

              {selectedInvoice.notes && (
                <div>
                  <h3 className="text-xs font-semibold text-surface-500 uppercase mb-1">Notes</h3>
                  <p className="text-xs text-surface-600">{selectedInvoice.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
