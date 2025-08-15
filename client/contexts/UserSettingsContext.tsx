import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface UserSettings {
  _id?: string;
  userId: string;
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
    sessionTimeout: number;
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
  createdAt?: string;
  updatedAt?: string;
}

interface UserSettingsContextType {
  settings: UserSettings | null;
  isLoading: boolean;
  loadSettings: () => Promise<void>;
  updateSettings: (updates: Partial<UserSettings>) => Promise<boolean>;
  updateSettingSection: (section: keyof UserSettings, updates: any) => Promise<boolean>;
  resetSettings: () => Promise<boolean>;
  exportSettings: () => Promise<any>;
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(
  undefined,
);

export const UserSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user settings from database
  const loadSettings = async () => {
    if (!user) {
      setSettings(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('connectlify_token');
      if (!token) {
        console.log('No auth token found, user not authenticated');
        setSettings(null);
        return;
      }

      const response = await fetch('/api/user/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSettings(data.data);
          console.log('Loaded user settings from database');
        } else {
          console.error('Failed to load settings:', data.message);
          setSettings(null);
        }
      } else {
        console.error('Failed to fetch settings:', response.status);
        setSettings(null);
      }
    } catch (error) {
      console.error('Failed to load user settings:', error);
      setSettings(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Load settings when user changes
  useEffect(() => {
    loadSettings();
  }, [user]);

  // Update settings
  const updateSettings = async (updates: Partial<UserSettings>): Promise<boolean> => {
    try {
      const token = localStorage.getItem('connectlify_token');
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSettings(result.data);
        toast({
          title: "Settings Updated",
          description: "Your settings have been saved successfully.",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update settings",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
      return false;
    }
  };

  // Update specific setting section
  const updateSettingSection = async (section: keyof UserSettings, updates: any): Promise<boolean> => {
    try {
      const token = localStorage.getItem('connectlify_token');
      const response = await fetch(`/api/user/settings/${section}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSettings(result.data);
        toast({
          title: "Settings Updated",
          description: `Your ${section} settings have been saved.`,
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update settings section",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Failed to update setting section:', error);
      toast({
        title: "Error",
        description: "Failed to update settings section",
        variant: "destructive",
      });
      return false;
    }
  };

  // Reset settings to defaults
  const resetSettings = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('connectlify_token');
      const response = await fetch('/api/user/settings/reset', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSettings(result.data);
        toast({
          title: "Settings Reset",
          description: "Your settings have been reset to defaults.",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to reset settings",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Failed to reset settings:', error);
      toast({
        title: "Error",
        description: "Failed to reset settings",
        variant: "destructive",
      });
      return false;
    }
  };

  // Export settings
  const exportSettings = async (): Promise<any> => {
    try {
      const token = localStorage.getItem('connectlify_token');
      const response = await fetch('/api/user/settings/export', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: "Settings Exported",
          description: "Your settings have been exported successfully.",
        });
        return result.data;
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to export settings",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      console.error('Failed to export settings:', error);
      toast({
        title: "Error",
        description: "Failed to export settings",
        variant: "destructive",
      });
      return null;
    }
  };

  return (
    <UserSettingsContext.Provider
      value={{
        settings,
        isLoading,
        loadSettings,
        updateSettings,
        updateSettingSection,
        resetSettings,
        exportSettings,
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (context === undefined) {
    throw new Error("useUserSettings must be used within a UserSettingsProvider");
  }
  return context;
};
