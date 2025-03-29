import mongoose, { Schema, Document } from "mongoose";

export interface IIngredient {
  name: string;
  quantity: number; // per dish
  unit: string;
  // Optional: you can store a reference to inventory details if needed
}

export interface IDish extends Document {
  restaurant: mongoose.Types.ObjectId;
  name: string;
  ingredients: IIngredient[];
  price: number;
  activeOnMenu?: boolean;
  category: string;
  prepTime: number;
  allergens: string[];
  description: string;
  isEphemeral: boolean;
  ephemeralExpiresAt?: Date; // if set, use a TTL index on this field
  createdAt?: Date;
}

const ingredientSchema = new Schema<IIngredient>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
});

const dishSchema = new Schema<IDish>({
  restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
  name: { type: String, required: true },
  ingredients: { type: [ingredientSchema], required: true },
  price: { type: Number, required: true },
  activeOnMenu: { type: Boolean, default: false },
  category: {type:String, required: true},
  prepTime: {type: Number, required: true},
  allergens: {type: [String]},
  isEphemeral: {type: Boolean, default: false},
  ephemeralExpiresAt: { type: Date },
},
{
    timestamps: true,
});

// If using ephemeralExpiresAt, create a TTL index that automatically deletes the document after expiry.
dishSchema.index({ ephemeralExpiresAt: 1 }, { expireAfterSeconds: 0 });

const Dish = mongoose.models?.Dish || mongoose.model<IDish>("Dish", dishSchema);
export default Dish;
