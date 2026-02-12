import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedTemplates() {
  console.log("🧾 Seeding invoice templates...");

  // B2C Default Template
  await prisma.invoiceTemplate.upsert({
    where: { id: "tpl_b2c_default" },
    update: {},
    create: {
      id: "tpl_b2c_default",
      name: "Standard B2C Invoice",
      type: "B2C",
      isDefault: true,
      isActive: true,
      version: 1,
      companyName: "MedSurgX",
      companyAddress: "Blue Area, Islamabad, Pakistan",
      companyPhone: "+92 300 0000000",
      companyEmail: "info@medsurgx.com",
      companyWebsite: "www.medsurgx.com",
      headerText: "Your trusted partner for medical & surgical supplies",
      footerText: "Thank you for shopping with MedSurgX!",
      termsConditions:
        "Cash on Delivery orders are due upon receipt. JazzCash payments are confirmed instantly. For returns and refunds, contact support within 7 days of delivery.",
      customNotes: "For support, contact us at support@medsurgx.com or call +92 300 0000000",
      primaryColor: "#0f766e",
      accentColor: "#f59e0b",
      fontFamily: "Inter",
    },
  });

  // B2B Default Template
  await prisma.invoiceTemplate.upsert({
    where: { id: "tpl_b2b_default" },
    update: {},
    create: {
      id: "tpl_b2b_default",
      name: "Standard B2B Invoice",
      type: "B2B",
      isDefault: true,
      isActive: true,
      version: 1,
      companyName: "MedSurgX",
      companyAddress: "Blue Area, Islamabad, Pakistan",
      companyPhone: "+92 300 0000000",
      companyEmail: "b2b@medsurgx.com",
      companyWebsite: "www.medsurgx.com",
      headerText: "Wholesale & Business Solutions — MedSurgX",
      footerText: "Thank you for your continued partnership with MedSurgX",
      termsConditions:
        "Payment is due within 30 days of invoice date. Late payments may incur a 2% monthly charge. All prices are exclusive of applicable taxes unless otherwise stated. Bulk order disputes must be raised within 48 hours of delivery.",
      customNotes: "For B2B support and bulk pricing, contact b2b@medsurgx.com",
      primaryColor: "#1e40af",
      accentColor: "#f59e0b",
      fontFamily: "Inter",
    },
  });

  console.log("✅ Invoice templates seeded successfully!");
}

seedTemplates()
  .catch((e) => {
    console.error("Failed to seed templates:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
