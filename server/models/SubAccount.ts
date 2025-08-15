import mongoose, { Document, Schema } from "mongoose";

export interface ISubAccount extends Document {
  userId: mongoose.Types.ObjectId; // Parent user ID
  name: string;
  email: string;
  walletBalance: number;
  assignedNumbers: mongoose.Types.ObjectId[]; // Array of phone number IDs
  permissions: {
    canSendSMS: boolean;
    canBuyNumbers: boolean;
    canManageWallet: boolean;
    canViewAnalytics: boolean;
  };
  status: "active" | "suspended" | "pending" | "deleted";
  createdAt: Date;
  updatedAt: Date;
}

const SubAccountSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    walletBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    assignedNumbers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PhoneNumber",
      },
    ],
    permissions: {
      canSendSMS: {
        type: Boolean,
        default: true,
      },
      canBuyNumbers: {
        type: Boolean,
        default: false, // Sub-accounts cannot buy numbers by default
      },
      canManageWallet: {
        type: Boolean,
        default: false, // Sub-accounts cannot manage wallet by default
      },
      canViewAnalytics: {
        type: Boolean,
        default: true,
      },
    },
    status: {
      type: String,
      enum: ["active", "suspended", "pending", "deleted"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Add compound indexes for better query performance
SubAccountSchema.index({ userId: 1, status: 1 });
SubAccountSchema.index({ email: 1 }, { unique: true });

// Ensure max 3 active sub-accounts per user
SubAccountSchema.pre("save", async function (next) {
  if (this.isNew && this.status !== "deleted") {
    const count = await (this.constructor as any).countDocuments({
      userId: this.userId,
      status: { $ne: "deleted" }
    });
    if (count >= 3) {
      const error = new Error("Maximum 3 sub-accounts allowed per user");
      return next(error);
    }
  }
  next();
});

export default mongoose.model<ISubAccount>("SubAccount", SubAccountSchema);
