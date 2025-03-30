import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { connectDB } from "@/config/db";
import Restaurant from "@/models/restaurant.model";
import DailySale from "@/models/dailysales.model";
import Inventory from "@/models/inventory .model";
import ProfitLoss from "@/models/profitloss.model";

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

    // ✅ 1. Get Total Revenue from DailySale
    const totalRevenueData = await DailySale.aggregate([
      { $match: { restaurant: restaurant._id } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalSales" } } },
    ]);

    const totalRevenue = totalRevenueData.length > 0 ? totalRevenueData[0].totalRevenue : 0;

    // ✅ 2. Get Inventory Value and Total Items
    const inventoryData = await Inventory.aggregate([
      { $match: { restaurant: restaurant._id } },
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ["$quantity", "$purchasePrice"] } },
          totalItems: { $sum: "$quantity" },
        },
      },
    ]);

    const inventoryValue = inventoryData.length > 0 ? inventoryData[0].totalValue : 0;
    const inventoryItems = inventoryData.length > 0 ? inventoryData[0].totalItems : 0;

    // ✅ 3. Get Menu Items Sold from DailySale
    const menuItemsData = await DailySale.aggregate([
      { $match: { restaurant: restaurant._id } },
      { $unwind: "$dishes" },
      {
        $group: {
          _id: null,
          totalItemsSold: { $sum: "$dishes.quantity" },
        },
      },
    ]);

    const menuItemsSold = menuItemsData.length > 0 ? menuItemsData[0].totalItemsSold : 0;

    // ✅ 4. Get Profit/Loss from ProfitLoss (latest record)
    const latestProfitLoss = await ProfitLoss.findOne({
      restaurant: restaurant._id,
    })
      .sort({ createdAt: -1 })
      .select("profit");

    const profitLoss = latestProfitLoss ? latestProfitLoss.profit : 0;

    // ✅ 5. Get Sales Data (Last 10 Days)
    const salesData = await DailySale.aggregate([
      { $match: { restaurant: restaurant._id } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$totalSales" },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 10 },
      { $sort: { _id: 1 } },
    ]);

    const formattedSalesData = salesData.map((sale) => ({
      date: sale._id,
      amount: sale.amount,
    }));

    // ✅ 6. Get Inventory Status (Grouped by Categories)
    const inventoryStatusData = await Inventory.aggregate([
      { $match: { restaurant: restaurant._id } },
      {
        $group: {
          _id: "$category",
          value: { $sum: { $multiply: ["$quantity", "$purchasePrice"] } },
        },
      },
    ]);

    const categoryColors: any = {
      Produce: "#4CAF50",
      Meat: "#F44336",
      Dairy: "#2196F3",
      Grains: "#FF9800",
      Beverages: "#9C27B0",
    };

    const inventoryStatus = inventoryStatusData.map((item) => ({
      name: item._id,
      value: item.value,
      color: categoryColors[item._id] || "#607D8B", // Default color if not in list
    }));

    // ✅ 7. Final Dashboard Data Response
    const dashboardData = {
      totalRevenue,
      inventoryValue,
      inventoryItems,
      menuItemsSold,
      profitLoss,
      salesData: formattedSalesData,
      inventoryStatus,
    };

    return NextResponse.json(dashboardData, { status: 200 });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
