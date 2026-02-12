"use client";

import { useState, useEffect } from "react";
import { Save, AlertCircle, CheckCircle } from "lucide-react";

export default function LeopardSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState({
    apiKey: "",
    apiSecret: "",
    hubId: "",
    webhookSecret: "",
    isEnabled: true,
    enableB2C: true,
    enableB2B: true,
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      const res = await fetch("/api/leopard/config");
      if (res.ok) {
        const data = await res.json();
        setFormData(data);
      }
    } catch (error) {
      console.error("Failed to fetch config:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/leopard/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Configuration saved successfully" });
      } else {
        const error = await res.json();
        setMessage({ type: "error", text: error.error || "Failed to save configuration" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (loading && !Object.keys(formData).length) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-surface-900">
          Leopard Delivery Configuration
        </h1>
        <p className="text-sm text-surface-500 mt-1">
          Manage Leopard courier API credentials and settings
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`flex items-start gap-3 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-semibold text-sm">{message.text}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="card p-6 space-y-6">
        {/* API Credentials */}
        <div className="space-y-4">
          <h2 className="font-display font-semibold text-sm text-surface-900">
            API Credentials
          </h2>

          <div>
            <label className="text-xs font-semibold text-surface-700 mb-1 block">
              API Key *
            </label>
            <input
              type="password"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleChange}
              className="input-field"
              placeholder="Your Leopard API key"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-surface-700 mb-1 block">
              API Secret *
            </label>
            <input
              type="password"
              name="apiSecret"
              value={formData.apiSecret}
              onChange={handleChange}
              className="input-field"
              placeholder="Your Leopard API secret"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-surface-700 mb-1 block">
              Hub ID *
            </label>
            <input
              type="text"
              name="hubId"
              value={formData.hubId}
              onChange={handleChange}
              className="input-field"
              placeholder="Your Leopard Hub ID"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-surface-700 mb-1 block">
              Webhook Secret (Optional)
            </label>
            <input
              type="password"
              name="webhookSecret"
              value={formData.webhookSecret}
              onChange={handleChange}
              className="input-field"
              placeholder="For validating webhook requests"
            />
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4 border-t pt-6">
          <h2 className="font-display font-semibold text-sm text-surface-900">
            Feature Flags
          </h2>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isEnabled"
              checked={formData.isEnabled}
              onChange={handleChange}
              className="w-4 h-4 rounded border-surface-300 text-primary-600"
            />
            <span className="text-sm text-surface-700">Enable Leopard integration</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="enableB2C"
              checked={formData.enableB2C}
              onChange={handleChange}
              className="w-4 h-4 rounded border-surface-300 text-primary-600"
            />
            <span className="text-sm text-surface-700">Use for B2C orders</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="enableB2B"
              checked={formData.enableB2B}
              onChange={handleChange}
              className="w-4 h-4 rounded border-surface-300 text-primary-600"
            />
            <span className="text-sm text-surface-700">Use for B2B orders</span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </form>
    </div>
  );
}
