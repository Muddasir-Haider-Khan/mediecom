import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
    datasourceUrl: process.env.DIRECT_URL,
});

async function main() {
    const hashedPassword = await bcrypt.hash("admin123", 12);

    const admin = await prisma.user.upsert({
        where: { email: "admin@medsurgx.com" },
        update: {},
        create: {
            name: "Admin",
            email: "admin@medsurgx.com",
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    console.log("✅ Admin user created/verified:");
    console.log(`   Email:    admin@medsurgx.com`);
    console.log(`   Password: admin123`);
    console.log(`   Role:     ADMIN`);
    console.log(`   ID:       ${admin.id}`);
}

main()
    .catch((e) => {
        console.error("❌ Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
