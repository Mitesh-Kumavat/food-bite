import mongoose, { Schema, Document } from "mongoose";

export interface IProfitLoss extends Document {
  restaurant: mongoose.Types.ObjectId;
  date: Date;
  totalIncome: number;
  totalWasteCost: number;
  profit: number;
}

const profitLossSchema = new Schema<IProfitLoss>({
  restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
  date: { type: Date, default: Date.now },
  totalIncome: { type: Number, required: true },
  totalWasteCost: { type: Number, required: true },
  profit: { type: Number, required: true },
},
{
    timestamps: true,
});

const ProfitLoss =
  mongoose.models?.ProfitLoss || mongoose.model<IProfitLoss>("ProfitLoss", profitLossSchema);
export default ProfitLoss;
