import mongoose, { Schema, Document } from "mongoose";

// ✅ Interface for ingredients in HistoryDish
export interface IIngredient {
  name: string;
  quantity: number;
  unit: string;
}

// ✅ Interface for HistoryDish
export interface IHistoryDish extends Document {
  restaurant: mongoose.Types.ObjectId;
  dishId: mongoose.Types.ObjectId; // Original dish reference
  name: string;
  ingredients: IIngredient[];
  price: number;
  category: string;
  prepTime: number;
  allergens: string[];
  description: string;
  isEphemeral: boolean;
  totalSales: number; // Total revenue generated by the dish
  totalQuantitySold: number; // Total quantity sold before deletion
  deletedAt: Date;
}

const ingredientSchema = new Schema<IIngredient>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
});

const historyDishSchema = new Schema<IHistoryDish>(
  {
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    dishId: {
      type: Schema.Types.ObjectId,
      ref: "Dish",
    },
    name: { type: String, required: true },
    ingredients: { type: [ingredientSchema], required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    prepTime: { type: Number, required: true },
    allergens: { type: [String] },
    description: { type: String },
    isEphemeral: { type: Boolean, default: false },
    totalSales: { type: Number, required: true, default: 0 },
    totalQuantitySold: { type: Number, required: true, default: 0 },
    deletedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const HistoryDish =
  mongoose.models?.HistoryDish ||
  mongoose.model<IHistoryDish>("HistoryDish", historyDishSchema);
export default HistoryDish;
