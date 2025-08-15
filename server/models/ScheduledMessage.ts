import mongoose, { Document, Schema } from "mongoose";

export interface IScheduledMessage extends Document {
  userId: mongoose.Types.ObjectId;
  fromNumber: string;
  recipients: string[]; // Array of phone numbers
  message: string;
  scheduledFor: Date;
  timezone: string;
  status: "pending" | "sent" | "failed" | "cancelled";
  createdAt: Date;
  sentAt?: Date;
  failureReason?: string;
  messageCount: number; // Number of recipients
  cost: number; // Total cost for all recipients
  metadata?: {
    campaignName?: string;
    tags?: string[];
    priority?: "low" | "normal" | "high";
  };
}

const ScheduledMessageSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fromNumber: {
      type: String,
      required: true,
      trim: true,
    },
    recipients: [{
      type: String,
      required: true,
      trim: true,
    }],
    message: {
      type: String,
      required: true,
      maxlength: 1600, // SMS limit
    },
    scheduledFor: {
      type: Date,
      required: true,
      index: true,
    },
    timezone: {
      type: String,
      required: true,
      default: "America/New_York",
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed", "cancelled"],
      default: "pending",
      index: true,
    },
    sentAt: {
      type: Date,
    },
    failureReason: {
      type: String,
    },
    messageCount: {
      type: Number,
      required: true,
      min: 1,
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    metadata: {
      campaignName: {
        type: String,
        trim: true,
      },
      tags: [{
        type: String,
        trim: true,
      }],
      priority: {
        type: String,
        enum: ["low", "normal", "high"],
        default: "normal",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
ScheduledMessageSchema.index({ userId: 1, status: 1 });
ScheduledMessageSchema.index({ userId: 1, scheduledFor: 1 });
ScheduledMessageSchema.index({ scheduledFor: 1, status: 1 });
ScheduledMessageSchema.index({ status: 1, scheduledFor: 1 }); // For background job processing

export default mongoose.model<IScheduledMessage>("ScheduledMessage", ScheduledMessageSchema);
