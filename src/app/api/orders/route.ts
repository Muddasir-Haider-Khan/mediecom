import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";
import { InvoiceEngine } from "@/lib/invoice-engine";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;
    const includeInvoice = searchParams.get("includeInvoice") === "true";

    const where: any = {};

    // Role-based filtering
    if (session.user.role === "ADMIN") {
        // Admin sees all
    } else if (session.user.role === "B2B_CLIENT") {
        // Fetch user to get organizationId
        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: { organizationId: true },
        });

        if (user?.organizationId) {
            where.organizationId = user.organizationId;
        } else {
            // Fallback to own orders if not in org (shouldn't happen for valid B2B)
            where.userId = session.user.id;
        }
    } else {
        // Regular customer
        where.userId = session.user.id;
    }

    if (status) {
        where.status = status;
    }

    try {
        const [orders, total] = await Promise.all([
            db.order.findMany({
                where,
                include: {
                    user: { select: { name: true, email: true } },
                    items: true,
                    organization: { select: { name: true } },
                    ...(includeInvoice ? { invoice: { select: { id: true, invoiceNumber: true, status: true } } } : {}),
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            db.order.count({ where }),
        ]);

        return NextResponse.json({
            orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { items, shippingAddress, phone, notes, paymentMethod = "COD" } = body;

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: "No items in order" },
                { status: 400 }
            );
        }

        // Check user role and org
        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: { role: true, organizationId: true },
        });

        const isB2B = user?.role === "B2B_CLIENT";

        // Determine payment status based on method
        const paymentStatus = paymentMethod === "JAZZCASH" ? "PAID" : "PENDING";

        // Calculate total
        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
            const product = await db.product.findUnique({
                where: { id: item.productId },
            });
            if (!product) {
                return NextResponse.json(
                    { error: `Product not found: ${item.productId}` },
                    { status: 400 }
                );
            }

            const price = isB2B ? product.b2bPrice : product.b2cPrice;
            totalAmount += price * item.quantity;
            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                price: price,
            });
        }

        const order = await db.order.create({
            data: {
                orderNumber: generateOrderNumber(),
                userId: session.user.id,
                organizationId: user?.organizationId,
                totalAmount,
                shippingAddress,
                phone,
                notes,
                paymentMethod: paymentMethod as any,
                paymentStatus: paymentStatus as any,
                items: {
                    create: orderItemsData,
                },
            },
        });

        // Auto-generate invoice
        const invoiceResult = await InvoiceEngine.generateFromOrder(order.id);
        if (!invoiceResult.success) {
            console.error("Auto-invoice generation failed:", invoiceResult.error);
        }

        return NextResponse.json(
            { ...order, invoiceGenerated: invoiceResult.success, invoiceNumber: invoiceResult.invoiceNumber },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create order error:", error);
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}
