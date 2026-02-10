import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const categoryId = searchParams.get("categoryId");
    const query = searchParams.get("q");
    const featured = searchParams.get("featured") === "true";
    const trending = searchParams.get("trending") === "true";
    const flashDeal = searchParams.get("flashDeal") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const where: any = {
        published: true,
    };

    if (categoryId && categoryId !== "all") {
        where.categoryId = categoryId;
    }

    if (query) {
        where.OR = [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
        ];
    }

    if (featured) where.featured = true;
    if (trending) where.trending = true;
    if (flashDeal) where.flashDeal = true;

    try {
        const [products, total] = await Promise.all([
            db.product.findMany({
                where,
                include: { category: true },
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            db.product.count({ where }),
        ]);

        return NextResponse.json({
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch products" },
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
        } = body;

        // Generate slug
        let slug = slugify(name);
        const existingProduct = await db.product.findUnique({ where: { slug } });
        if (existingProduct) {
            slug = `${slug}-${Date.now()}`;
        }

        const product = await db.product.create({
            data: {
                name,
                slug,
                description,
                categoryId,
                b2cPrice: parseFloat(b2cPrice),
                b2bPrice: parseFloat(b2bPrice),
                stock: parseInt(stock),
                images: images || [],
                featured: featured || false,
                trending: trending || false,
                flashDeal: flashDeal || false,
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Create product error:", error);
        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
        );
    }
}
