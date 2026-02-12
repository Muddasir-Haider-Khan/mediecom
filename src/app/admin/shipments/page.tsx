"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Truck,
  RefreshCw,
  X,
  Download,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
  CREATED: { color: "bg-blue-100 text-blue-800", icon: Truck },
  IN_TRANSIT: { color: "bg-indigo-100 text-indigo-800", icon: Truck },
  OUT_FOR_DELIVERY: { color: "bg-purple-100 text-purple-800", icon: Truck },
  DELIVERED: { color: "bg-emerald-100 text-emerald-800", icon: CheckCircle2 },
  FAILED: { color: "bg-red-100 text-red-800", icon: AlertCircle },
  CANCELLED: { color: "bg-gray-100 text-gray-800", icon: X },
  RETURNED: { color: "bg-orange-100 text-orange-800", icon: X },
};

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [actingShipmentId, setActingShipmentId] = useState<string | null>(null);

  useEffect(() => {
    fetchShipments();
  }, [search, statusFilter]);

  async function fetchShipments() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: "50",
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      });

      const res = await fetch(`/api/shipments?${params}`);
      if (res.ok) {
        const data = await res.json();
        setShipments(data.shipments);
      }
    } catch (error) {
      console.error("Failed to fetch shipments:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(shipmentId: string, action: string) {
    setActingShipmentId(shipmentId);
    try {
      const res = await fetch(`/api/shipments/${shipmentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        await fetchShipments();
        if (selectedShipment?.trackingNumber === shipmentId) {
          const detailed = await fetch(`/api/shipments/${shipmentId}`);
          if (detailed.ok) {
            setSelectedShipment(await detailed.json());
          }
        }
      }
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setActingShipmentId(null);
    }
  }

  async function viewDetails(shipment: any) {
    try {
      const res = await fetch(`/api/shipments/${shipment.trackingNumber}`);
      if (res.ok) {
        setSelectedShipment(await res.json());
        setShowDetails(true);
      }
    } catch (error) {
      console.error("Failed to fetch details:", error);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-surface-900">Shipments</h1>
        <p className="text-sm text-surface-500 mt-1">
          Manage Leopard courier shipments for all orders
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = shipments.filter((s) => s.status === status).length;
          return (
            <button
              key={status}
              onClick={() =>
                setStatusFilter(statusFilter === status ? null : status)
              }
              className={`card p-3 text-left transition ${
                statusFilter === status
                  ? "ring-2 ring-primary-500"
                  : "hover:bg-surface-50"
              }`}
            >
              <div className="text-xs text-surface-500 mb-1">{status}</div>
              <p className="text-lg font-bold text-surface-900">{count}</p>
            </button>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="card p-4">
        <div className="flex items-center gap-2 bg-surface-100 rounded-lg px-3">
          <Search className="w-4 h-4 text-surface-500" />
          <input
            type="text"
            placeholder="Search by order number or tracking..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent flex-1 py-2 text-sm outline-none"
          />
        </div>
      </div>

      {/* Shipments Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-surface-500">Loading shipments...</div>
        ) : shipments.length === 0 ? (
          <div className="p-8 text-center text-surface-500">
            No shipments found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 border-b border-surface-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-surface-700">
                    Tracking Number
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-surface-700">
                    Order
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-surface-700">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-surface-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-surface-700">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-surface-700">
                    Created
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-surface-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {shipments.map((shipment) => {
                  const config = statusConfig[shipment.status];
                  const Icon = config.icon;

                  return (
                    <tr
                      key={shipment.id}
                      className="hover:bg-surface-50 transition"
                    >
                      <td className="px-4 py-3">
                        <code className="text-xs bg-surface-100 px-2 py-1 rounded">
                          {shipment.trackingNumber}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-surface-900">
                          {shipment.order?.orderNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-surface-900">
                            {shipment.order?.user?.name}
                          </p>
                          <p className="text-xs text-surface-500">
                            {shipment.order?.user?.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {shipment.status}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {formatCurrency(shipment.order?.totalAmount || 0)}
                      </td>
                      <td className="px-4 py-3 text-xs text-surface-500">
                        {new Date(shipment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => viewDetails(shipment)}
                            className="p-1.5 hover:bg-surface-100 rounded transition"
                            title="View details"
                          >
                            <ChevronRight className="w-4 h-4 text-surface-500" />
                          </button>
                          {shipment.status === "FAILED" && (
                            <button
                              onClick={() =>
                                handleAction(shipment.trackingNumber, "retry")
                              }
                              disabled={actingShipmentId === shipment.trackingNumber}
                              className="p-1.5 hover:bg-surface-100 rounded transition disabled:opacity-50"
                              title="Retry shipment"
                            >
                              <RefreshCw className="w-4 h-4 text-surface-500" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetails && selectedShipment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-surface-50 border-b border-surface-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-lg text-surface-900">
                  Shipment Details
                </h2>
                <p className="text-sm text-surface-500">
                  {selectedShipment.trackingNumber}
                </p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-surface-200 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-surface-900">Order Information</h3>
                <div className="grid grid-cols-2 gap-4 bg-surface-50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-surface-500">Order Number</p>
                    <p className="font-medium text-surface-900">
                      {selectedShipment.order?.orderNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500">Amount</p>
                    <p className="font-medium text-surface-900">
                      {formatCurrency(selectedShipment.order?.totalAmount || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500">Customer</p>
                    <p className="font-medium text-surface-900">
                      {selectedShipment.order?.user?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500">Phone</p>
                    <p className="font-medium text-surface-900">
                      {selectedShipment.order?.user?.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipment Status */}
              <div className="space-y-2">
                <h3 className="font-semibold text-surface-900">Shipment Status</h3>
                <div className="bg-surface-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    {statusConfig[selectedShipment.status]?.icon && (
                      <>
                        {(() => {
                          const Icon =
                            statusConfig[selectedShipment.status].icon;
                          return (
                            <div
                              className={`p-2 rounded-full ${
                                statusConfig[selectedShipment.status].color
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                          );
                        })()}
                      </>
                    )}
                    <div>
                      <p className="text-xs text-surface-500">Current Status</p>
                      <p className="font-semibold text-surface-900">
                        {selectedShipment.status}
                      </p>
                    </div>
                  </div>
                  {selectedShipment.statusMessage && (
                    <p className="text-sm text-surface-600 mb-3">
                      {selectedShipment.statusMessage}
                    </p>
                  )}
                  <p className="text-xs text-surface-500">
                    Last Update:{" "}
                    {new Date(
                      selectedShipment.lastStatusUpdate
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                {selectedShipment.labelUrl && (
                  <a
                    href={selectedShipment.labelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download Label
                  </a>
                )}
                {selectedShipment.status === "FAILED" && (
                  <button
                    onClick={() =>
                      handleAction(selectedShipment.trackingNumber, "retry")
                    }
                    disabled={
                      actingShipmentId === selectedShipment.trackingNumber
                    }
                    className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry Shipment
                  </button>
                )}
                {!["DELIVERED", "CANCELLED"].includes(
                  selectedShipment.status
                ) && (
                  <button
                    onClick={() =>
                      handleAction(selectedShipment.trackingNumber, "refresh")
                    }
                    disabled={
                      actingShipmentId === selectedShipment.trackingNumber
                    }
                    className="btn-outline flex items-center gap-2 text-sm disabled:opacity-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh Status
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
