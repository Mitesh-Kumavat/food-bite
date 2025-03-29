import { connectDB } from "@/config/db";
import ApiResponse from "@/utils/ApiResponse";
import Error from "next/error";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
    await connectDB();
    try {
        const cookieStore = await cookies();
        cookieStore.delete("token")
        const response = new ApiResponse("Logout successful", 200);
        return NextResponse.json(response, { status: 200 });
    } catch (error: Error | any) {
        const response = new ApiResponse("An error occurred", 500, error?.message);
        return NextResponse.json(response, { status: 500 });
    }
}