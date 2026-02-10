import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "B2B_CLIENT") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: { organizationId: true, organization: true },
        });

        if (!user?.organizationId) {
            return NextResponse.json({ error: "No organization found" }, { status: 404 });
        }

        const orgId = user.organizationId;

        const [orderCount, totalSpentResult, pendingOrders] = await Promise.all([
            db.order.count({ where: { organizationId: orgId } }),
            db.order.aggregate({
                where: { organizationId: orgId },
                _sum: { totalAmount: true },
            }),
            db.order.count({
                where: {
                    organizationId: orgId,
                    status: { in: ["PENDING", "PROCESSING"] },
                },
            }),
        ]);

        const totalSpent = totalSpentResult._sum.totalAmount || 0;

        // Get product count (approximation: sum of quantities in orders)
        // ideally we might want unique products ordered, but this is faster
        const itemsResult = await db.orderItem.aggregate({
            where: {
                order: { organizationId: orgId },
            },
            _sum: { quantity: true },
        });
        const productsOrdered = itemsResult._sum.quantity || 0;

        return NextResponse.json({
            organization: user.organization,
            stats: {
                totalOrders: orderCount,
                totalSpent: totalSpent,
                productsOrdered: productsOrdered,
                pendingOrders: pendingOrders,
            },
        });
    } catch (error) {
        console.error("B2B Stats error:", error);
        return NextResponse.json(
            { error: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}
