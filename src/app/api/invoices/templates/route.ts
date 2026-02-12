import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/invoices/templates — List all invoice templates
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const templates = await db.invoiceTemplate.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        _count: { select: { invoices: true } },
      },
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Failed to fetch templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

// POST /api/invoices/templates — Create a new template
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const {
      name,
      type = "B2C",
      isDefault = false,
      companyName = "MedSurgX",
      companyLogo,
      companyAddress,
      companyPhone,
      companyEmail,
      companyWebsite,
      headerText,
      footerText,
      termsConditions,
      customNotes,
      primaryColor = "#0f766e",
      accentColor = "#f59e0b",
      fontFamily = "Inter",
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Template name is required" },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults of same type
    if (isDefault) {
      await db.invoiceTemplate.updateMany({
        where: { type, isDefault: true },
        data: { isDefault: false },
      });
    }

    const template = await db.invoiceTemplate.create({
      data: {
        name,
        type,
        isDefault,
        companyName,
        companyLogo,
        companyAddress,
        companyPhone,
        companyEmail,
        companyWebsite,
        headerText,
        footerText,
        termsConditions,
        customNotes,
        primaryColor,
        accentColor,
        fontFamily,
      },
    });

    return NextResponse.json(
      { message: "Template created", template },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create template:", error);
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}
