import Link from "next/link";
import {
    Phone,
    Mail,
    MapPin,
    Facebook,
    Instagram,
    MessageCircle,
} from "lucide-react";

const footerLinks = {
    shop: [
        { name: "All Products", href: "/products" },
        { name: "Surgical Instruments", href: "/products?category=surgical-instruments" },
        { name: "Diagnostic Equipment", href: "/products?category=diagnostic-equipment" },
        { name: "Hospital Furniture", href: "/products?category=hospital-furniture" },
        { name: "Flash Deals", href: "/products?flashDeal=true" },
    ],
    support: [
        { name: "Contact Us", href: "/contact" },
        { name: "FAQs", href: "/faq" },
        { name: "Shipping Policy", href: "/shipping" },
        { name: "Return Policy", href: "/returns" },
        { name: "Track Order", href: "/dashboard" },
    ],
    business: [
        { name: "B2B Portal", href: "/b2b" },
        { name: "Wholesale Pricing", href: "/b2b/register" },
        { name: "Hospital Partnerships", href: "/b2b/register" },
        { name: "Supply Chain", href: "/b2b" },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-surface-900 text-white">
            {/* Newsletter */}
            <div className="border-b border-surface-700/50">
                <div className="container-custom py-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="font-display font-bold text-xl">
                                Stay Updated with <span className="text-primary-400">MedSurgX</span>
                            </h3>
                            <p className="text-surface-400 text-sm mt-1">
                                Get exclusive deals and new product announcements in your inbox.
                            </p>
                        </div>
                        <div className="flex w-full md:w-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 md:w-72 px-4 py-3 rounded-l-xl bg-surface-800 border border-surface-700 text-sm text-white placeholder:text-surface-500 focus:outline-none focus:border-primary-500"
                            />
                            <button className="px-6 py-3 rounded-r-xl bg-primary-700 text-white text-sm font-semibold hover:bg-primary-600 transition">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                                <span className="text-white font-display font-bold text-lg">M</span>
                            </div>
                            <div>
                                <h2 className="font-display font-bold text-xl leading-none">
                                    Med<span className="text-primary-400">SurgX</span>
                                </h2>
                                <p className="text-[10px] text-surface-500">Medical Technology</p>
                            </div>
                        </div>
                        <p className="text-surface-400 text-sm leading-relaxed max-w-sm mb-6">
                            Pakistan&apos;s Premier platform for medical and surgical technology. Serving healthcare professionals with premium quality instruments and equipment.
                        </p>
                        <div className="space-y-2 text-sm text-surface-400">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary-500" />
                                <span>+92 300 1234567</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary-500" />
                                <span>info@medsurgx.com</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary-500" />
                                <span>Lahore, Pakistan</span>
                            </div>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-surface-300 mb-4">
                            Shop
                        </h4>
                        <ul className="space-y-2.5">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-surface-400 hover:text-primary-400 transition"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-surface-300 mb-4">
                            Support
                        </h4>
                        <ul className="space-y-2.5">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-surface-400 hover:text-primary-400 transition"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Business */}
                    <div>
                        <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-surface-300 mb-4">
                            For Business
                        </h4>
                        <ul className="space-y-2.5">
                            {footerLinks.business.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-surface-400 hover:text-primary-400 transition"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-surface-800">
                <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-surface-500">
                        © {new Date().getFullYear()} MedSurgX. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-surface-500 hover:text-primary-400 transition">
                            <Facebook className="w-4 h-4" />
                        </a>
                        <a href="#" className="text-surface-500 hover:text-primary-400 transition">
                            <Instagram className="w-4 h-4" />
                        </a>
                        <a href="#" className="text-surface-500 hover:text-primary-400 transition">
                            <MessageCircle className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
