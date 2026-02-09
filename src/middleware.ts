import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const role = token?.role as string | undefined;

    // Admin routes protection
    if (pathname.startsWith("/admin")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        if (role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // B2B routes protection
    if (
        pathname.startsWith("/b2b") &&
        !pathname.startsWith("/b2b/login") &&
        !pathname.startsWith("/b2b/register")
    ) {
        if (!token) {
            return NextResponse.redirect(new URL("/b2b/login", req.url));
        }
        if (role !== "B2B_CLIENT" && role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // Customer dashboard protection
    if (pathname.startsWith("/dashboard")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/b2b/:path*", "/dashboard/:path*"],
};
