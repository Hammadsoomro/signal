import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface SubAccount {
  _id: string;
  name: string;
  email: string;
  walletBalance: number;
  assignedNumbers: string[];
  permissions: {
    canSendSMS: boolean;
    canBuyNumbers: boolean;
    canManageWallet: boolean;
    canViewAnalytics: boolean;
  };
  status: "active" | "suspended" | "pending" | "deleted";
  createdAt: string;
  updatedAt: string;
}

interface SubAccountsContextType {
  subAccounts: SubAccount[];
  isLoading: boolean;
  loadSubAccounts: () => Promise<void>;
  createSubAccount: (data: {
    name: string;
    email: string;
    walletBalance?: number;
    assignedNumber?: string;
  }) => Promise<boolean>;
  updateSubAccount: (subAccountId: string, data: {
    name?: string;
    email?: string;
    status?: string;
  }) => Promise<boolean>;
  deleteSubAccount: (subAccountId: string) => Promise<boolean>;
  transferFunds: (subAccountId: string, amount: number) => Promise<boolean>;
}

const SubAccountsContext = createContext<SubAccountsContextType | undefined>(
  undefined,
);

export const SubAccountsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load user's sub-accounts from database
  const loadSubAccounts = async () => {
    if (!user) {
      setSubAccounts([]);
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('connectlify_token');
      if (!token) {
        console.log('No auth token found, user not authenticated');
        setSubAccounts([]);
        return;
      }

      const response = await fetch('/api/sub-accounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setSubAccounts(data.data);
          console.log(`Loaded ${data.data.length} sub-accounts from database`);
        } else {
          console.log('No sub-accounts found for user');
          setSubAccounts([]);
        }
      } else {
        console.error('Failed to fetch sub-accounts:', response.status);
        setSubAccounts([]);
      }
    } catch (error) {
      console.error('Failed to load sub-accounts:', error);
      setSubAccounts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load sub-accounts when user changes
  useEffect(() => {
    loadSubAccounts();
  }, [user]);

  // Create a new sub-account
  const createSubAccount = async (data: {
    name: string;
    email: string;
    walletBalance?: number;
    assignedNumber?: string;
  }): Promise<boolean> => {
    try {
      const token = localStorage.getItem('connectlify_token');
      const response = await fetch('/api/sub-accounts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Reload sub-accounts from database
        await loadSubAccounts();
        toast({
          title: "Success",
          description: "Sub-account created successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create sub-account",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Failed to create sub-account:', error);
      toast({
        title: "Error",
        description: "Failed to create sub-account",
        variant: "destructive",
      });
      return false;
    }
  };

  // Update sub-account
  const updateSubAccount = async (subAccountId: string, data: {
    name?: string;
    email?: string;
    status?: string;
  }): Promise<boolean> => {
    try {
      const token = localStorage.getItem('connectlify_token');
      const response = await fetch(`/api/sub-accounts/${subAccountId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Reload sub-accounts from database
        await loadSubAccounts();
        toast({
          title: "Success",
          description: "Sub-account updated successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update sub-account",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Failed to update sub-account:', error);
      toast({
        title: "Error",
        description: "Failed to update sub-account",
        variant: "destructive",
      });
      return false;
    }
  };

  // Delete sub-account
  const deleteSubAccount = async (subAccountId: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('connectlify_token');
      const response = await fetch(`/api/sub-accounts/${subAccountId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Reload sub-accounts from database
        await loadSubAccounts();
        toast({
          title: "Success",
          description: "Sub-account deleted successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete sub-account",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Failed to delete sub-account:', error);
      toast({
        title: "Error",
        description: "Failed to delete sub-account",
        variant: "destructive",
      });
      return false;
    }
  };

  // Transfer funds to sub-account
  const transferFunds = async (subAccountId: string, amount: number): Promise<boolean> => {
    try {
      const token = localStorage.getItem('connectlify_token');
      const response = await fetch('/api/sub-accounts/transfer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subAccountId, amount }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Reload sub-accounts from database
        await loadSubAccounts();
        toast({
          title: "Success",
          description: "Funds transferred successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to transfer funds",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Failed to transfer funds:', error);
      toast({
        title: "Error",
        description: "Failed to transfer funds",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <SubAccountsContext.Provider
      value={{
        subAccounts,
        isLoading,
        loadSubAccounts,
        createSubAccount,
        updateSubAccount,
        deleteSubAccount,
        transferFunds,
      }}
    >
      {children}
    </SubAccountsContext.Provider>
  );
};

export const useSubAccounts = () => {
  const context = useContext(SubAccountsContext);
  if (context === undefined) {
    throw new Error("useSubAccounts must be used within a SubAccountsProvider");
  }
  return context;
};
