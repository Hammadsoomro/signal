import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  company?: string;
  walletBalance: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  profilePicture?: string;
  timezone: string;
  language: string;
  googleId?: string;
  isGoogleUser?: boolean;
  stripeCustomerId?: string;
  settings: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    twoFactorEnabled: boolean;
  };
  subscription: {
    plan: "free" | "professional" | "enterprise";
    expiresAt?: Date;
  };
}

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: function () {
        return !this.isGoogleUser; // Phone not required for Google users
      },
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.isGoogleUser; // Password not required for Google users
      },
    },
    googleId: {
      type: String,
    },
    isGoogleUser: {
      type: Boolean,
      default: false,
    },
    stripeCustomerId: {
      type: String,
      required: false,
    },
    company: {
      type: String,
      trim: true,
    },
    walletBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profilePicture: {
      type: String,
    },
    timezone: {
      type: String,
      default: "America/New_York",
    },
    language: {
      type: String,
      default: "English",
    },
    settings: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      smsNotifications: {
        type: Boolean,
        default: true,
      },
      pushNotifications: {
        type: Boolean,
        default: false,
      },
      twoFactorEnabled: {
        type: Boolean,
        default: false,
      },
    },
    subscription: {
      plan: {
        type: String,
        enum: ["free", "professional", "enterprise"],
        default: "free",
      },
      expiresAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  },
);

// Add indexes for better query performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ phone: 1 });
UserSchema.index({ googleId: 1 }, { unique: true, sparse: true });
UserSchema.index({ createdAt: -1 });

export default mongoose.model<IUser>("User", UserSchema);
