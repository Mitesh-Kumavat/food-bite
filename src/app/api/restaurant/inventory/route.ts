import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { connectDB } from '@/config/db';
import Restaurant from '@/models/restaurant.model';
import Inventory from '@/models/inventory .model';

// Add new inventory item
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const payload = await verifyAuth(req);
    const { itemName, quantity, unit, category,purchasePrice, expiryDate } = await req.json();
    console.log(payload)
    const restaurant = await Restaurant.findOne({ owner: payload._id });
    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }
    let newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + expiryDate);
    const inventory = await Inventory.create({
      restaurant: restaurant._id,
      itemName,
      quantity,
      unit,
      category,
      purchasePrice,
      expiryDate: newExpiry
    });

    // Update restaurant's inventory array
    await Restaurant.findByIdAndUpdate(
      restaurant._id,
      { $push: { inventory: inventory._id } }
    );

    return NextResponse.json(inventory, { status: 201 });
  } catch (error) {
    console.error('Add inventory error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get all inventory items
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const payload = await verifyAuth(req);

    const restaurant = await Restaurant.findOne({ owner: payload._id });
    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    const inventory = await Inventory.find({ restaurant: restaurant._id });
    return NextResponse.json(inventory, { status: 200 });
  } catch (error) {
    console.error('Get inventory error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}