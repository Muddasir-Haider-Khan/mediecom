import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const supplyChains = await db.supplyChain.findMany({
            include: { _count: { select: { products: true } } },
            orderBy: { name: "asc" },
        });
        return NextResponse.json(supplyChains);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch supply chains" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, logo } = body;

        const supplyChain = await db.supplyChain.create({
            data: { name, logo },
        });

        return NextResponse.json(supplyChain, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create supply chain" },
            { status: 500 }
        );
    }
}
