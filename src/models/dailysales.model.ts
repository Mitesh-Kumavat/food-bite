import mongoose, { Schema, Document } from "mongoose";

export interface IDishSold {
  dish: mongoose.Types.ObjectId; // Reference to Dish
  quantity: number; // Quantity sold for each dish
}

export interface IDailySale extends Document {
  restaurant: mongoose.Types.ObjectId; // Reference to Restaurant
  dishes: IDishSold[]; // Array of sold dishes
  totalSales: number; // Total revenue for the sale
  saleDate: Date; // Date of the sale
}

const dishSoldSchema = new Schema<IDishSold>({
  dish: { type: Schema.Types.ObjectId, ref: "Dish", required: true },
  quantity: { type: Number, required: true },
});

const dailySaleSchema = new Schema<IDailySale>(
  {
    restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
    dishes: { type: [dishSoldSchema], required: true },
    totalSales: { type: Number, required: true },
    saleDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const DailySale =
  mongoose.models?.DailySale || mongoose.model<IDailySale>("DailySale", dailySaleSchema);

export default DailySale;
