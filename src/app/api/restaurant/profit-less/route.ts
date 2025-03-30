import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { connectDB } from "@/config/db";
import Restaurant from "@/models/restaurant.model";
import DailySale from "@/models/dailysales.model";
import Inventory from "@/models/inventory .model";
import Waste from "@/models/waste.model";
import ProfitLoss from "@/models/profitloss.model";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const payload = await verifyAuth(req);

    // Get restaurant by user
    const restaurant = await Restaurant.findOne({ owner: payload._id });
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    // Get today's date (start and end of day)
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // ✅ 1. Get total sales from DailySale
    const dailySales = await DailySale.find({
      restaurant: restaurant._id,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const totalIncome = dailySales.reduce((sum, sale) => sum + sale.totalSales, 0);

    // ✅ 2. Get total inventory purchased today
    const inventoryPurchased = await Inventory.find({
      restaurant: restaurant._id,
      purchaseDate: { $gte: startOfDay, $lte: endOfDay },
    });

    const totalInventoryCost = inventoryPurchased.reduce(
      (sum, item) => sum + item.purchaseCost * item.quantity,
      0
    );

    // ✅ 3. Get total waste cost today
    const wasteRecords = await Waste.find({
      restaurant: restaurant._id,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const totalWasteCost = wasteRecords.reduce(
      (sum, waste) => sum + waste.quantity * waste.unitCost,
      0
    );

    // ✅ 4. Calculate profit/loss
    const profit = totalIncome - (totalInventoryCost + totalWasteCost);

    // ✅ 5. Save the profit/loss in ProfitLoss
    const profitLossRecord = await ProfitLoss.create({
      restaurant: restaurant._id,
      date: new Date(),
      totalIncome,
      totalWasteCost,
      profit,
    });

    return NextResponse.json(profitLossRecord, { status: 201 });
  } catch (error) {
    console.error("Profit/Loss calculation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ✅ Get profit/loss history (optional)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const payload = await verifyAuth(req);

    // Get restaurant by user
    const restaurant = await Restaurant.findOne({ owner: payload._id });
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    // Optional: Query by startDate and endDate
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query: any = { restaurant: restaurant._id };
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const profitLossRecords = await ProfitLoss.find(query).sort({ date: -1 });

    return NextResponse.json(profitLossRecords, { status: 200 });
  } catch (error) {
    console.error("Get profit/loss error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}