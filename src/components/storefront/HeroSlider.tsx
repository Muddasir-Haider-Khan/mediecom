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
            <div className="relative h-[500px] lg:h-[600px]">
                {heroSlides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                    >
                        <div
                            className={`h-full bg-gradient-to-r ${slide.gradient} relative flex items-center`}
                        >
                            {/* Dark Overlay for Contrast */}
                            <div className="absolute inset-0 bg-black/20" />

                            <div className="container-custom relative z-10">
                                <div className="max-w-2xl space-y-8 animate-fade-in">
                                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm">
                                        <span className="w-2.5 h-2.5 rounded-full bg-accent-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                                        <span className="text-sm font-semibold text-white tracking-wide">
                                            MedSurgX Premium Store
                                        </span>
                                    </div>
                                    <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] drop-shadow-sm">
                                        {slide.title}
                                    </h2>
                                    <p className="text-xl sm:text-2xl text-white/90 max-w-lg font-light leading-relaxed drop-shadow-sm">
                                        {slide.subtitle}
                                    </p>
                                    <Link
                                        href={slide.href}
                                        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-surface-900 font-bold text-lg hover:bg-surface-50 hover:scale-105 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                                    >
                                        {slide.cta}
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none">
                                <div className="absolute top-10 right-10 w-96 h-96 rounded-full border border-white/30 animate-float" />
                                <div className="absolute bottom-20 right-40 w-64 h-64 rounded-full border border-white/20 animate-float" style={{ animationDelay: "1s" }} />
                                <div className="absolute top-1/2 right-20 text-[300px] font-display font-bold text-white/10 leading-none select-none">+</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <button
                onClick={prev}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 z-20 group"
            >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
                onClick={next}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 z-20 group"
            >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`transition-all duration-500 rounded-full shadow-sm ${index === current
                            ? "w-12 h-3 bg-white"
                            : "w-3 h-3 bg-white/40 hover:bg-white/60"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}
