import { Request, Response } from "express";
import UserSettings from "../models/UserSettings";
import User from "../models/User";
import { AuthRequest } from "./auth";

// Get user settings
export const getUserSettings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    let settings = await UserSettings.findOne({ userId });

    // If no settings exist, create default settings
    if (!settings) {
      settings = new UserSettings({
        userId,
        notifications: {
          emailNotifications: true,
          smsNotifications: false,
          webhookNotifications: false,
          marketingEmails: true,
        },
        preferences: {
          timezone: "America/New_York",
          dateFormat: "MM/DD/YYYY",
          currency: "USD",
          language: "en",
          theme: "light",
          autoArchiveConversations: false,
          conversationRetentionDays: 90,
        },
        security: {
          twoFactorEnabled: false,
          sessionTimeout: 480,
          allowedIPs: [],
          loginNotifications: true,
        },
        billing: {
          autoRecharge: false,
          rechargeThreshold: 10.0,
          rechargeAmount: 25.0,
        },
        apiSettings: {
          webhookEvents: [],
        },
      });

      await settings.save();
    }

    res.status(200).json({
      success: true,
      data: settings
    });

  } catch (error) {
    console.error("Get user settings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user settings"
    });
  }
};

// Update user settings
export const updateUserSettings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const updates = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    // Validate that we're not trying to update the userId
    if (updates.userId || updates._id) {
      return res.status(400).json({
        success: false,
        message: "Cannot modify user ID"
      });
    }

    // Find or create settings
    let settings = await UserSettings.findOne({ userId });
    
    if (!settings) {
      // Create new settings with the updates
      settings = new UserSettings({
        userId,
        ...updates
      });
    } else {
      // Update existing settings
      Object.keys(updates).forEach(key => {
        if (key in settings!) {
          if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
            // Deep merge for nested objects
            (settings as any)[key] = { ...(settings as any)[key], ...updates[key] };
          } else {
            (settings as any)[key] = updates[key];
          }
        }
      });
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings
    });

  } catch (error) {
    console.error("Update user settings error:", error);
    
    if (error instanceof Error && error.message.includes('validation')) {
      return res.status(400).json({
        success: false,
        message: "Invalid settings data provided",
        details: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update user settings"
    });
  }
};

// Update specific setting section
export const updateSettingSection = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { section } = req.params;
    const updates = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const validSections = ['notifications', 'preferences', 'security', 'billing', 'apiSettings'];
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: "Invalid settings section"
      });
    }

    let settings = await UserSettings.findOne({ userId });
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "User settings not found"
      });
    }

    // Update the specific section
    (settings as any)[section] = { ...(settings as any)[section], ...updates };

    await settings.save();

    res.status(200).json({
      success: true,
      message: `${section} settings updated successfully`,
      data: settings
    });

  } catch (error) {
    console.error("Update setting section error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update settings section"
    });
  }
};

// Reset settings to defaults
export const resetUserSettings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    // Delete existing settings
    await UserSettings.findOneAndDelete({ userId });

    // Create new default settings
    const defaultSettings = new UserSettings({
      userId,
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        webhookNotifications: false,
        marketingEmails: true,
      },
      preferences: {
        timezone: "America/New_York",
        dateFormat: "MM/DD/YYYY",
        currency: "USD",
        language: "en",
        theme: "light",
        autoArchiveConversations: false,
        conversationRetentionDays: 90,
      },
      security: {
        twoFactorEnabled: false,
        sessionTimeout: 480,
        allowedIPs: [],
        loginNotifications: true,
      },
      billing: {
        autoRecharge: false,
        rechargeThreshold: 10.0,
        rechargeAmount: 25.0,
      },
      apiSettings: {
        webhookEvents: [],
      },
    });

    await defaultSettings.save();

    res.status(200).json({
      success: true,
      message: "Settings reset to defaults successfully",
      data: defaultSettings
    });

  } catch (error) {
    console.error("Reset user settings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset user settings"
    });
  }
};

// Export user settings (for backup/migration)
export const exportUserSettings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const settings = await UserSettings.findOne({ userId });

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "User settings not found"
      });
    }

    // Remove sensitive data before export
    const exportData = {
      notifications: settings.notifications,
      preferences: settings.preferences,
      // Don't export security settings for safety
      billing: {
        autoRecharge: settings.billing.autoRecharge,
        rechargeThreshold: settings.billing.rechargeThreshold,
        rechargeAmount: settings.billing.rechargeAmount,
        // Don't export payment method info
      },
      // Don't export API settings for security
      exportDate: new Date().toISOString(),
    };

    res.status(200).json({
      success: true,
      data: exportData
    });

  } catch (error) {
    console.error("Export user settings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export user settings"
    });
  }
};
