"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    TrendingUp,
    Link2,
    FileText,
    Settings,
    Menu,
    X,
    ChevronDown,
    Bell,
    Search,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Supply Chains", href: "/admin/supply-chains", icon: Link2 },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Sales Tracking", href: "/admin/sales", icon: TrendingUp },
    { name: "Invoices", href: "/admin/invoices", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-surface-50 flex">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-surface-900 flex flex-col transition-transform duration-300 lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 h-16 border-b border-surface-800">
                    <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                        <span className="text-white font-display font-bold text-sm">M</span>
                    </div>
                    <div>
                        <h1 className="font-display font-bold text-sm text-white leading-none">
                            MedSurgX
                        </h1>
                        <p className="text-[9px] text-surface-500 leading-none mt-0.5">
                            Admin Panel
                        </p>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden ml-auto text-surface-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href ||
                            (link.href !== "/admin" && pathname.startsWith(link.href));
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-primary-600 text-white shadow-glow"
                                        : "text-surface-400 hover:text-white hover:bg-surface-800"
                                )}
                            >
                                <link.icon className="w-4 h-4" />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User */}
                <div className="p-4 border-t border-surface-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-700 flex items-center justify-center text-xs font-bold text-white">
                            A
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">Admin User</p>
                            <p className="text-[10px] text-surface-500 truncate">admin@medsurgx.com</p>
                        </div>
                        <button className="text-surface-500 hover:text-white transition">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 h-16 bg-white border-b border-surface-100 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-surface-600 hover:text-surface-900"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="hidden sm:flex items-center w-64">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-50 border border-surface-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="relative p-2 rounded-lg text-surface-500 hover:bg-surface-100 transition">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                        </button>
                        <div className="flex items-center gap-2 pl-3 border-l border-surface-200">
                            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
                                A
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-xs font-semibold text-surface-900">Admin</p>
                                <p className="text-[10px] text-surface-500">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
