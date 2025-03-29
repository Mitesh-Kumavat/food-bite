import mongoose, { Schema, Document } from "mongoose";

export interface IRestaurant extends Document {
  name: string;
  owner: mongoose.Types.ObjectId; // reference to a User if needed
  address?: string;
  createdAt?: Date;
}

const restaurantSchema = new Schema<IRestaurant>({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  address: { type: String },
  
},
{
    timestamps: true,
}
);

const Restaurant =
  mongoose.models?.Restaurant || mongoose.model<IRestaurant>("Restaurant", restaurantSchema);
export default Restaurant;
