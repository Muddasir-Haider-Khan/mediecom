"use client";

import { useState, useEffect } from "react";
import { Clock, Zap } from "lucide-react";
import ProductCard from "./ProductCard";
import { products } from "@/lib/mock-data";

function CountdownTimer({ targetDate }: { targetDate: Date }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className="flex items-center gap-2">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex items-center gap-1">
                    <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{String(value).padStart(2, "0")}</span>
                    </div>
                    {unit !== "seconds" && <span className="text-white/50 font-bold">:</span>}
                </div>
            ))}
        </div>
    );
}

export default function FlashDeals() {
    const flashProducts = products.filter((p) => p.flashDeal);

    if (flashProducts.length === 0) return null;

    return (
        <section className="py-12 lg:py-16">
            <div className="container-custom">
                {/* Header */}
                <div className="rounded-2xl gradient-bg p-6 lg:p-8 mb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                <Zap className="w-6 h-6 text-accent-400" />
                            </div>
                            <div>
                                <h2 className="font-display font-bold text-xl lg:text-2xl text-white flex items-center gap-2">
                                    Flash Deals
                                    <span className="px-2 py-0.5 rounded-md bg-accent-500 text-[10px] font-bold uppercase">
                                        Hot
                                    </span>
                                </h2>
                                <p className="text-sm text-white/60 mt-0.5">
                                    Limited time offers on essential medical supplies
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-white/60" />
                            <span className="text-xs text-white/60">Ends in:</span>
                            <CountdownTimer targetDate={new Date("2026-03-01")} />
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                    {flashProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            slug={product.slug}
                            image={product.images[0]}
                            b2cPrice={product.b2cPrice}
                            stock={product.stock}
                            flashDeal={product.flashDeal}
                            category={product.category.name}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
