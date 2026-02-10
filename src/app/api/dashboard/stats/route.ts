import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const [
            totalRevenue,
            totalOrders,
            totalProducts,
            activeUsers,
            recentOrders
        ] = await Promise.all([
            db.order.aggregate({
                _sum: { totalAmount: true },
            }),
            db.order.count(),
            db.product.count(),
            db.user.count(),
            db.order.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: { user: { select: { name: true } } },
            }),
        ]);

        return NextResponse.json({
            revenue: totalRevenue._sum.totalAmount || 0,
            orders: totalOrders,
            products: totalProducts,
            users: activeUsers,
            recentOrders,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}
