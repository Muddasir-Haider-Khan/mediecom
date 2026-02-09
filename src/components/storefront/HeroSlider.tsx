"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { heroSlides } from "@/lib/mock-data";

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const prev = () =>
        setCurrent((c) => (c - 1 + heroSlides.length) % heroSlides.length);
    const next = () => setCurrent((c) => (c + 1) % heroSlides.length);

    return (
        <section className="relative overflow-hidden">
            <div className="relative h-[320px] sm:h-[400px] lg:h-[500px]">
                {heroSlides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === current
                                ? "opacity-100 translate-x-0"
                                : index < current
                                    ? "opacity-0 -translate-x-full"
                                    : "opacity-0 translate-x-full"
                            }`}
                    >
                        <div
                            className={`h-full bg-gradient-to-r ${slide.gradient} flex items-center`}
                        >
                            <div className="container-custom">
                                <div className="max-w-xl space-y-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                                        <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
                                        <span className="text-xs font-medium text-white/90">
                                            MedSurgX Premium Store
                                        </span>
                                    </div>
                                    <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                                        {slide.title}
                                    </h2>
                                    <p className="text-lg text-white/70 max-w-md">
                                        {slide.subtitle}
                                    </p>
                                    <Link
                                        href={slide.href}
                                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-surface-900 font-semibold hover:bg-white/90 transition shadow-lg"
                                    >
                                        {slide.cta}
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute right-0 top-0 w-1/2 h-full opacity-10">
                                <div className="absolute top-10 right-10 w-64 h-64 rounded-full border-2 border-white animate-float" />
                                <div className="absolute bottom-10 right-32 w-40 h-40 rounded-full border border-white/50" />
                                <div className="absolute top-1/2 right-20 text-[200px] opacity-30">+</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition z-10"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition z-10"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`transition-all duration-300 rounded-full ${index === current
                                ? "w-8 h-2.5 bg-white"
                                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}
