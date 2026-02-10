"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, FileText, LogOut, Menu, X, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const links = [
    { name: "Dashboard", href: "/b2b/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/b2b/products", icon: Package },
    { name: "Orders", href: "/b2b/orders", icon: ShoppingCart },
    { name: "Invoices", href: "/b2b/invoices", icon: FileText },
];

export default function B2BLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (status === "loading") return;
        if (!session || (session.user.role !== "B2B_CLIENT" && session.user.role !== "ADMIN")) {
            router.push("/b2b/login");
        }
    }, [session, status, router]);

    if (pathname === "/b2b/login" || pathname === "/b2b/register") {
        return <>{children}</>;
    }

    if (status === "loading" || !session || (session.user.role !== "B2B_CLIENT" && session.user.role !== "ADMIN")) {
        return null;
    }

    return (
        <div className="min-h-screen bg-surface-50 flex">
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
            <aside className={cn(
                "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-primary-900 flex flex-col transition-transform lg:translate-x-0",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center gap-3 px-6 h-16 border-b border-primary-800">
                    <Building2 className="w-6 h-6 text-primary-300" />
                    <div>
                        <h1 className="font-display font-bold text-sm text-white leading-none">MedSurgX</h1>
                        <p className="text-[9px] text-primary-400 leading-none mt-0.5">B2B Portal</p>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-primary-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <nav className="flex-1 py-4 px-3 space-y-1">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link key={link.name} href={link.href} onClick={() => setSidebarOpen(false)}
                                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition",
                                    isActive ? "bg-white/15 text-white" : "text-primary-300 hover:text-white hover:bg-white/10"
                                )}>
                                <link.icon className="w-4 h-4" />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-primary-800">
                    <Link href="/" className="flex items-center gap-2 text-primary-400 text-xs hover:text-white transition">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </Link>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="sticky top-0 z-30 h-16 bg-white border-b border-surface-100 flex items-center px-6">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-surface-600 mr-4">
                        <Menu className="w-5 h-5" />
                    </button>
                    <h2 className="font-display font-semibold text-sm text-surface-900">B2B Wholesale Portal</h2>
                </header>
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
