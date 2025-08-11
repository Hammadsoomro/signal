import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  conversationId: string;
  senderId?: string; // User ID if sent by user, null if received
  senderNumber: string;
  recipientNumber: string;
  content: string;
  messageType: "sms" | "mms";
  status: "sending" | "sent" | "delivered" | "failed" | "received";
  direction: "inbound" | "outbound";
  cost?: number;
  externalId?: string; // SignalWire message ID
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversation extends Document {
  userId: string;
  contactNumber: string;
  contactName?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isPinned: boolean;
  isStarred: boolean;
  isArchived: boolean;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    senderNumber: {
      type: String,
      required: true,
      trim: true,
    },
    recipientNumber: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1600, // SMS limit
    },
    messageType: {
      type: String,
      enum: ["sms", "mms"],
      default: "sms",
    },
    status: {
      type: String,
      enum: ["sending", "sent", "delivered", "failed", "received"],
      default: "sending",
    },
    direction: {
      type: String,
      enum: ["inbound", "outbound"],
      required: true,
    },
    cost: {
      type: Number,
      min: 0,
      default: 0.01,
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

const ConversationSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    contactName: {
      type: String,
      trim: true,
    },
    lastMessage: {
      type: String,
      default: "",
    },
    lastMessageTime: {
      type: Date,
      default: Date.now,
    },
    unreadCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    messageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Add indexes for better query performance
MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1, createdAt: -1 });
MessageSchema.index({ externalId: 1 }, { sparse: true });

ConversationSchema.index({ userId: 1, lastMessageTime: -1 });
ConversationSchema.index({ userId: 1, contactNumber: 1 }, { unique: true });
ConversationSchema.index({
  userId: 1,
  isPinned: -1,
  isStarred: -1,
  lastMessageTime: -1,
});

export const Message = mongoose.model<IMessage>("Message", MessageSchema);
export const Conversation = mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema,
);
