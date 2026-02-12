import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { LeopardService } from "@/lib/leopard-service";

// GET /api/shipments/[id] — Get single shipment with full details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const shipment = await db.leopardShipment.findUnique({
      where: { trackingNumber: id },
      include: {
        order: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
            items: { include: { product: true } },
            tracking: { orderBy: { timestamp: "desc" } },
          },
        },
      },
    });

    if (!shipment) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
    }

    return NextResponse.json(shipment);
  } catch (error) {
    console.error("Failed to fetch shipment:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipment" },
      { status: 500 }
    );
  }
}

// POST /api/shipments/[id]/retry — Retry a failed shipment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { action } = await req.json();

    if (action === "retry") {
      const shipment = await LeopardService.retryShipment(id);
      return NextResponse.json({
        message: "Shipment retry initiated",
        shipment,
      });
    } else if (action === "cancel") {
      const result = await LeopardService.cancelShipment(id);
      return NextResponse.json({
        message: "Shipment cancelled",
        ...result,
      });
    } else if (action === "refresh") {
      // Fetch latest tracking from Leopard
      const tracking = await LeopardService.trackShipment(id);
      
      // Update shipment status
      await LeopardService.updateShipmentStatus(
        id,
        tracking.status,
        tracking.location,
        tracking.status
      );

      return NextResponse.json({
        message: "Shipment status updated",
        tracking,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Failed to process shipment action:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
