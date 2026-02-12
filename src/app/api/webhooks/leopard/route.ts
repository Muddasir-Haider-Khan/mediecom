import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { LeopardService } from "@/lib/leopard-service";
import crypto from "crypto";

// POST /api/webhooks/leopard — Receive Leopard status updates
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const payload = JSON.parse(body);

    // Get Leopard config for webhook verification
    const config = await db.leopardConfig.findFirst();

    // Verify webhook signature if secret is configured
    if (config?.webhookSecret) {
      const signature = req.headers.get("x-leopard-signature");
      if (!signature) {
        return NextResponse.json(
          { error: "Missing signature" },
          { status: 401 }
        );
      }

      const hash = crypto
        .createHmac("sha256", config.webhookSecret)
        .update(body)
        .digest("hex");

      if (signature !== hash) {
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    }

    // Extract shipment data from webhook
    const {
      shipment_id,
      tracking_number,
      status,
      location,
      message,
      timestamp,
    } = payload;

    if (!tracking_number) {
      return NextResponse.json(
        { error: "Missing tracking number" },
        { status: 400 }
      );
    }

    // Update shipment status via LeopardService
    await LeopardService.updateShipmentStatus(
      tracking_number,
      status,
      location,
      message
    );

    // If delivered, update order status
    if (status?.toLowerCase() === "delivered") {
      const shipment = await db.leopardShipment.findUnique({
        where: { trackingNumber: tracking_number },
        select: { orderId: true },
      });

      if (shipment) {
        await db.order.update({
          where: { id: shipment.orderId },
          data: { status: "DELIVERED" },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.error("Webhook processing failed:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
