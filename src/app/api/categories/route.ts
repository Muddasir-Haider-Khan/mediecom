import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function GET() {
    try {
        const categories = await db.category.findMany({
            include: { _count: { select: { products: true } } },
            orderBy: { name: "asc" },
        });

        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch categories" },
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
        const { name, icon, image } = body;

        let slug = slugify(name);
        const existing = await db.category.findUnique({ where: { slug } });
        if (existing) {
            slug = `${slug}-${Date.now()}`;
        }

        const category = await db.category.create({
            data: {
                name,
                slug,
                icon,
                image,
            },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create category" },
            { status: 500 }
        );
    }
}
