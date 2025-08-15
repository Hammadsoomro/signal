import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export interface PurchasedNumber {
  id: string;
  number: string;
  label: string;
  city: string;
  state: string;
  country: string;
  isActive: boolean;
  purchaseDate: string;
  monthlyPrice: number;
  assignedTo?: string | null; // sub-account id
}

interface UserNumbersContextType {
  purchasedNumbers: PurchasedNumber[];
  isLoading: boolean;
  addPurchasedNumber: (number: PurchasedNumber) => void;
  removePurchasedNumber: (numberId: string) => void;
  updateNumberAssignment: (numberId: string, assignedTo: string | null) => void;
  getAvailableNumbers: () => PurchasedNumber[];
  getAssignedNumbers: (subAccountId: string) => PurchasedNumber[];
  purchaseNumber: (numberData: any) => Promise<boolean>;
  loadUserNumbers: () => Promise<void>;
}

const UserNumbersContext = createContext<UserNumbersContextType | undefined>(
  undefined,
);

export const UserNumbersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [purchasedNumbers, setPurchasedNumbers] = useState<PurchasedNumber[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load user's phone numbers from database
  const loadUserNumbers = async () => {
    if (!user) {
      setPurchasedNumbers([]);
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('connectlify_token');
      if (!token) {
        console.log('No auth token found, user not authenticated');
        setPurchasedNumbers([]);
        return;
      }

      const response = await fetch('/api/phone-numbers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          const numbers = data.data.map((num: any) => ({
            id: num._id,
            number: num.number,
            label: num.label,
            city: num.city,
            state: num.state,
            country: num.country,
            isActive: num.isActive,
            purchaseDate: num.purchaseDate,
            monthlyPrice: num.monthlyPrice,
            assignedTo: num.assignedTo,
          }));
          setPurchasedNumbers(numbers);
          console.log(`Loaded ${numbers.length} user-specific phone numbers`);
        } else {
          console.log('No phone numbers found for user');
          setPurchasedNumbers([]);
        }
      } else {
        console.error('Failed to fetch phone numbers:', response.status);
        setPurchasedNumbers([]);
      }
    } catch (error) {
      console.error('Failed to load user numbers:', error);
      setPurchasedNumbers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load numbers when user changes
  useEffect(() => {
    loadUserNumbers();
  }, [user]);

  // Purchase a new phone number
  const purchaseNumber = async (numberData: any): Promise<boolean> => {
    try {
      const token = localStorage.getItem('connectlify_token');
      const response = await fetch('/api/phone-numbers/purchase', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(numberData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Reload numbers from database
          await loadUserNumbers();
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Failed to purchase number:', error);
      return false;
    }
  };

  const addPurchasedNumber = (number: PurchasedNumber) => {
    setPurchasedNumbers((prev) => [...prev, number]);
  };

  const removePurchasedNumber = (numberId: string) => {
    setPurchasedNumbers((prev) => prev.filter((num) => num.id !== numberId));
  };

  const updateNumberAssignment = async (
    numberId: string,
    assignedTo: string | null,
  ) => {
    try {
      const token = localStorage.getItem('connectlify_token');
      const response = await fetch('/api/phone-numbers/assign', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumberId: numberId, subAccountId: assignedTo }),
      });

      if (response.ok) {
        // Update local state
        setPurchasedNumbers((prev) =>
          prev.map((num) => (num.id === numberId ? { ...num, assignedTo } : num)),
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update number assignment:', error);
      return false;
    }
  };

  const getAvailableNumbers = () => {
    // Only return numbers that belong to the authenticated user and are available
    return purchasedNumbers.filter((num) => num.isActive && !num.assignedTo);
  };

  const getAssignedNumbers = (subAccountId: string) => {
    return purchasedNumbers.filter((num) => num.assignedTo === subAccountId);
  };

  return (
    <UserNumbersContext.Provider
      value={{
        purchasedNumbers,
        isLoading,
        addPurchasedNumber,
        removePurchasedNumber,
        updateNumberAssignment,
        getAvailableNumbers,
        getAssignedNumbers,
        purchaseNumber,
        loadUserNumbers,
      }}
    >
      {children}
    </UserNumbersContext.Provider>
  );
};

export const useUserNumbers = () => {
  const context = useContext(UserNumbersContext);
  if (context === undefined) {
    throw new Error("useUserNumbers must be used within a UserNumbersProvider");
  }
  return context;
};
