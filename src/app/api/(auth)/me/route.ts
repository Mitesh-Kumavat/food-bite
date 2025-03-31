import { connectDB } from "@/config/db"
import Restaurant from "@/models/restaurant.model";
import User from "@/models/user.model";
import ApiResponse from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const userId = req.headers.get('x-user-id');
        console.log("USER ID: ", userId);

        if (!userId) {
            const response = new ApiResponse("Unauthorized request", 401);
            return NextResponse.json(response, { status: 401 });
        }


        const user = await User.findById(userId).select("-password -accessToken");
        const restaurantName = await Restaurant.find({ owner: user._id }).select("name");
        if (!user) {
            const response = new ApiResponse("User not found", 404);
            return NextResponse.json(response, { status: 404 });
        }
        const finalUser = {
            ...user._doc,
            restaurantName: restaurantName[0]?.name || null,
        }
        const response = new ApiResponse("User found", 200, finalUser);

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.log("ERROR IN POST REQUEST OF USER: ", error);
    }
}