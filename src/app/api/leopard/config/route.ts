import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/leopard/config — Get Leopard configuration
export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const config = await db.leopardConfig.findFirst({
      select: {
        id: true,
        apiKey: true,
        hubId: true,
        webhookSecret: true,
        isEnabled: true,
        enableB2C: true,
        enableB2B: true,
      },
    });

    if (!config) {
      return NextResponse.json({
        id: null,
        apiKey: "",
        apiSecret: "",
        hubId: "",
        webhookSecret: "",
        isEnabled: true,
        enableB2C: true,
        enableB2B: true,
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("Failed to fetch Leopard config:", error);
    return NextResponse.json(
      { error: "Failed to fetch configuration" },
      { status: 500 }
    );
  }
}

// POST /api/leopard/config — Save/update Leopard configuration
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { apiKey, apiSecret, hubId, webhookSecret, isEnabled, enableB2C, enableB2B } = body;

    if (!apiKey || !apiSecret || !hubId) {
      return NextResponse.json(
        { error: "API Key, Secret, and Hub ID are required" },
        { status: 400 }
      );
    }

    // Get existing config or create new
    const existing = await db.leopardConfig.findFirst();

    if (existing) {
      // Update existing
      const updated = await db.leopardConfig.update({
        where: { id: existing.id },
        data: {
          apiKey,
          apiSecret,
          hubId,
          webhookSecret: webhookSecret || undefined,
          isEnabled,
          enableB2C,
          enableB2B,
        },
      });

      return NextResponse.json({ message: "Configuration updated", config: updated });
    } else {
      // Create new
      const created = await db.leopardConfig.create({
        data: {
          apiKey,
          apiSecret,
          hubId,
          webhookSecret: webhookSecret || undefined,
          isEnabled,
          enableB2C,
          enableB2B,
        },
      });

      return NextResponse.json({ message: "Configuration created", config: created });
    }
  } catch (error) {
    console.error("Failed to save Leopard config:", error);
    return NextResponse.json(
      { error: "Failed to save configuration" },
      { status: 500 }
    );
  }
}
