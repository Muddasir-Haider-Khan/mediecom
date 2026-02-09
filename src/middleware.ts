import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Check for session cookie (works with both secure and non-secure contexts)
    const hasSession =
        req.cookies.has("next-auth.session-token") ||
        req.cookies.has("__Secure-next-auth.session-token") ||
        req.cookies.has("authjs.session-token") ||
        req.cookies.has("__Secure-authjs.session-token");

    // Admin routes — require login (role check happens in admin layout)
    if (pathname.startsWith("/admin")) {
        if (!hasSession) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // B2B routes — require login (role check happens in b2b layout)
    if (
        pathname.startsWith("/b2b") &&
        !pathname.startsWith("/b2b/login") &&
        !pathname.startsWith("/b2b/register")
    ) {
        if (!hasSession) {
            return NextResponse.redirect(new URL("/b2b/login", req.url));
        }
    }

    // Customer dashboard — require login
    if (pathname.startsWith("/dashboard")) {
        if (!hasSession) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/b2b/:path*", "/dashboard/:path*"],
};
