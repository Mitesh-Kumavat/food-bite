import mongoose, { Schema, Document } from "mongoose";

export interface IDailySale extends Document {
  restaurant: mongoose.Types.ObjectId;
  dish: mongoose.Types.ObjectId; // reference to Dish
  quantitySold: number;
  saleDate: Date;
}

const dailySaleSchema = new Schema<IDailySale>({
  restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
  dish: { type: Schema.Types.ObjectId, ref: "Dish", required: true },
  quantitySold: { type: Number, required: true },
  saleDate: { type: Date, default: Date.now },
});

const DailySale =
  mongoose.models?.DailySale || mongoose.model<IDailySale>("DailySale", dailySaleSchema);
export default DailySale;
