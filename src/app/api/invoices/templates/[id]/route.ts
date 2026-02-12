import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/invoices/templates/[id] — Get single template
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const template = await db.invoiceTemplate.findUnique({
      where: { id },
      include: { _count: { select: { invoices: true } } },
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch template" },
      { status: 500 }
    );
  }
}

// PUT /api/invoices/templates/[id] — Update template
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();

    // If setting as default, unset other defaults of same type
    if (body.isDefault) {
      const existing = await db.invoiceTemplate.findUnique({ where: { id } });
      if (existing) {
        await db.invoiceTemplate.updateMany({
          where: { type: body.type || existing.type, isDefault: true, id: { not: id } },
          data: { isDefault: false },
        });
      }
    }

    // Increment version
    const current = await db.invoiceTemplate.findUnique({
      where: { id },
      select: { version: true },
    });

    const template = await db.invoiceTemplate.update({
      where: { id },
      data: {
        ...body,
        version: (current?.version || 0) + 1,
      },
    });

    return NextResponse.json({ message: "Template updated", template });
  } catch (error) {
    console.error("Failed to update template:", error);
    return NextResponse.json(
      { error: "Failed to update template" },
      { status: 500 }
    );
  }
}

// DELETE /api/invoices/templates/[id] — Delete template
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Check if template is in use
    const useCount = await db.invoice.count({ where: { templateId: id } });
    if (useCount > 0) {
      // Soft delete — deactivate instead
      await db.invoiceTemplate.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({
        message: "Template deactivated (in use by existing invoices)",
      });
    }

    await db.invoiceTemplate.delete({ where: { id } });
    return NextResponse.json({ message: "Template deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete template" },
      { status: 500 }
    );
  }
}
