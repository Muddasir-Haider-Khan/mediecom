import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { orgName, contactName, phone, address, email, password } = body;

        if (!orgName || !contactName || !phone || !address || !email || !password) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists with this email" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Transaction to create Org and User linked
        const result = await db.$transaction(async (tx) => {
            const org = await tx.organization.create({
                data: {
                    name: orgName,
                    phone,
                    address,
                },
            });

            const user = await tx.user.create({
                data: {
                    name: contactName,
                    email,
                    password: hashedPassword,
                    phone,
                    role: "B2B_CLIENT",
                    organizationId: org.id,
                },
            });

            return { org, user };
        });

        return NextResponse.json({
            message: "B2B Registration successful",
            organizationId: result.org.id,
        }, { status: 201 });

    } catch (error) {
        console.error("B2B Register error:", error);
        return NextResponse.json(
            { error: "Failed to register" },
            { status: 500 }
        );
    }
}
