import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await db.product.findFirst({
            where: {
                OR: [{ id }, { slug: id }],
            },
            include: { category: true, supplyChain: true },
        });

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch product" },
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
        const {
            name,
            description,
            categoryId,
            b2cPrice,
            b2bPrice,
            stock,
            images,
            featured,
            trending,
            flashDeal,
            published,
        } = body;

        // If name changed, update slug
        let slug;
        if (name) {
            slug = slugify(name);
            const existing = await db.product.findUnique({
                where: { slug, NOT: { id } },
            });
            if (existing) {
                slug = `${slug}-${Date.now()}`;
            }
        }

        const product = await db.product.update({
            where: { id },
            data: {
                name,
                ...(slug && { slug }),
                description,
                categoryId,
                b2cPrice: b2cPrice ? parseFloat(b2cPrice) : undefined,
                b2bPrice: b2bPrice ? parseFloat(b2bPrice) : undefined,
                stock: stock ? parseInt(stock) : undefined,
                images,
                featured,
                trending,
                flashDeal,
                published,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Update product error:", error);
        return NextResponse.json(
            { error: "Failed to update product" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        await db.product.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Product deleted" });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete product" },
            { status: 500 }
        );
    }
}
