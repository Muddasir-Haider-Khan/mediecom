import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Providers } from "@/components/providers";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "MedSurgX — Premium Medical & Surgical Equipment",
        template: "%s | MedSurgX",
    },
    description:
        "Pakistan's leading platform for premium medical and surgical technology products. Shop surgical instruments, hospital equipment, and medical devices with fast delivery.",
    keywords: [
        "medical equipment",
        "surgical instruments",
        "hospital supplies",
        "medical devices",
        "Pakistan",
        "MedSurgX",
    ],
    openGraph: {
        title: "MedSurgX — Premium Medical & Surgical Equipment",
        description:
            "Pakistan's leading platform for premium medical and surgical technology products.",
        type: "website",
        locale: "en_US",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
            <body className="font-sans">
                <Providers>
                    {children}
                    <WhatsAppButton />
                </Providers>
            </body>
        </html>
    );
}
