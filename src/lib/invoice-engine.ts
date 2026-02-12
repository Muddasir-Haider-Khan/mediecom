import { db } from "@/lib/db";
import { generateInvoiceNumber } from "@/lib/utils";
import type { Order, OrderItem, User, Organization, Product } from "@prisma/client";

// ─── Types ──────────────────────────────────────────────

interface OrderWithDetails extends Order {
  user: Pick<User, "name" | "email" | "phone" | "role">;
  items: (OrderItem & { product: Pick<Product, "name" | "description"> })[];
  organization?: Pick<Organization, "name"> | null;
  invoice?: { id: string } | null;
}

interface InvoiceCreateResult {
  success: boolean;
  invoiceId?: string;
  invoiceNumber?: string;
  error?: string;
}

// ─── Invoice Engine ─────────────────────────────────────

export class InvoiceEngine {
  /**
   * Generate an invoice for a given order.
   * Prevents duplicate invoices for the same order.
   */
  static async generateFromOrder(orderId: string): Promise<InvoiceCreateResult> {
    try {
      // 1. Fetch order with all related data
      const order = await db.order.findUnique({
        where: { id: orderId },
        include: {
          user: { select: { name: true, email: true, phone: true, role: true } },
          items: {
            include: {
              product: { select: { name: true, description: true } },
            },
          },
          organization: { select: { name: true } },
          invoice: { select: { id: true } },
        },
      });

      if (!order) {
        return { success: false, error: "Order not found" };
      }

      // 2. Prevent duplicate invoices
      if (order.invoice) {
        return {
          success: false,
          error: `Invoice already exists for this order (ID: ${order.invoice.id})`,
        };
      }

      // 3. Determine invoice type
      const isB2B = order.user.role === "B2B_CLIENT" || !!order.organizationId;
      const invoiceType = isB2B ? "B2B" : "B2C";

      // 4. Find the appropriate template
      const template = await db.invoiceTemplate.findFirst({
        where: {
          type: invoiceType,
          isDefault: true,
          isActive: true,
        },
      });

      // 5. Calculate financials
      const subtotal = order.items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      );
      const taxRate = isB2B ? 0 : 0; // Can be configured per template
      const tax = subtotal * (taxRate / 100);
      const shippingCost = 250; // Will be configurable
      const discount = 0;
      const totalAmount = subtotal + tax + shippingCost - discount;

      // 6. Determine payment status from order
      const paymentStatus = order.paymentStatus || "PENDING";
      const paymentMethod = order.paymentMethod || "COD";

      // 7. Calculate due date (30 days for B2B, immediate for B2C COD)
      const dueDate = new Date();
      if (isB2B) {
        dueDate.setDate(dueDate.getDate() + 30);
      } else {
        dueDate.setDate(dueDate.getDate() + 7);
      }

      // 8. Determine invoice status
      let invoiceStatus: "ISSUED" | "PAID" | "DRAFT" = "ISSUED";
      if (paymentStatus === "PAID") {
        invoiceStatus = "PAID";
      }

      // 9. Create the invoice with items
      const invoiceNumber = generateInvoiceNumber();

      const invoice = await db.invoice.create({
        data: {
          invoiceNumber,
          type: invoiceType,
          status: invoiceStatus,
          subtotal,
          tax,
          taxRate,
          discount,
          shippingCost,
          totalAmount,
          paymentMethod: paymentMethod as any,
          paymentStatus: paymentStatus as any,
          issuedAt: new Date(),
          dueDate,
          paidAt: paymentStatus === "PAID" ? new Date() : null,
          notes: order.notes,
          termsConditions: template?.termsConditions || null,
          customerName: order.user.name || "Customer",
          customerEmail: order.user.email,
          customerPhone: order.user.phone || order.phone,
          customerAddress: order.shippingAddress,
          organizationName: order.organization?.name || null,
          orderId: order.id,
          templateId: template?.id || null,
          items: {
            create: order.items.map((item: any) => ({
              name: item.product.name,
              description: item.product.description || null,
              quantity: item.quantity,
              unitPrice: item.price,
              totalPrice: item.price * item.quantity,
            })),
          },
          logs: {
            create: {
              action: "CREATED",
              details: `Invoice ${invoiceNumber} generated automatically for order ${order.orderNumber}`,
              performedBy: "SYSTEM",
            },
          },
        },
      });

      return {
        success: true,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
      };
    } catch (error) {
      console.error("Invoice generation error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error during invoice generation",
      };
    }
  }

  /**
   * Update invoice status (e.g., mark as paid)
   */
  static async updateStatus(
    invoiceId: string,
    status: "DRAFT" | "ISSUED" | "PAID" | "OVERDUE" | "CANCELLED" | "REFUNDED",
    performedBy: string = "ADMIN"
  ) {
    try {
      const updateData: any = { status };

      if (status === "PAID") {
        updateData.paidAt = new Date();
        updateData.paymentStatus = "PAID";
      } else if (status === "REFUNDED") {
        updateData.paymentStatus = "REFUNDED";
      }

      const invoice = await db.invoice.update({
        where: { id: invoiceId },
        data: {
          ...updateData,
          logs: {
            create: {
              action: `STATUS_CHANGED_TO_${status}`,
              details: `Invoice status updated to ${status}`,
              performedBy,
            },
          },
        },
      });

      return { success: true, invoice };
    } catch (error) {
      console.error("Invoice status update error:", error);
      return { success: false, error: "Failed to update invoice status" };
    }
  }

  /**
   * Get invoice analytics summary
   */
  static async getAnalytics() {
    try {
      const [
        totalInvoices,
        paidInvoices,
        pendingInvoices,
        overdueInvoices,
        b2cCount,
        b2bCount,
        totalRevenue,
        pendingRevenue,
      ] = await Promise.all([
        db.invoice.count(),
        db.invoice.count({ where: { status: "PAID" } }),
        db.invoice.count({ where: { status: "ISSUED" } }),
        db.invoice.count({ where: { status: "OVERDUE" } }),
        db.invoice.count({ where: { type: "B2C" } }),
        db.invoice.count({ where: { type: "B2B" } }),
        db.invoice.aggregate({
          where: { status: "PAID" },
          _sum: { totalAmount: true },
        }),
        db.invoice.aggregate({
          where: { status: { in: ["ISSUED", "OVERDUE"] } },
          _sum: { totalAmount: true },
        }),
      ]);

      return {
        totalInvoices,
        paidInvoices,
        pendingInvoices,
        overdueInvoices,
        b2cCount,
        b2bCount,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        pendingRevenue: pendingRevenue._sum.totalAmount || 0,
      };
    } catch (error) {
      console.error("Invoice analytics error:", error);
      return {
        totalInvoices: 0,
        paidInvoices: 0,
        pendingInvoices: 0,
        overdueInvoices: 0,
        b2cCount: 0,
        b2bCount: 0,
        totalRevenue: 0,
        pendingRevenue: 0,
      };
    }
  }
}
