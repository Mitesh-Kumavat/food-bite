import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { connectDB } from "@/config/db";
import Restaurant from "@/models/restaurant.model";
import DailySale from "@/models/dailysales.model";
import Dish from "@/models/dish.model";
import Inventory from "@/models/inventory .model";
import HistoryDish from "@/models/historyDish.model";
// Record daily sales
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const payload = await verifyAuth(req);
        const { dishes } = await req.json();
        if (!Array.isArray(dishes)) {
            return NextResponse.json(
                { error: "Invalid data format. Expected an array of dishes." },
                { status: 400 }
            );
        }

        // Get restaurant by user
        const restaurant = await Restaurant.findOne({ owner: payload._id });
        if (!restaurant) {
            return NextResponse.json(
                { error: "Restaurant not found" },
                { status: 404 }
            );
        }

        let totalSales = 0;
        const dishesWithDetails = [];

        // Calculate total sales and update inventory
        for (const dish of dishes) {
            const menuItem = await Dish.findById(dish.dishId);
            if (!menuItem) {
                return NextResponse.json(
                    { error: `Menu item ${dish.dishId} not found` },
                    { status: 404 }
                );
            }

            totalSales += menuItem.price * dish.quantity;
            dishesWithDetails.push({
                dish: dish.dishId,
                quantity: dish.quantity,
            });

            // ✅ Check if the dish is ephemeral and record in HistoryDish
            if (menuItem.isEphemeral) {
                const existingHistory = await HistoryDish.findOne({
                    dishId: menuItem._id,
                    restaurant: restaurant._id,
                });

                if (existingHistory) {
                    // Update the existing history entry if it already exists
                    await HistoryDish.findByIdAndUpdate(existingHistory._id, {
                        $inc: {
                            totalSales: menuItem.price * dish.quantity,
                            totalQuantitySold: dish.quantity,
                        },
                    });
                } else {
                    // Create a new record for ephemeral dish
                    await HistoryDish.create({
                        restaurant: restaurant._id,
                        dishId: menuItem._id,
                        name: menuItem.name,
                        ingredients: menuItem.ingredients,
                        price: menuItem.price,
                        category: menuItem.category,
                        prepTime: menuItem.prepTime,
                        allergens: menuItem.allergens,
                        description: menuItem.description,
                        isEphemeral: true,
                        ephemeralExpiresAt: menuItem.ephemeralExpiresAt,
                        totalSales: menuItem.price * dish.quantity,
                        totalQuantitySold: dish.quantity,
                    });
                }
            }

            // Update inventory for each ingredient
            for (const ingredient of menuItem.ingredients) {
                let remainingQuantity = ingredient.quantity * dish.quantity;

                // Find inventory items of the same ingredient, sorted by oldest first
                const inventoryItems = await Inventory.find({
                    restaurant: restaurant._id,
                    itemName: ingredient.name,
                }).sort({ purchaseDate: 1 });

                if (!inventoryItems.length) {
                    return NextResponse.json(
                        { error: `Inventory item ${ingredient.name} not found` },
                        { status: 404 }
                    );
                }

                for (const inventoryItem of inventoryItems) {
                    if (remainingQuantity <= 0) break;

                    if (inventoryItem.quantity <= remainingQuantity) {
                        remainingQuantity -= inventoryItem.quantity;
                        await Inventory.findByIdAndDelete(inventoryItem._id);
                    } else {
                        await Inventory.findByIdAndUpdate(inventoryItem._id, {
                            $inc: { quantity: -remainingQuantity, usedQuantity: remainingQuantity },
                        });
                        remainingQuantity = 0;
                    }
                }

                // Check if inventory deduction was successful
                if (remainingQuantity > 0) {
                    return NextResponse.json(
                        { error: `Insufficient ${ingredient.name} in inventory` },
                        { status: 400 }
                    );
                }
            }
        }

        // Create daily sale record
        const dailySale = await DailySale.create({
            restaurant: restaurant._id,
            dishes: dishesWithDetails,
            totalSales,
        });

        // Update restaurant's dailySales array
        await Restaurant.findByIdAndUpdate(restaurant._id, {
            $push: { dailySales: dailySale._id },
        });

        return NextResponse.json(dailySale, { status: 201 });
    } catch (error) {
        console.error("Record sales error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Get sales history
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const payload = await verifyAuth(req);

        // Get restaurant by user
        const restaurant = await Restaurant.findOne({ owner: payload.userId });
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
        if (startDate && endDate) {
            query.saleDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const sales = await DailySale.find(query)
            .populate("dishes.dish")
            .sort({ saleDate: -1 });

        return NextResponse.json(sales, { status: 200 });
    } catch (error) {
        console.error("Get sales error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
