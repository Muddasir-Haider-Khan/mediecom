import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/shipments — List all shipments
export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const tracking = searchParams.get("tracking");
    const search = searchParams.get("search");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (tracking) {
      where.trackingNumber = {
        contains: tracking,
        mode: "insensitive",
      };
    }

    if (search) {
      where.OR = [
        {
          order: {
            orderNumber: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          order: {
            user: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
      ];
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }

    const [shipments, total] = await Promise.all([
      db.leopardShipment.findMany({
        where,
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              totalAmount: true,
              user: { select: { name: true, email: true, phone: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.leopardShipment.count({ where }),
    ]);

    return NextResponse.json({
      shipments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch shipments:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipments" },
      { status: 500 }
    );
  }
}
