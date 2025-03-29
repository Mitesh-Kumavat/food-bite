import mongoose from "mongoose";
import User from "@/models/user.model";
import Restaurant from "@/models/restaurant.model";
import Dish from "@/models/dish.model";
import DailySale from "@/models/dailysales.model";
import Inventory from "@/models/inventory .model";
import ProfitLoss from "@/models/profitloss.model";
import Waste from "@/models/waste.model";

export const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        return;
    }

    try {
        console.log(process.env.MONGODB_URI);
        
        await mongoose.connect(process.env.MONGODB_URI!, {
            dbName: process.env.DB_NAME,
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};