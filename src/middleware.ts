import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./utils/verifyToken";
import ApiResponse from "./utils/ApiResponse";

const protectedAPIRoutes = ["/api/logout", "/api/me", ];
const protectedFrontendRoutes = ["/dashboard", "dashboard/.."];

export async function middleware(req: NextRequest) {
    const { nextUrl, cookies } = req;
    const token = cookies.get("token")?.value;
    const absoluteLoginURL = `${nextUrl.origin}/login`;
    const absoluteDashboardURL = `${nextUrl.origin}/dashboard`;

    const isProtectedAPIRoute = protectedAPIRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
    );

    const isProtectedFrontendRoute = protectedFrontendRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
    );

    if ((nextUrl.pathname === "/login" || nextUrl.pathname === "/signup" || nextUrl.pathname === "/") && token) {
        return NextResponse.redirect(absoluteDashboardURL);
    }

    if (isProtectedAPIRoute) {
        if (!token) {
            const response = new ApiResponse("Unauthorized user", 401, { error: "Invalid token" });
            return NextResponse.json(response, { status: 401 });
        }

        try {
            const decodedToken: any = await verifyToken(token);

            if (!decodedToken || !decodedToken.payload._id) {
                return NextResponse.json({ error: "Invalid Token" }, { status: 403 });
            }

            const res = NextResponse.next();
            res.headers.set("x-user-id", decodedToken.payload._id); // Attach userId in header
            return res;
        } catch (_error) {
            return NextResponse.json({ error: "Invalid Token" }, { status: 403 });
        }
    }

    if (isProtectedFrontendRoute && !token) {
        return NextResponse.redirect(absoluteLoginURL);
    }

    return NextResponse.next();
}
