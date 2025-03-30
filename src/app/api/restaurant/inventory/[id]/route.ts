import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { connectDB } from '@/config/db';
import Restaurant from '@/models/restaurant.model';
import Inventory from '@/models/inventory .model';

// Update inventory item
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const payload = await verifyAuth(req);
    const { itemName, quantity, unit, purchasePrice, expiryDate } = await req.json();

    const restaurant = await Restaurant.findOne({ owner: payload._id });
    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    const { id } = await params;

    const inventory = await Inventory.findOneAndUpdate(
      { _id: id, restaurant: restaurant._id },
      { itemName, quantity, unit, purchasePrice, expiryDate },
      { new: true }
    );

    if (!inventory) {
      return NextResponse.json(
        { error: 'Inventory item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(inventory, { status: 200 });
  } catch (error) {
    console.error('Update inventory error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete inventory item
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const payload = await verifyAuth(req);

    const restaurant = await Restaurant.findOne({ owner: payload._id });
    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    const inventory = await Inventory.findOneAndDelete({
      _id: id,
      restaurant: restaurant._id
    });

    if (!inventory) {
      return NextResponse.json(
        { error: 'Inventory item not found' },
        { status: 404 }
      );
    }

    // Remove inventory reference from restaurant
    await Restaurant.findByIdAndUpdate(
      restaurant._id,
      { $pull: { inventory: id } }
    );

    return NextResponse.json(
      { message: 'Inventory item deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete inventory error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}