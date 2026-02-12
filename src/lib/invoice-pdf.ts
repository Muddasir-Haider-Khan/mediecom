// ─── Server-side HTML-based Invoice PDF Generator ───────
// Generates a professional HTML invoice that can be printed/saved as PDF from the browser

import { formatCurrency, formatDate } from "@/lib/utils";

interface InvoiceData {
  invoiceNumber: string;
  type: string;
  status: string;
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  shippingCost: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  issuedAt: string | Date;
  dueDate?: string | Date | null;
  paidAt?: string | Date | null;
  notes?: string | null;
  termsConditions?: string | null;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerAddress?: string | null;
  organizationName?: string | null;
  order: {
    orderNumber: string;
  };
  items: {
    name: string;
    description?: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  template?: {
    companyName: string;
    companyLogo?: string | null;
    companyAddress?: string | null;
    companyPhone?: string | null;
    companyEmail?: string | null;
    companyWebsite?: string | null;
    headerText?: string | null;
    footerText?: string | null;
    termsConditions?: string | null;
    customNotes?: string | null;
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
  } | null;
}

const PAYMENT_LABELS: Record<string, string> = {
  COD: "Cash on Delivery",
  JAZZCASH: "JazzCash",
  BANK_TRANSFER: "Bank Transfer",
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PAID: { bg: "#dcfce7", text: "#166534" },
  ISSUED: { bg: "#fef9c3", text: "#854d0e" },
  PENDING: { bg: "#fef9c3", text: "#854d0e" },
  OVERDUE: { bg: "#fecaca", text: "#991b1b" },
  CANCELLED: { bg: "#f1f5f9", text: "#475569" },
  REFUNDED: { bg: "#e0e7ff", text: "#3730a3" },
  DRAFT: { bg: "#f1f5f9", text: "#475569" },
};

export function generateInvoiceHTML(invoice: InvoiceData): string {
  const template = invoice.template;
  const primaryColor = template?.primaryColor || "#0f766e";
  const accentColor = template?.accentColor || "#f59e0b";
  const fontFamily = template?.fontFamily || "Inter";
  const companyName = template?.companyName || "MedSurgX";
  const companyAddress = template?.companyAddress || "Islamabad, Pakistan";
  const companyPhone = template?.companyPhone || "+92 300 0000000";
  const companyEmail = template?.companyEmail || "info@medsurgx.com";
  const companyWebsite = template?.companyWebsite || "www.medsurgx.com";

  const statusColor = STATUS_COLORS[invoice.status] || STATUS_COLORS.ISSUED;
  const paymentLabel = PAYMENT_LABELS[invoice.paymentMethod] || invoice.paymentMethod;

  const itemsRows = invoice.items
    .map(
      (item, idx) => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 13px;">${idx + 1}</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">
          <div style="color: #0f172a; font-weight: 600; font-size: 13px;">${item.name}</div>
          ${item.description ? `<div style="color: #94a3b8; font-size: 11px; margin-top: 2px;">${item.description.substring(0, 80)}</div>` : ""}
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #334155; font-size: 13px;">${item.quantity}</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; text-align: right; color: #334155; font-size: 13px;">${formatCurrency(item.unitPrice)}</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; text-align: right; color: #0f172a; font-weight: 700; font-size: 13px;">${formatCurrency(item.totalPrice)}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoice.invoiceNumber}</title>
  <link href="https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, "+")}:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: '${fontFamily}', sans-serif; background: #f8fafc; color: #0f172a; }
    @media print {
      body { background: white; }
      .no-print { display: none !important; }
      .invoice-wrapper { box-shadow: none !important; margin: 0 !important; }
    }
  </style>
</head>
<body>
  <!-- Print Button -->
  <div class="no-print" style="text-align: center; padding: 20px; background: #f1f5f9;">
    <button onclick="window.print()" style="padding: 10px 32px; background: ${primaryColor}; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: '${fontFamily}', sans-serif;">
      Download / Print Invoice
    </button>
    <button onclick="window.close()" style="padding: 10px 32px; background: #64748b; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; margin-left: 8px; font-family: '${fontFamily}', sans-serif;">
      Close
    </button>
  </div>

  <div class="invoice-wrapper" style="max-width: 800px; margin: 24px auto; background: white; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd); padding: 32px 40px; color: white;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          ${template?.companyLogo
            ? `<img src="${template.companyLogo}" alt="${companyName}" style="height: 48px; margin-bottom: 8px;">`
            : `<div style="font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">${companyName}</div>`
          }
          <div style="font-size: 12px; opacity: 0.85; margin-top: 4px;">${companyAddress}</div>
          <div style="font-size: 12px; opacity: 0.85;">${companyPhone} | ${companyEmail}</div>
          ${companyWebsite ? `<div style="font-size: 12px; opacity: 0.85;">${companyWebsite}</div>` : ""}
        </div>
        <div style="text-align: right;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.7; margin-bottom: 4px;">Invoice</div>
          <div style="font-size: 22px; font-weight: 800;">${invoice.invoiceNumber}</div>
          <div style="display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-top: 8px; background: ${statusColor.bg}; color: ${statusColor.text};">
            ${invoice.status}
          </div>
        </div>
      </div>
      ${template?.headerText ? `<div style="margin-top: 16px; font-size: 12px; opacity: 0.85; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 12px;">${template.headerText}</div>` : ""}
    </div>

    <!-- Invoice Meta -->
    <div style="display: flex; justify-content: space-between; padding: 24px 40px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
      <div style="flex: 1;">
        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 700; margin-bottom: 8px;">Bill To</div>
        <div style="font-size: 15px; font-weight: 700; color: #0f172a;">${invoice.customerName}</div>
        ${invoice.organizationName ? `<div style="font-size: 13px; color: #64748b; font-weight: 500;">${invoice.organizationName}</div>` : ""}
        ${invoice.customerAddress ? `<div style="font-size: 12px; color: #64748b; margin-top: 4px;">${invoice.customerAddress}</div>` : ""}
        ${invoice.customerPhone ? `<div style="font-size: 12px; color: #64748b;">${invoice.customerPhone}</div>` : ""}
        ${invoice.customerEmail ? `<div style="font-size: 12px; color: #64748b;">${invoice.customerEmail}</div>` : ""}
      </div>
      <div style="text-align: right;">
        <div style="margin-bottom: 12px;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 700;">Order Reference</div>
          <div style="font-size: 14px; font-weight: 700; color: ${primaryColor};">${invoice.order.orderNumber}</div>
        </div>
        <div style="margin-bottom: 12px;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 700;">Issue Date</div>
          <div style="font-size: 13px; color: #334155;">${formatDate(invoice.issuedAt)}</div>
        </div>
        ${invoice.dueDate ? `
        <div style="margin-bottom: 12px;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 700;">Due Date</div>
          <div style="font-size: 13px; color: #334155;">${formatDate(invoice.dueDate)}</div>
        </div>` : ""}
        <div>
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 700;">Type</div>
          <div style="display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; background: ${invoice.type === "B2B" ? "#e0e7ff" : "#f0fdfa"}; color: ${invoice.type === "B2B" ? "#3730a3" : primaryColor};">
            ${invoice.type}
          </div>
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <div style="padding: 24px 40px;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f8fafc;">
            <th style="padding: 10px 16px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 700; border-bottom: 2px solid #e2e8f0;">#</th>
            <th style="padding: 10px 16px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 700; border-bottom: 2px solid #e2e8f0;">Item</th>
            <th style="padding: 10px 16px; text-align: center; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 700; border-bottom: 2px solid #e2e8f0;">Qty</th>
            <th style="padding: 10px 16px; text-align: right; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 700; border-bottom: 2px solid #e2e8f0;">Unit Price</th>
            <th style="padding: 10px 16px; text-align: right; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 700; border-bottom: 2px solid #e2e8f0;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <!-- Totals -->
      <div style="display: flex; justify-content: flex-end; margin-top: 24px;">
        <div style="width: 280px;">
          <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; color: #64748b;">
            <span>Subtotal</span>
            <span style="font-weight: 600;">${formatCurrency(invoice.subtotal)}</span>
          </div>
          ${invoice.tax > 0 ? `
          <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; color: #64748b;">
            <span>Tax (${invoice.taxRate}%)</span>
            <span style="font-weight: 600;">${formatCurrency(invoice.tax)}</span>
          </div>` : ""}
          ${invoice.shippingCost > 0 ? `
          <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; color: #64748b;">
            <span>Shipping</span>
            <span style="font-weight: 600;">${formatCurrency(invoice.shippingCost)}</span>
          </div>` : ""}
          ${invoice.discount > 0 ? `
          <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; color: #ef4444;">
            <span>Discount</span>
            <span style="font-weight: 600;">-${formatCurrency(invoice.discount)}</span>
          </div>` : ""}
          <div style="display: flex; justify-content: space-between; padding: 14px 0; margin-top: 8px; border-top: 2px solid ${primaryColor}; font-size: 18px; font-weight: 800; color: #0f172a;">
            <span>Total</span>
            <span>${formatCurrency(invoice.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Info -->
    <div style="margin: 0 40px; padding: 16px 20px; background: #f8fafc; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 700;">Payment Method</div>
        <div style="font-size: 14px; font-weight: 700; color: #334155; margin-top: 2px;">${paymentLabel}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 700;">Payment Status</div>
        <div style="display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-top: 4px; background: ${STATUS_COLORS[invoice.paymentStatus]?.bg || "#fef9c3"}; color: ${STATUS_COLORS[invoice.paymentStatus]?.text || "#854d0e"};">
          ${invoice.paymentStatus}
        </div>
      </div>
    </div>

    <!-- Notes & Terms -->
    ${invoice.notes || invoice.termsConditions || template?.customNotes ? `
    <div style="padding: 24px 40px; margin-top: 16px;">
      ${invoice.notes ? `
      <div style="margin-bottom: 16px;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 700; margin-bottom: 6px;">Notes</div>
        <div style="font-size: 12px; color: #64748b; line-height: 1.6;">${invoice.notes}</div>
      </div>` : ""}
      ${template?.customNotes ? `
      <div style="margin-bottom: 16px;">
        <div style="font-size: 12px; color: #64748b; line-height: 1.6;">${template.customNotes}</div>
      </div>` : ""}
      ${invoice.termsConditions ? `
      <div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 700; margin-bottom: 6px;">Terms & Conditions</div>
        <div style="font-size: 11px; color: #94a3b8; line-height: 1.6;">${invoice.termsConditions}</div>
      </div>` : ""}
    </div>` : ""}

    <!-- Footer -->
    <div style="padding: 20px 40px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
      ${template?.footerText
        ? `<div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">${template.footerText}</div>`
        : `<div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">Thank you for your business!</div>`
      }
      <div style="font-size: 11px; color: #94a3b8;">
        ${companyName} | ${companyAddress} | ${companyPhone}
      </div>
    </div>
  </div>
</body>
</html>`;
}
