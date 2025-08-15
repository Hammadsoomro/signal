import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: "credit" | "debit";
  amount: number;
  description: string;
  status: "completed" | "pending" | "failed";
  reference?: string;
  relatedTo?: {
    type: "phone_number" | "sms" | "subscription" | "topup";
    id?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["completed", "pending", "failed"],
      default: "completed",
    },
    reference: {
      type: String,
      trim: true,
    },
    relatedTo: {
      type: {
        type: String,
        enum: ["phone_number", "sms", "subscription", "topup"],
      },
      id: String,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ userId: 1, type: 1 });
TransactionSchema.index({ reference: 1 });

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
