import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const order = await db.order.findUnique({
            where: { id },
            include: {
                user: { select: { name: true, email: true, phone: true } },
                items: { include: { product: true } },
                rider: { select: { name: true, phone: true } },
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Access control: only admin or the order owner
        if (session.user.role !== "ADMIN" && order.userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch order" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const { status, riderId, estimatedDelivery } = body;

        const order = await db.order.update({
            where: { id },
            data: {
                status,
                riderId,
                estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : undefined,
            },
        });

        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update order" },
            { status: 500 }
        );
    }
}
