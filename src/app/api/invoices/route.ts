import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { InvoiceEngine } from "@/lib/invoice-engine";

// GET /api/invoices — List invoices with filters
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type"); // B2C, B2B
  const status = searchParams.get("status"); // ISSUED, PAID, OVERDUE, etc.
  const paymentStatus = searchParams.get("paymentStatus");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const includeAnalytics = searchParams.get("analytics") === "true";

  const where: any = {};

  // Role-based filtering
  if (session.user.role === "ADMIN") {
    // Admin sees all
  } else if (session.user.role === "B2B_CLIENT") {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { organizationId: true, name: true },
    });
    if (user?.organizationId) {
      where.order = { organizationId: user.organizationId };
    } else {
      where.order = { userId: session.user.id };
    }
  } else {
    where.order = { userId: session.user.id };
  }

  // Filters
  if (type) where.type = type;
  if (status) where.status = status;
  if (paymentStatus) where.paymentStatus = paymentStatus;

  if (search) {
    where.OR = [
      { invoiceNumber: { contains: search, mode: "insensitive" } },
      { customerName: { contains: search, mode: "insensitive" } },
      { order: { orderNumber: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (dateFrom || dateTo) {
    where.issuedAt = {};
    if (dateFrom) where.issuedAt.gte = new Date(dateFrom);
    if (dateTo) where.issuedAt.lte = new Date(dateTo);
  }

  try {
    const [invoices, total] = await Promise.all([
      db.invoice.findMany({
        where,
        include: {
          order: { select: { orderNumber: true, status: true } },
          items: true,
          template: {
            select: { companyName: true, companyLogo: true, primaryColor: true },
          },
        },
        orderBy: { issuedAt: "desc" },
        skip,
        take: limit,
      }),
      db.invoice.count({ where }),
    ]);

    const response: any = {
      invoices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    if (includeAnalytics) {
      response.analytics = await InvoiceEngine.getAnalytics();
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to fetch invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

// POST /api/invoices — Generate invoice for an order
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      );
    }

    const result = await InvoiceEngine.generateFromOrder(orderId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: "Invoice generated successfully",
        invoiceId: result.invoiceId,
        invoiceNumber: result.invoiceNumber,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Invoice creation error:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
