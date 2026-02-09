"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Search,
    ShoppingCart,
    User,
    Menu,
    X,
    ChevronDown,
    Heart,
    Package,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/mock-data";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const totalItems = useCartStore((s) => s.totalItems());
    const openCart = useCartStore((s) => s.openCart);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 text-white text-center text-xs py-2 px-4">
                <p className="animate-fade-in">
                    🚚 <span className="font-semibold">Free Delivery</span> on orders above PKR 5,000 |{" "}
                    <Link href="/products" className="underline hover:text-accent-300 transition">
                        Shop Now
                    </Link>
                </p>
            </div>

            {/* Main Header */}
            <header
                className={cn(
                    "sticky top-0 z-50 transition-all duration-300",
                    isScrolled
                        ? "bg-white/95 backdrop-blur-xl shadow-soft"
                        : "bg-white"
                )}
            >
                <div className="container-custom">
                    <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-glow">
                                <span className="text-white font-display font-bold text-lg">M</span>
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="font-display font-bold text-xl text-surface-900 leading-none">
                                    Med<span className="text-primary-700">SurgX</span>
                                </h1>
                                <p className="text-[10px] text-surface-500 leading-none">Medical Technology</p>
                            </div>
                        </Link>

                        {/* Search Bar — Desktop */}
                        <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
                            <div className="relative w-full group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-primary-600 transition" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search surgical instruments, diagnostic equipment..."
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface-50 border border-surface-200 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200"
                                />
                                {searchQuery && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-surface-100 p-4 z-50">
                                        <p className="text-sm text-surface-500">
                                            Search results for &quot;{searchQuery}&quot;...
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            {/* Mobile Search Toggle */}
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="lg:hidden p-2.5 rounded-xl text-surface-600 hover:bg-surface-100 transition"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Wishlist */}
                            <Link
                                href="/wishlist"
                                className="hidden sm:flex p-2.5 rounded-xl text-surface-600 hover:bg-surface-100 transition relative"
                            >
                                <Heart className="w-5 h-5" />
                            </Link>

                            {/* Orders */}
                            <Link
                                href="/dashboard"
                                className="hidden sm:flex p-2.5 rounded-xl text-surface-600 hover:bg-surface-100 transition"
                            >
                                <Package className="w-5 h-5" />
                            </Link>

                            {/* Cart */}
                            <button
                                onClick={openCart}
                                className="p-2.5 rounded-xl text-surface-600 hover:bg-surface-100 transition relative"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-accent-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse-soft">
                                        {totalItems}
                                    </span>
                                )}
                            </button>

                            {/* Account */}
                            <Link
                                href="/login"
                                className="hidden sm:flex items-center gap-2 pl-3 pr-4 py-2 rounded-xl bg-primary-700 text-white text-sm font-medium hover:bg-primary-800 transition shadow-sm"
                            >
                                <User className="w-4 h-4" />
                                <span>Account</span>
                            </Link>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2.5 rounded-xl text-surface-600 hover:bg-surface-100 transition"
                            >
                                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Category Nav — Desktop */}
                    <nav className="hidden lg:flex items-center gap-1 pb-3 overflow-x-auto scrollbar-hide">
                        <Link
                            href="/products"
                            className="px-3 py-1.5 text-sm font-medium text-surface-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition whitespace-nowrap"
                        >
                            All Products
                        </Link>
                        {categories.slice(0, 8).map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/products?category=${cat.slug}`}
                                className="px-3 py-1.5 text-sm font-medium text-surface-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition whitespace-nowrap flex items-center gap-1.5"
                            >
                                <span>{cat.icon}</span>
                                {cat.name}
                            </Link>
                        ))}
                        <button className="px-3 py-1.5 text-sm font-medium text-surface-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition whitespace-nowrap flex items-center gap-1">
                            More <ChevronDown className="w-3 h-3" />
                        </button>
                    </nav>
                </div>

                {/* Mobile Search Drawer */}
                {isSearchOpen && (
                    <div className="lg:hidden border-t border-surface-100 p-4 animate-slide-up">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                autoFocus
                            />
                        </div>
                    </div>
                )}

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-surface-100 bg-white animate-slide-up">
                        <div className="container-custom py-4 space-y-2">
                            <Link href="/login" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition">
                                <User className="w-5 h-5 text-surface-500" />
                                <span className="text-sm font-medium">Sign In / Register</span>
                            </Link>
                            <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition">
                                <Package className="w-5 h-5 text-surface-500" />
                                <span className="text-sm font-medium">My Orders</span>
                            </Link>
                            <Link href="/wishlist" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition">
                                <Heart className="w-5 h-5 text-surface-500" />
                                <span className="text-sm font-medium">Wishlist</span>
                            </Link>
                            <hr className="my-2 border-surface-100" />
                            <p className="text-xs font-semibold text-surface-400 uppercase px-3">Categories</p>
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/products?category=${cat.slug}`}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span className="text-lg">{cat.icon}</span>
                                    <span className="text-sm font-medium">{cat.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}
