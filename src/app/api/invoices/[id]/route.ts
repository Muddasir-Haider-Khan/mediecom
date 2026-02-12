import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { InvoiceEngine } from "@/lib/invoice-engine";
import { generateInvoiceHTML } from "@/lib/invoice-pdf";

// GET /api/invoices/[id] — Get single invoice
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format"); // "html" for printable invoice

  try {
    const invoice = await db.invoice.findUnique({
      where: { id },
      include: {
        order: { select: { orderNumber: true, status: true } },
        items: true,
        template: true,
        logs: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Role-based access check
    if (session.user.role !== "ADMIN") {
      const order = await db.order.findUnique({
        where: { id: invoice.orderId },
        select: { userId: true, organizationId: true },
      });

      if (!order) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { organizationId: true },
      });

      const hasAccess =
        order.userId === session.user.id ||
        (user?.organizationId && order.organizationId === user.organizationId);

      if (!hasAccess) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    }

    // Return HTML version for printing/PDF
    if (format === "html") {
      const html = generateInvoiceHTML(invoice as any);
      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Failed to fetch invoice:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}

// PUT /api/invoices/[id] — Update invoice status
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json(
        { error: "status is required" },
        { status: 400 }
      );
    }

    const validStatuses = ["DRAFT", "ISSUED", "PAID", "OVERDUE", "CANCELLED", "REFUNDED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await InvoiceEngine.updateStatus(
      id,
      status,
      session.user.name || session.user.email || "ADMIN"
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      message: "Invoice status updated",
      invoice: result.invoice,
    });
  } catch (error) {
    console.error("Failed to update invoice:", error);
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}
