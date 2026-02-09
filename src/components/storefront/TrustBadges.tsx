import Link from "next/link";
import { Truck, Shield, HeadphonesIcon, CreditCard } from "lucide-react";

const features = [
    {
        icon: Truck,
        title: "Fast Delivery",
        description: "Same-day delivery available in major cities",
        color: "text-primary-600 bg-primary-50",
    },
    {
        icon: Shield,
        title: "Authentic Products",
        description: "100% genuine medical-grade equipment",
        color: "text-emerald-600 bg-emerald-50",
    },
    {
        icon: HeadphonesIcon,
        title: "24/7 Support",
        description: "Expert assistance anytime via WhatsApp",
        color: "text-blue-600 bg-blue-50",
    },
    {
        icon: CreditCard,
        title: "Secure Payment",
        description: "Multiple secure payment options",
        color: "text-purple-600 bg-purple-50",
    },
];

export default function TrustBadges() {
    return (
        <section className="py-12 border-y border-surface-100 bg-white">
            <div className="container-custom">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="flex items-center gap-4 group"
                        >
                            <div
                                className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                            >
                                <feature.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-surface-900">
                                    {feature.title}
                                </h3>
                                <p className="text-xs text-surface-500 mt-0.5">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function CTABanner() {
    return (
        <section className="py-16 lg:py-20">
            <div className="container-custom">
                <div className="rounded-3xl gradient-bg p-8 lg:p-12 text-center relative overflow-hidden">
                    {/* Decorative */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border-2 border-white" />
                        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full border border-white/50" />
                    </div>

                    <div className="relative z-10 space-y-4">
                        <span className="badge bg-white/10 text-white border border-white/20 backdrop-blur-sm">
                            For Hospitals & Pharmacies
                        </span>
                        <h2 className="font-display font-bold text-3xl lg:text-4xl text-white max-w-2xl mx-auto">
                            Wholesale Pricing for Healthcare Institutions
                        </h2>
                        <p className="text-white/70 max-w-lg mx-auto">
                            Get access to exclusive B2B pricing, bulk ordering, same-day delivery, and dedicated account management.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                            <Link
                                href="/b2b/register"
                                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-surface-900 font-semibold hover:bg-white/90 transition shadow-lg"
                            >
                                Register as B2B Client
                            </Link>
                            <Link
                                href="/b2b"
                                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
