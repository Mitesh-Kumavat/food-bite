import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { connectDB } from "@/config/db";
import Waste from "@/models/waste.model";
import Restaurant from "@/models/restaurant.model";
import Inventory from "@/models/inventory .model";

// ✅ Get waste records
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const payload = await verifyAuth(req);

    // Get the restaurant associated with the logged-in user
    const restaurant = await Restaurant.findOne({ owner: payload._id });
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query: any = { restaurant: restaurant._id };

    // ✅ Filter by date if provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // ✅ Get waste records with inventory item populated (if applicable)
    const wasteRecords = await Waste.find(query)
      .populate("inventoryItem")
      .sort({ date: -1 });

    return NextResponse.json(wasteRecords, { status: 200 });
  } catch (error) {
    console.error("Get waste records error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ✅ Record manual waste
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const payload = await verifyAuth(req);
    const { quantity, reason, description, inventoryItemId } = await req.json();

    // Get the restaurant associated with the logged-in user
    const restaurant = await Restaurant.findOne({ owner: payload._id });
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    let inventoryItem = null;

    // ✅ Check if inventoryItemId is provided and fetch the item
    if (inventoryItemId) {
      inventoryItem = await Inventory.findOne({
        _id: inventoryItemId,
        restaurant: restaurant._id,
      });

      if (!inventoryItem) {
        return NextResponse.json(
          { error: "Inventory item not found" },
          { status: 404 }
        );
      }

      // ✅ Deduct quantity from inventory if applicable
      if (inventoryItem.quantity < quantity) {
        return NextResponse.json(
          { error: `Insufficient inventory for ${inventoryItemId}` },
          { status: 400 }
        );
      }

      // ✅ Deduct quantity or delete if exhausted
      if (inventoryItem.quantity === quantity) {
        await Inventory.findByIdAndDelete(inventoryItem._id);
      } else {
        await Inventory.findByIdAndUpdate(inventoryItem._id, {
          $inc: { quantity: -quantity },
        });
      }
    }

    const cost = quantity * inventoryItem.purchasePrice;
    // ✅ Create waste record
    const wasteRecord = await Waste.create({
      restaurant: restaurant._id,
      inventoryItem: inventoryItem.itemName ? inventoryItem._id : null,
      itemName: inventoryItem.itemName,
      quantity,
      price: inventoryItem.purchasePrice,
      cost,
      unit: inventoryItem.unit,
      reason,
      description,
    });

    return NextResponse.json(wasteRecord, { status: 201 });
  } catch (error) {
    console.error("Record waste error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}