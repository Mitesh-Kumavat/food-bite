import mongoose, { Schema, Document } from "mongoose";

export interface IWaste extends Document {
  restaurant: mongoose.Types.ObjectId;
  inventoryItem: mongoose.Types.ObjectId; // reference to Inventory (if applicable)
  itemName: string;
  price: number;
  cost: number;
  quantity: number;
  unit: string;
  reason: string;
  description: string;
  date: Date;
}

const wasteSchema = new Schema<IWaste>({
  restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
  inventoryItem: { type: Schema.Types.ObjectId, ref: "Inventory" },
  itemName: { type: String },
  price: { type: Number },
  cost: { type: Number },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  reason: { type: String, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
},
  {
    timestamps: true,
  });

const Waste =
  mongoose.models?.Waste || mongoose.model<IWaste>("Waste", wasteSchema);
export default Waste;