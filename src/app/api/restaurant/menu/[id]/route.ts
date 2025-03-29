import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { connectDB } from "@/config/db";
import Restaurant from "@/models/restaurant.model";
import Dish from "@/models/dish.model";

// Update menu item
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const payload = await verifyAuth(req);
    const {
      name,
      ingredients,
      price,
      category,
      prepTime,
      allergens,
      description,
      isEphemeral,
      ephemeralExpiresAt,
    } = await req.json();

    // Check if the restaurant belongs to the logged-in user
    const restaurant = await Restaurant.findOne({ owner: payload._id });
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    // Update menu item with new fields
    const menuItem = await Dish.findOneAndUpdate(
      { _id: params.id, restaurant: restaurant._id },
      {
        name,
        ingredients,
        price,
        category,
        prepTime,
        allergens,
        description,
        isEphemeral,
        ephemeralExpiresAt: isEphemeral ? ephemeralExpiresAt : null,
      },
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(menuItem, { status: 200 });
  } catch (error) {
    console.error("Update menu error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete menu item
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const payload = await verifyAuth(req);

    // Check if the restaurant belongs to the logged-in user
    const restaurant = await Restaurant.findOne({ owner: payload._id });
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    // Find and delete the dish
    const menuItem = await Dish.findOneAndDelete({
      _id: params.id,
      restaurant: restaurant._id,
    });

    if (!menuItem) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    // Remove dish reference from the restaurant's menu
    await Restaurant.findByIdAndUpdate(restaurant._id, {
      $pull: { menu: params.id },
    });

    return NextResponse.json(
      { message: "Menu item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete menu error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
