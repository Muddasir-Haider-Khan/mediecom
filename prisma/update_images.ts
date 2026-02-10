
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🔄 Updating product images...");

    const updates = [
        { slug: "professional-surgical-scissors-titanium", image: "/products/scissors-1.svg" },
        { slug: "digital-stethoscope-pro-edition", image: "/products/stethoscope-1.svg" },
        { slug: "icu-patient-monitor-7-parameter", image: "/products/monitor-1.svg" },
        { slug: "adjustable-hospital-bed-electric", image: "/products/bed-1.svg" },
        { slug: "n95-respirator-mask-pack-50", image: "/products/mask-1.svg" },
        { slug: "portable-pulse-oximeter-oled", image: "/products/oximeter-1.svg" },
        { slug: "autoclave-sterilizer-22l", image: "/products/autoclave-1.svg" },
        { slug: "disposable-surgical-gloves-100", image: "/products/gloves-1.svg" },
    ];

    for (const update of updates) {
        try {
            await prisma.product.update({
                where: { slug: update.slug },
                data: { images: [update.image] },
            });
            console.log(`✅ Updated ${update.slug}`);
        } catch (error) {
            console.error(`❌ Failed to update ${update.slug}:`, error);
        }
    }

    console.log("🏁 Update complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
