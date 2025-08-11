import mongoose, { Document, Schema } from "mongoose";

export interface IPhoneNumber extends Document {
  number: string;
  label: string;
  country: string;
  state?: string;
  city?: string;
  carrier: string;
  price: number;
  features: string[];
  purchaseDate: Date;
  isActive: boolean;
  userId: string;
  assignedTo?: string; // Sub-account ID or null if assigned to main user
  externalId?: string; // SignalWire number ID
}

export interface ISubAccount extends Document {
  userId: string; // Parent user ID
  name: string;
  email: string;
  walletBalance: number;
  assignedNumbers: string[]; // Array of phone number IDs
  permissions: {
    canSendSMS: boolean;
    canBuyNumbers: boolean;
    canManageWallet: boolean;
    canViewAnalytics: boolean;
  };
  status: "active" | "suspended" | "pending";
  createdAt: Date;
  updatedAt: Date;
}

const PhoneNumberSchema: Schema = new Schema(
  {
    number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    carrier: {
      type: String,
      required: true,
      default: "SignalWire",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    features: [
      {
        type: String,
        enum: ["SMS", "Voice", "MMS"],
      },
    ],
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "SubAccount",
      default: null,
    },
    externalId: {
      type: String,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
);

const SubAccountSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    },
    walletBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    assignedNumbers: [
      {
        type: Schema.Types.ObjectId,
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
        default: false,
      },
      canManageWallet: {
        type: Boolean,
        default: false,
      },
      canViewAnalytics: {
        type: Boolean,
        default: true,
      },
    },
    status: {
      type: String,
      enum: ["active", "suspended", "pending"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

// Add indexes for better query performance
PhoneNumberSchema.index({ userId: 1, isActive: 1 });
PhoneNumberSchema.index({ number: 1 });
PhoneNumberSchema.index({ assignedTo: 1 });

SubAccountSchema.index({ userId: 1, status: 1 });
SubAccountSchema.index({ email: 1 });

// Ensure max 3 sub-accounts per user
SubAccountSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments({
      userId: this.userId,
    });
    if (count >= 3) {
      const error = new Error("Maximum 3 sub-accounts allowed per user");
      return next(error);
    }
  }
  next();
});

export const PhoneNumber = mongoose.model<IPhoneNumber>(
  "PhoneNumber",
  PhoneNumberSchema,
);
export const SubAccount = mongoose.model<ISubAccount>(
  "SubAccount",
  SubAccountSchema,
);
