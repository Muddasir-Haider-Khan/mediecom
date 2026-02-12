"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";

export default function TrackPage() {
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (trackingNumber.trim()) {
      router.push(`/track/${trackingNumber.toUpperCase()}`);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl text-surface-900 mb-2">
            Track Your Order
          </h1>
          <p className="text-lg text-surface-600">
            Monitor your shipment status in real-time. Enter your tracking number below.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter tracking number..."
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
              autoFocus
              className="input-field pl-10 text-lg h-12 w-full"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
          </div>
          <button
            type="submit"
            disabled={!trackingNumber.trim()}
            className="btn-primary w-full h-12"
          >
            Track Package
          </button>
        </form>

        {/* Info Cards */}
        <div className="mt-12 space-y-4">
          <div className="card p-4">
            <h3 className="font-semibold text-surface-900 mb-1">📍 Real-Time Updates</h3>
            <p className="text-sm text-surface-600">
              Get live updates on your shipment status and location
            </p>
          </div>
          <div className="card p-4">
            <h3 className="font-semibold text-surface-900 mb-1">🚚 Delivery Timeline</h3>
            <p className="text-sm text-surface-600">
              See estimated delivery dates and tracking history
            </p>
          </div>
          <div className="card p-4">
            <h3 className="font-semibold text-surface-900 mb-1">💬 Support Ready</h3>
            <p className="text-sm text-surface-600">
              Contact us via WhatsApp if you have any questions
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-surface-500">
          <p>Tracking powered by Leopard Courier</p>
        </div>
      </div>
    </div>
  );
}
