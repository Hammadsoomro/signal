import mongoose, { Document, Schema } from "mongoose";

export interface IPhoneNumber extends Document {
  userId: mongoose.Types.ObjectId;
  number: string;
  label: string;
  city: string;
  state: string;
  country: string;
  isActive: boolean;
  purchaseDate: Date;
  monthlyPrice: number;
  assignedTo?: mongoose.Types.ObjectId | null; // sub-account id
  provider: string;
  capabilities: string[]; // ["SMS", "Voice", "MMS"]
  createdAt: Date;
  updatedAt: Date;
}

const PhoneNumberSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    number: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    monthlyPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubAccount",
      default: null,
    },
    provider: {
      type: String,
      default: "SMS Service",
    },
    capabilities: {
      type: [String],
      default: ["SMS", "Voice"],
    },
  },
  {
    timestamps: true,
  }
);

// Add compound indexes for better query performance
PhoneNumberSchema.index({ userId: 1, isActive: 1 });
PhoneNumberSchema.index({ userId: 1, assignedTo: 1 });
PhoneNumberSchema.index({ number: 1 }, { unique: true });

export default mongoose.model<IPhoneNumber>("PhoneNumber", PhoneNumberSchema);
