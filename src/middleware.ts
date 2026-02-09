import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req: NextRequest & { auth: { user?: { role?: string } } | null }) => {
    const { pathname } = req.nextUrl;
    const user = req.auth?.user;

    // Admin routes protection
    if (pathname.startsWith("/admin")) {
        if (!user) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        if (user.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // B2B routes protection
    if (pathname.startsWith("/b2b") && !pathname.startsWith("/b2b/login") && !pathname.startsWith("/b2b/register")) {
        if (!user) {
            return NextResponse.redirect(new URL("/b2b/login", req.url));
        }
        if (user.role !== "B2B_CLIENT" && user.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // Customer dashboard protection
    if (pathname.startsWith("/dashboard")) {
        if (!user) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/admin/:path*", "/b2b/:path*", "/dashboard/:path*"],
};
