import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
    { name: "Surgical Instruments", slug: "surgical-instruments", icon: "🔪", image: "/categories/surgical.jpg" },
    { name: "Diagnostic Equipment", slug: "diagnostic-equipment", icon: "🩺", image: "/categories/diagnostic.jpg" },
    { name: "Hospital Furniture", slug: "hospital-furniture", icon: "🛏️", image: "/categories/furniture.jpg" },
    { name: "PPE & Safety", slug: "ppe-safety", icon: "🧤", image: "/categories/ppe.jpg" },
    { name: "Wound Care", slug: "wound-care", icon: "🩹", image: "/categories/wound.jpg" },
    { name: "Respiratory Care", slug: "respiratory-care", icon: "💨", image: "/categories/respiratory.jpg" },
    { name: "Orthopedic", slug: "orthopedic", icon: "🦴", image: "/categories/orthopedic.jpg" },
    { name: "Laboratory", slug: "laboratory", icon: "🔬", image: "/categories/lab.jpg" },
    { name: "Dental Equipment", slug: "dental-equipment", icon: "🦷", image: "/categories/dental.jpg" },
    { name: "Consumables", slug: "consumables", icon: "💊", image: "/categories/consumables.jpg" },
];

const products = [
    {
        name: "Professional Surgical Scissors — Titanium Coated",
        slug: "professional-surgical-scissors-titanium",
        description: "Premium titanium-coated surgical scissors with ergonomic grip. Designed for precision cutting in surgical environments. Autoclavable and corrosion-resistant.",
        images: ["/products/scissors-1.svg"],
        b2cPrice: 4500,
        b2bPrice: 3200,
        stock: 150,
        featured: true,
        trending: true,
        categorySlug: "surgical-instruments",
    },
    {
        name: "Digital Stethoscope — Pro Edition",
        slug: "digital-stethoscope-pro-edition",
        description: "Advanced digital stethoscope with noise cancellation technology. Bluetooth connectivity for recording and analysis. Premium acoustic quality.",
        images: ["/products/stethoscope-1.svg"],
        b2cPrice: 18500,
        b2bPrice: 14000,
        stock: 75,
        featured: true,
        trending: false,
        flashDeal: true,
        flashDealEnd: new Date("2026-03-01"),
        categorySlug: "diagnostic-equipment",
    },
    {
        name: "ICU Patient Monitor — 7 Parameter",
        slug: "icu-patient-monitor-7-parameter",
        description: "Multi-parameter patient monitor featuring ECG, SpO2, NIBP, temperature, respiration, IBP, and CO2 monitoring. 12.1-inch HD touchscreen display.",
        images: ["/products/monitor-1.svg"],
        b2cPrice: 285000,
        b2bPrice: 225000,
        stock: 20,
        featured: true,
        trending: true,
        categorySlug: "diagnostic-equipment",
    },
    {
        name: "Adjustable Hospital Bed — Electric",
        slug: "adjustable-hospital-bed-electric",
        description: "Fully electric hospital bed with 4-section adjustment. Side rails, CPR quick-release, and Trendelenburg/reverse positioning. 250kg weight capacity.",
        images: ["/products/bed-1.svg"],
        b2cPrice: 195000,
        b2bPrice: 155000,
        stock: 12,
        categorySlug: "hospital-furniture",
    },
    {
        name: "N95 Respirator Mask — Pack of 50",
        slug: "n95-respirator-mask-pack-50",
        description: "NIOSH-approved N95 respirator masks. Multi-layer filtration with adjustable nose clip. Individually packaged for sterility.",
        images: ["/products/mask-1.svg"],
        b2cPrice: 3500,
        b2bPrice: 2200,
        stock: 500,
        trending: true,
        flashDeal: true,
        flashDealEnd: new Date("2026-02-28"),
        categorySlug: "ppe-safety",
    },
    {
        name: "Portable Pulse Oximeter — OLED Display",
        slug: "portable-pulse-oximeter-oled",
        description: "Fingertip pulse oximeter with bright OLED display. SpO2 and pulse rate monitoring with waveform. Auto power-off and low battery indicator.",
        images: ["/products/oximeter-1.svg"],
        b2cPrice: 2800,
        b2bPrice: 1800,
        stock: 300,
        featured: true,
        trending: true,
        categorySlug: "diagnostic-equipment",
    },
    {
        name: "Autoclave Sterilizer — 22L Capacity",
        slug: "autoclave-sterilizer-22l",
        description: "Class B autoclave sterilizer with 22-liter chamber. Pre-vacuum and post-vacuum drying cycles. LCD display with error diagnostics.",
        images: ["/products/autoclave-1.svg"],
        b2cPrice: 165000,
        b2bPrice: 130000,
        stock: 8,
        categorySlug: "laboratory",
    },
    {
        name: "Disposable Surgical Gloves — Box of 100",
        slug: "disposable-surgical-gloves-100",
        description: "Powder-free latex surgical gloves. Textured fingertips for enhanced grip. Sterile, individually paired. Available in sizes S-XL.",
        images: ["/products/gloves-1.svg"],
        b2cPrice: 1800,
        b2bPrice: 1100,
        stock: 1000,
        flashDeal: true,
        flashDealEnd: new Date("2026-02-20"),
        categorySlug: "ppe-safety",
    },
];

async function main() {
    console.log("🌱 Starting seeding...");

    // 1. Admin User
    const adminPassword = await bcrypt.hash("admin123", 12);
    const admin = await prisma.user.upsert({
        where: { email: "admin@medsurgx.com" },
        update: {},
        create: {
            name: "Admin User",
            email: "admin@medsurgx.com",
            password: adminPassword,
            role: "ADMIN",
        },
    });
    console.log("✅ Admin user ready:", admin.email);

    // 2. Categories
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {
                name: cat.name,
                icon: cat.icon,
                image: cat.image,
            },
            create: cat,
        });
    }
    console.log(`✅ Categories seeded: ${categories.length}`);

    // 3. Products
    for (const prod of products) {
        const category = await prisma.category.findUnique({
            where: { slug: prod.categorySlug },
        });

        if (!category) {
            console.warn(`⚠️ Category not found for product: ${prod.name}`);
            continue;
        }

        // Remove categorySlug from product object before creating
        const { categorySlug, ...productData } = prod;

        await prisma.product.upsert({
            where: { slug: productData.slug },
            update: {
                ...productData,
                categoryId: category.id,
            },
            create: {
                ...productData,
                categoryId: category.id,
            },
        });
    }
    console.log(`✅ Products seeded: ${products.length}`);

    console.log("🌱 Seeding completed.");
}

main()
    .catch((e) => {
        console.error("❌ Seeding error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
