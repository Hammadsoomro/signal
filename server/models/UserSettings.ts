import mongoose, { Document, Schema } from "mongoose";

export interface IUserSettings extends Document {
  userId: mongoose.Types.ObjectId;
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    webhookNotifications: boolean;
    marketingEmails: boolean;
  };
  preferences: {
    timezone: string;
    dateFormat: string;
    currency: string;
    language: string;
    theme: "light" | "dark" | "auto";
    defaultSendingNumber?: string;
    autoArchiveConversations: boolean;
    conversationRetentionDays: number;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number; // in minutes
    allowedIPs: string[];
    loginNotifications: boolean;
  };
  billing: {
    autoRecharge: boolean;
    rechargeThreshold: number;
    rechargeAmount: number;
    defaultPaymentMethod?: string;
  };
  apiSettings: {
    webhookUrl?: string;
    webhookEvents: string[];
    apiKeyLabel?: string;
    rateLimitOverride?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSettingsSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    notifications: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      smsNotifications: {
        type: Boolean,
        default: false,
      },
      webhookNotifications: {
        type: Boolean,
        default: false,
      },
      marketingEmails: {
        type: Boolean,
        default: true,
      },
    },
    preferences: {
      timezone: {
        type: String,
        default: "America/New_York",
      },
      dateFormat: {
        type: String,
        enum: ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"],
        default: "MM/DD/YYYY",
      },
      currency: {
        type: String,
        enum: ["USD", "EUR", "GBP", "CAD", "AUD"],
        default: "USD",
      },
      language: {
        type: String,
        enum: ["en", "es", "fr", "de", "pt", "it"],
        default: "en",
      },
      theme: {
        type: String,
        enum: ["light", "dark", "auto"],
        default: "light",
      },
      defaultSendingNumber: {
        type: String,
        default: null,
      },
      autoArchiveConversations: {
        type: Boolean,
        default: false,
      },
      conversationRetentionDays: {
        type: Number,
        default: 90,
        min: 7,
        max: 365,
      },
    },
    security: {
      twoFactorEnabled: {
        type: Boolean,
        default: false,
      },
      sessionTimeout: {
        type: Number,
        default: 480, // 8 hours in minutes
        min: 15,
        max: 1440, // 24 hours
      },
      allowedIPs: [{
        type: String,
        validate: {
          validator: function(ip: string) {
            // Basic IP validation
            const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^::1$|^localhost$/;
            return ipRegex.test(ip);
          },
          message: 'Invalid IP address format'
        }
      }],
      loginNotifications: {
        type: Boolean,
        default: true,
      },
    },
    billing: {
      autoRecharge: {
        type: Boolean,
        default: false,
      },
      rechargeThreshold: {
        type: Number,
        default: 10.0,
        min: 5.0,
      },
      rechargeAmount: {
        type: Number,
        default: 25.0,
        min: 10.0,
      },
      defaultPaymentMethod: {
        type: String,
        default: null,
      },
    },
    apiSettings: {
      webhookUrl: {
        type: String,
        validate: {
          validator: function(url: string) {
            if (!url) return true; // Allow empty
            try {
              new URL(url);
              return url.startsWith('https://');
            } catch {
              return false;
            }
          },
          message: 'Webhook URL must be a valid HTTPS URL'
        }
      },
      webhookEvents: [{
        type: String,
        enum: [
          'sms.received',
          'sms.sent',
          'sms.delivered',
          'sms.failed',
          'conversation.created',
          'conversation.updated',
          'wallet.credited',
          'wallet.debited',
          'number.purchased',
          'number.released'
        ]
      }],
      apiKeyLabel: {
        type: String,
        maxlength: 50,
      },
      rateLimitOverride: {
        type: Number,
        min: 100,
        max: 10000,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
UserSettingsSchema.index({ userId: 1 }, { unique: true });

export default mongoose.model<IUserSettings>("UserSettings", UserSettingsSchema);
