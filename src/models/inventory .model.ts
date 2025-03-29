import mongoose, { Schema, Document } from "mongoose";

export interface IInventory extends Document {
  restaurant: mongoose.Types.ObjectId;
  itemName: string;
  quantity: number;
  unit: string;
  purchasePrice: number;
  purchaseDate: Date;
  expiryDate: Date;
  enteredBy: "chef" | "manager"; // you can refine roles as needed
}

const inventorySchema = new Schema<IInventory>({
  restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  purchasePrice: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true },
  enteredBy: { type: String, default:"chef" },
},
{
    timestamps: true,
});

const Inventory =
  mongoose.models?.Inventory || mongoose.model<IInventory>("Inventory", inventorySchema);
export default Inventory;
