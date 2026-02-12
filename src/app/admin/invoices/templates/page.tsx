"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Save,
  X,
  Loader2,
  Star,
  Check,
  PaintBucket,
  Type,
  Building,
  Image,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Template {
  id: string;
  name: string;
  type: "B2C" | "B2B";
  isDefault: boolean;
  isActive: boolean;
  version: number;
  companyName: string;
  companyLogo: string | null;
  companyAddress: string | null;
  companyPhone: string | null;
  companyEmail: string | null;
  companyWebsite: string | null;
  headerText: string | null;
  footerText: string | null;
  termsConditions: string | null;
  customNotes: string | null;
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  createdAt: string;
  updatedAt: string;
  _count?: { invoices: number };
}

const emptyTemplate: Omit<Template, "id" | "createdAt" | "updatedAt" | "_count" | "version"> = {
  name: "",
  type: "B2C",
  isDefault: false,
  isActive: true,
  companyName: "MedSurgX",
  companyLogo: null,
  companyAddress: "Islamabad, Pakistan",
  companyPhone: "+92 300 0000000",
  companyEmail: "info@medsurgx.com",
  companyWebsite: "www.medsurgx.com",
  headerText: null,
  footerText: "Thank you for your business!",
  termsConditions: "Payment is due within 30 days of invoice date. Late payments may incur additional charges.",
  customNotes: null,
  primaryColor: "#0f766e",
  accentColor: "#f59e0b",
  fontFamily: "Inter",
};

const fontOptions = ["Inter", "Arial", "Helvetica", "Georgia", "Roboto", "Poppins"];

export default function AdminInvoiceTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"list" | "create" | "edit" | "preview">("list");
  const [currentTemplate, setCurrentTemplate] = useState<any>(null);
  const [previewHtml, setPreviewHtml] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    setLoading(true);
    try {
      const res = await fetch("/api/invoices/templates");
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setLoading(false);
    }
  }

  async function saveTemplate() {
    setSaving(true);
    try {
      const url = currentTemplate.id
        ? `/api/invoices/templates/${currentTemplate.id}`
        : "/api/invoices/templates";
      const method = currentTemplate.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentTemplate),
      });

      if (res.ok) {
        fetchTemplates();
        setMode("list");
        setCurrentTemplate(null);
      }
    } catch (error) {
      console.error("Failed to save template:", error);
    } finally {
      setSaving(false);
    }
  }

  async function deleteTemplate(id: string) {
    if (!confirm("Are you sure you want to delete this template?")) return;
    try {
      const res = await fetch(`/api/invoices/templates/${id}`, { method: "DELETE" });
      if (res.ok) fetchTemplates();
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
  }

  function startCreate() {
    setCurrentTemplate({ ...emptyTemplate });
    setMode("create");
  }

  function startEdit(template: Template) {
    setCurrentTemplate({ ...template });
    setMode("edit");
  }

  function updateField(field: string, value: any) {
    setCurrentTemplate((prev: any) => ({ ...prev, [field]: value }));
  }

  // ─── List View ────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (mode === "list") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-surface-900">Invoice Templates</h1>
            <p className="text-sm text-surface-500 mt-1">Design and manage invoice templates for B2C and B2B</p>
          </div>
          <button onClick={startCreate} className="btn-primary py-2 px-4 text-xs">
            <Plus className="w-4 h-4" /> New Template
          </button>
        </div>

        {templates.length === 0 ? (
          <div className="card p-12 text-center">
            <FileText className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <h2 className="font-display font-bold text-lg text-surface-900 mb-2">No Templates Yet</h2>
            <p className="text-sm text-surface-500 mb-6">Create your first invoice template to start generating professional invoices</p>
            <button onClick={startCreate} className="btn-primary py-2 px-6 text-sm">
              <Plus className="w-4 h-4" /> Create Template
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div key={template.id} className={cn("card p-6 transition", !template.isActive && "opacity-60")}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-surface-900">{template.name}</h3>
                      {template.isDefault && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-amber-400" /> Default
                        </span>
                      )}
                    </div>
                    <span className={cn("badge text-[10px] mt-1", template.type === "B2B" ? "bg-indigo-100 text-indigo-800" : "bg-teal-100 text-teal-800")}>
                      {template.type}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(template)} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 transition" title="Edit">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteTemplate(template.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-600 transition" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-surface-500">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5" />
                    <span>{template.companyName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PaintBucket className="w-3.5 h-3.5" />
                    <div className="flex gap-1.5 items-center">
                      <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: template.primaryColor }} />
                      <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: template.accentColor }} />
                      <span>{template.fontFamily}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />
                    <span>v{template.version} • {template._count?.invoices || 0} invoices</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-surface-100 flex items-center justify-between">
                  <span className="text-[10px] text-surface-400">Updated {formatDate(template.updatedAt)}</span>
                  <span className={cn("text-[10px] font-semibold", template.isActive ? "text-emerald-600" : "text-surface-400")}>
                    {template.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── Create / Edit View ──────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => { setMode("list"); setCurrentTemplate(null); }} className="p-2 rounded-lg hover:bg-surface-100 transition">
            <X className="w-5 h-5 text-surface-500" />
          </button>
          <div>
            <h1 className="font-display font-bold text-xl text-surface-900">
              {mode === "create" ? "New Template" : "Edit Template"}
            </h1>
            <p className="text-xs text-surface-500">
              {mode === "create" ? "Create a new invoice template" : `Editing: ${currentTemplate?.name}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setMode("list"); setCurrentTemplate(null); }} className="btn-ghost py-2 px-4 text-xs">
            Cancel
          </button>
          <button onClick={saveTemplate} disabled={saving || !currentTemplate?.name} className="btn-primary py-2 px-4 text-xs">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {mode === "create" ? "Create Template" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-surface-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-600" /> Basic Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-surface-700 mb-1 block">Template Name *</label>
                <input
                  value={currentTemplate?.name || ""}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="e.g., Standard B2C Invoice"
                  className="input-field py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-surface-700 mb-1 block">Invoice Type</label>
                <select value={currentTemplate?.type || "B2C"} onChange={(e) => updateField("type", e.target.value)} className="input-field py-2 text-sm">
                  <option value="B2C">B2C (Consumer)</option>
                  <option value="B2B">B2B (Business)</option>
                </select>
              </div>
              <div className="flex items-center gap-4 sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={currentTemplate?.isDefault || false} onChange={(e) => updateField("isDefault", e.target.checked)} className="w-4 h-4 rounded text-primary-600" />
                  <span className="text-sm text-surface-700">Set as default template for this type</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={currentTemplate?.isActive !== false} onChange={(e) => updateField("isActive", e.target.checked)} className="w-4 h-4 rounded text-primary-600" />
                  <span className="text-sm text-surface-700">Active</span>
                </label>
              </div>
            </div>
          </div>

          {/* Company Branding */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-surface-900 mb-4 flex items-center gap-2">
              <Building className="w-4 h-4 text-primary-600" /> Company Branding
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-surface-700 mb-1 block">Company Name</label>
                <input value={currentTemplate?.companyName || ""} onChange={(e) => updateField("companyName", e.target.value)} className="input-field py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-surface-700 mb-1 block">Logo URL</label>
                <input value={currentTemplate?.companyLogo || ""} onChange={(e) => updateField("companyLogo", e.target.value || null)} placeholder="https://..." className="input-field py-2 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-surface-700 mb-1 block">Company Address</label>
                <input value={currentTemplate?.companyAddress || ""} onChange={(e) => updateField("companyAddress", e.target.value)} className="input-field py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-surface-700 mb-1 block">Phone</label>
                <input value={currentTemplate?.companyPhone || ""} onChange={(e) => updateField("companyPhone", e.target.value)} className="input-field py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-surface-700 mb-1 block">Email</label>
                <input value={currentTemplate?.companyEmail || ""} onChange={(e) => updateField("companyEmail", e.target.value)} className="input-field py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-surface-700 mb-1 block">Website</label>
                <input value={currentTemplate?.companyWebsite || ""} onChange={(e) => updateField("companyWebsite", e.target.value)} className="input-field py-2 text-sm" />
              </div>
            </div>
          </div>

          {/* Styling */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-surface-900 mb-4 flex items-center gap-2">
              <PaintBucket className="w-4 h-4 text-primary-600" /> Styling
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-surface-700 mb-1 block">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={currentTemplate?.primaryColor || "#0f766e"} onChange={(e) => updateField("primaryColor", e.target.value)} className="w-10 h-10 rounded-lg border cursor-pointer" />
                  <input value={currentTemplate?.primaryColor || "#0f766e"} onChange={(e) => updateField("primaryColor", e.target.value)} className="input-field py-2 text-sm flex-1" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-surface-700 mb-1 block">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={currentTemplate?.accentColor || "#f59e0b"} onChange={(e) => updateField("accentColor", e.target.value)} className="w-10 h-10 rounded-lg border cursor-pointer" />
                  <input value={currentTemplate?.accentColor || "#f59e0b"} onChange={(e) => updateField("accentColor", e.target.value)} className="input-field py-2 text-sm flex-1" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-surface-700 mb-1 block">Font Family</label>
                <select value={currentTemplate?.fontFamily || "Inter"} onChange={(e) => updateField("fontFamily", e.target.value)} className="input-field py-2 text-sm">
                  {fontOptions.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-surface-900 mb-4 flex items-center gap-2">
              <Type className="w-4 h-4 text-primary-600" /> Content
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-surface-700 mb-1 block">Header Text</label>
                <textarea
                  value={currentTemplate?.headerText || ""}
                  onChange={(e) => updateField("headerText", e.target.value || null)}
                  placeholder="Text displayed below the header banner..."
                  rows={2}
                  className="input-field py-2 text-sm resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-surface-700 mb-1 block">Footer Text</label>
                <textarea
                  value={currentTemplate?.footerText || ""}
                  onChange={(e) => updateField("footerText", e.target.value || null)}
                  placeholder="e.g., Thank you for your business!"
                  rows={2}
                  className="input-field py-2 text-sm resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-surface-700 mb-1 block">Custom Notes</label>
                <textarea
                  value={currentTemplate?.customNotes || ""}
                  onChange={(e) => updateField("customNotes", e.target.value || null)}
                  placeholder="Additional notes for every invoice..."
                  rows={2}
                  className="input-field py-2 text-sm resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-surface-700 mb-1 block">Terms & Conditions</label>
                <textarea
                  value={currentTemplate?.termsConditions || ""}
                  onChange={(e) => updateField("termsConditions", e.target.value || null)}
                  placeholder="Payment terms, refund policy, etc."
                  rows={3}
                  className="input-field py-2 text-sm resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <h3 className="font-display font-semibold text-surface-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary-600" /> Live Preview
            </h3>
            <div className="card overflow-hidden" style={{ transform: "scale(0.85)", transformOrigin: "top left", width: "117.6%" }}>
              {/* Mini Invoice Preview */}
              <div style={{ background: `linear-gradient(135deg, ${currentTemplate?.primaryColor || "#0f766e"}, ${currentTemplate?.primaryColor || "#0f766e"}dd)`, padding: "16px 20px", color: "white" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: 800, fontFamily: currentTemplate?.fontFamily || "Inter" }}>
                      {currentTemplate?.companyName || "MedSurgX"}
                    </div>
                    <div style={{ fontSize: "9px", opacity: 0.8, marginTop: 2 }}>
                      {currentTemplate?.companyAddress || "Islamabad, Pakistan"}
                    </div>
                    <div style={{ fontSize: "9px", opacity: 0.8 }}>
                      {currentTemplate?.companyPhone} | {currentTemplate?.companyEmail}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "8px", textTransform: "uppercase", letterSpacing: "1.5px", opacity: 0.7 }}>Invoice</div>
                    <div style={{ fontSize: "14px", fontWeight: 800 }}>INV-SAMPLE-001</div>
                    <div style={{ display: "inline-block", padding: "2px 10px", borderRadius: "12px", fontSize: "9px", fontWeight: 700, marginTop: 4, background: "#dcfce7", color: "#166534" }}>
                      PAID
                    </div>
                  </div>
                </div>
                {currentTemplate?.headerText && (
                  <div style={{ marginTop: 8, fontSize: "9px", opacity: 0.8, borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 6 }}>
                    {currentTemplate.headerText}
                  </div>
                )}
              </div>

              <div style={{ padding: "12px 20px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "8px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#94a3b8", fontWeight: 700, marginBottom: 4 }}>Bill To</div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#0f172a" }}>Sample Customer</div>
                  <div style={{ fontSize: "9px", color: "#64748b" }}>Islamabad, Pakistan</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "8px", color: "#94a3b8", fontWeight: 700 }}>ORDER</div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: currentTemplate?.primaryColor || "#0f766e" }}>MSX-SAMPLE</div>
                  <div style={{ fontSize: "8px", color: "#94a3b8", fontWeight: 700, marginTop: 6 }}>TYPE</div>
                  <div style={{ display: "inline-block", padding: "1px 8px", borderRadius: "8px", fontSize: "8px", fontWeight: 700, background: currentTemplate?.type === "B2B" ? "#e0e7ff" : "#f0fdfa", color: currentTemplate?.type === "B2B" ? "#3730a3" : (currentTemplate?.primaryColor || "#0f766e") }}>
                    {currentTemplate?.type || "B2C"}
                  </div>
                </div>
              </div>

              {/* Sample items */}
              <div style={{ padding: "12px 20px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9px" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      <th style={{ textAlign: "left", padding: "6px 8px", color: "#94a3b8", fontSize: "8px", fontWeight: 700, borderBottom: "1px solid #e2e8f0" }}>#</th>
                      <th style={{ textAlign: "left", padding: "6px 8px", color: "#94a3b8", fontSize: "8px", fontWeight: 700, borderBottom: "1px solid #e2e8f0" }}>Item</th>
                      <th style={{ textAlign: "center", padding: "6px 8px", color: "#94a3b8", fontSize: "8px", fontWeight: 700, borderBottom: "1px solid #e2e8f0" }}>Qty</th>
                      <th style={{ textAlign: "right", padding: "6px 8px", color: "#94a3b8", fontSize: "8px", fontWeight: 700, borderBottom: "1px solid #e2e8f0" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td style={{ padding: "6px 8px", borderBottom: "1px solid #f1f5f9" }}>1</td><td style={{ padding: "6px 8px", borderBottom: "1px solid #f1f5f9", fontWeight: 600 }}>Medical Gloves</td><td style={{ padding: "6px 8px", textAlign: "center", borderBottom: "1px solid #f1f5f9" }}>2</td><td style={{ padding: "6px 8px", textAlign: "right", fontWeight: 700, borderBottom: "1px solid #f1f5f9" }}>PKR 1,200</td></tr>
                    <tr><td style={{ padding: "6px 8px", borderBottom: "1px solid #f1f5f9" }}>2</td><td style={{ padding: "6px 8px", borderBottom: "1px solid #f1f5f9", fontWeight: 600 }}>Face Mask N95</td><td style={{ padding: "6px 8px", textAlign: "center", borderBottom: "1px solid #f1f5f9" }}>5</td><td style={{ padding: "6px 8px", textAlign: "right", fontWeight: 700, borderBottom: "1px solid #f1f5f9" }}>PKR 2,500</td></tr>
                  </tbody>
                </table>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                  <div style={{ width: "140px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#64748b", padding: "3px 0" }}><span>Subtotal</span><span style={{ fontWeight: 600 }}>PKR 3,700</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#64748b", padding: "3px 0" }}><span>Shipping</span><span style={{ fontWeight: 600 }}>PKR 250</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 800, color: "#0f172a", padding: "6px 0", marginTop: 4, borderTop: `2px solid ${currentTemplate?.primaryColor || "#0f766e"}` }}><span>Total</span><span>PKR 3,950</span></div>
                  </div>
                </div>
              </div>

              {/* Footer preview */}
              <div style={{ padding: "10px 20px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", textAlign: "center" }}>
                {currentTemplate?.footerText && <div style={{ fontSize: "9px", color: "#64748b", marginBottom: 4 }}>{currentTemplate.footerText}</div>}
                <div style={{ fontSize: "8px", color: "#94a3b8" }}>{currentTemplate?.companyName} | {currentTemplate?.companyAddress}</div>
              </div>
            </div>

            {/* Placeholder info */}
            <div className="card p-4">
              <h4 className="text-xs font-semibold text-surface-700 mb-2">Available Placeholders</h4>
              <div className="text-[10px] text-surface-500 space-y-1">
                <p>Dynamic fields auto-filled per invoice:</p>
                <div className="grid grid-cols-2 gap-1 mt-2">
                  {[
                    "Customer Name", "Customer Email", "Customer Address",
                    "Invoice Number", "Order Number", "Issue Date",
                    "Due Date", "Items List", "Subtotal",
                    "Tax", "Total", "Payment Method"
                  ].map((p) => (
                    <span key={p} className="bg-surface-100 px-2 py-0.5 rounded text-[10px] text-surface-600">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
