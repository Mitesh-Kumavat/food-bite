import { connectDB } from "@/config/db";
import User from "@/models/user.model";
import ApiResponse from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

// route: BASE_URL/api/auth/signup , POST request

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const { email, userName, password } = await req.json();

        if (!email || !userName || !password) {
            const response = new ApiResponse("Please fill in all fields", 400);
            return NextResponse.json(response, { status: 400 });
        }

        if (password.length < 6) {
            const response = new ApiResponse("Password must be at least 6 characters long", 400);
            return NextResponse.json(response, { status: 400 });
        }

        const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!pattern.test(email)) {
            const response = new ApiResponse("Please enter a valid email", 400);
            return NextResponse.json(response, { status: 400 });
        }

        await connectDB();

        const existingser = await User.findOne({ email });

        if (existingser) {
            const response = new ApiResponse("User already exists with this email", 400);
            return NextResponse.json(response, { status: 400 });
        }

        const newUser = new User({ email, userName, password });
        newUser.save();

        const response = new ApiResponse("User created successfully", 201, newUser);
        return NextResponse.json(response, { status: 201 });
    } catch (error: any) {
        console.error(error);
        const response = new ApiResponse("Server error", 500, error?.message);
        return NextResponse.json(response, { status: 500 });
    }
}  