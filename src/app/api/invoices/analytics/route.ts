import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { InvoiceEngine } from "@/lib/invoice-engine";

// GET /api/invoices/analytics — Invoice analytics summary
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const analytics = await InvoiceEngine.getAnalytics();
    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Failed to fetch invoice analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
