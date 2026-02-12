"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Truck, MapPin, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const statusConfig: Record<string, { color: string; description: string; icon: React.ElementType }> = {
  PENDING: {
    color: "bg-yellow-100 text-yellow-800",
    description: "Order is being prepared",
    icon: Clock,
  },
  CREATED: {
    color: "bg-blue-100 text-blue-800",
    description: "Shipment created and ready for dispatch",
    icon: Truck,
  },
  IN_TRANSIT: {
    color: "bg-indigo-100 text-indigo-800",
    description: "Your package is on its way",
    icon: Truck,
  },
  OUT_FOR_DELIVERY: {
    color: "bg-purple-100 text-purple-800",
    description: "Package is out for delivery today",
    icon: MapPin,
  },
  DELIVERED: {
    color: "bg-emerald-100 text-emerald-800",
    description: "Package delivered successfully",
    icon: CheckCircle2,
  },
  FAILED: {
    color: "bg-red-100 text-red-800",
    description: "Delivery failed, contact support",
    icon: AlertCircle,
  },
  CANCELLED: {
    color: "bg-gray-100 text-gray-800",
    description: "Shipment cancelled",
    icon: AlertCircle,
  },
  RETURNED: {
    color: "bg-orange-100 text-orange-800",
    description: "Package returned to sender",
    icon: AlertCircle,
  },
};

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipment, setShipment] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    setLoading(true);
    setError("");
    setShipment(null);

    try {
      const res = await fetch(`/api/shipments/${trackingNumber}`);
      if (res.ok) {
        const data = await res.json();
        setShipment(data);
      } else if (res.status === 404) {
        setError("Tracking number not found. Please check and try again.");
      } else {
        setError("Failed to retrieve tracking information");
      }
    } catch (error) {
      setError("An error occurred while tracking your package");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const config =
    shipment && statusConfig[shipment.status]
      ? statusConfig[shipment.status]
      : null;
  const Icon = config?.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <h1 className="font-display font-bold text-4xl text-surface-900 mb-2">
            Track Your Order
          </h1>
          <p className="text-lg text-surface-600">
            Enter your tracking number to monitor your shipment status in real-time
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Enter tracking number..."
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                className="input-field pl-10 text-lg h-12"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary h-12 px-6"
            >
              {loading ? "Searching..." : "Track"}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Tracking Result */}
        {shipment && (
          <div className="space-y-6">
            {/* Status Banner */}
            {config && Icon && (
              <div className={`rounded-2xl p-6 text-center ${config.color}`}>
                <div className="flex justify-center mb-4">
                  <Icon className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold mb-2">{shipment.status}</h2>
                <p className="text-sm font-medium opacity-90">{config.description}</p>
              </div>
            )}

            {/* Details Card */}
            <div className="card p-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  Tracking Number
                </p>
                <p className="text-lg font-mono font-bold text-surface-900 mt-1">
                  {shipment.trackingNumber}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  Order Details
                </p>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-surface-600">Order Number:</span>
                    <span className="font-medium text-surface-900">
                      {shipment.order?.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600">Recipient:</span>
                    <span className="font-medium text-surface-900">
                      {shipment.order?.user?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600">Phone:</span>
                    <span className="font-medium text-surface-900">
                      {shipment.order?.user?.phone}
                    </span>
                  </div>
                </div>
              </div>

              {shipment.estimatedDelivery && (
                <div>
                  <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
                    Estimated Delivery
                  </p>
                  <p className="text-lg font-medium text-surface-900 mt-1">
                    {new Date(shipment.estimatedDelivery).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              )}

              {shipment.actualDelivery && (
                <div>
                  <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
                    Delivered On
                  </p>
                  <p className="text-lg font-medium text-emerald-600 mt-1">
                    {new Date(shipment.actualDelivery).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Timeline */}
            {shipment.order?.tracking && shipment.order.tracking.length > 0 && (
              <div className="card p-6 space-y-4">
                <h3 className="font-semibold text-surface-900">Tracking History</h3>
                <div className="space-y-4">
                  {shipment.order.tracking.map(
                    (event: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex gap-4 pb-4 last:pb-0 last:border-0 border-b border-surface-200"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-3 h-3 rounded-full bg-primary-500 mt-1.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-surface-900">
                            {event.message || event.status}
                          </p>
                          {event.location && (
                            <p className="text-sm text-surface-600 mt-1">
                              📍 {event.location}
                            </p>
                          )}
                          <p className="text-xs text-surface-500 mt-2">
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Support */}
            <div className="bg-surface-50 rounded-xl p-4 text-center">
              <p className="text-sm text-surface-600 mb-3">
                Having issues with your shipment?
              </p>
              <Link
                href="https://wa.me/923000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block"
              >
                Contact Support on WhatsApp
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!shipment && !error && !loading && (
          <div className="text-center py-12">
            <Truck className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <p className="text-surface-600">
              Enter your tracking number above to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
