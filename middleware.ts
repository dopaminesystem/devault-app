import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

// Mobile user-agent detection helper
function isMobileUserAgent(userAgent: string | null): boolean {
    if (!userAgent) return false;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
}

export default async function authMiddleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Mobile blocking disabled - experimental mobile mode is now enabled
    // Mobile users will see an experimental banner instead

    // Only check auth for dashboard routes
    if (pathname.startsWith("/dashboard")) {
        const { data: session } = await betterFetch<Session>(
            "/api/auth/get-session",
            {
                baseURL: request.nextUrl.origin,
                headers: {
                    cookie: request.headers.get("cookie") || "",
                },
            },
        );

        if (!session) {
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/v/:path*", "/"],
};
