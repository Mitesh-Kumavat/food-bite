import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { connectDB } from "@/config/db";
import Restaurant from "@/models/restaurant.model";
import Dish from "@/models/dish.model";

// Add new menu item
export async function POST(req: NextRequest) {
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

    // Check if restaurant exists for the logged-in user
    const restaurant = await Restaurant.findOne({ owner: payload._id });
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    // Create new dish with additional fields
    const menuItem = await Dish.create({
      restaurant: restaurant._id,
      name,
      ingredients,
      price,
      activeOnMenu: true, // Default to active when added manually
      category,
      prepTime,
      allergens,
      description,
      isEphemeral,
      ephemeralExpiresAt: isEphemeral ? ephemeralExpiresAt : null,
    });
    console.log(menuItem)
    // Update restaurant's menu array
    await Restaurant.findByIdAndUpdate(restaurant._id, {
      $push: { menu: menuItem._id },
    });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    console.error("Add menu error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get all menu items
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

    // Fetch all menu items for the restaurant
    const menuItems = await Dish.find({
      restaurant: restaurant._id,
      activeOnMenu: true, // Only show active dishes
    });

    return NextResponse.json(menuItems, { status: 200 });
  } catch (error) {
    console.error("Get menu error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete menu item (optional, if needed)
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const payload = await verifyAuth(req);
    const { dishId } = await req.json();

    const restaurant = await Restaurant.findOne({ owner: payload._id });
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    const dish = await Dish.findOneAndDelete({
      _id: dishId,
      restaurant: restaurant._id,
    });

    if (!dish) {
      return NextResponse.json(
        { error: "Dish not found or already deleted" },
        { status: 404 }
      );
    }

    // Remove dish reference from restaurant menu
    await Restaurant.findByIdAndUpdate(restaurant._id, {
      $pull: { menu: dish._id },
    });

    return NextResponse.json(
      { message: "Dish deleted successfully" },
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
