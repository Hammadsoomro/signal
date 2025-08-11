import React, { createContext, useContext, useState, useEffect } from 'react';

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
  addPurchasedNumber: (number: PurchasedNumber) => void;
  removePurchasedNumber: (numberId: string) => void;
  updateNumberAssignment: (numberId: string, assignedTo: string | null) => void;
  getAvailableNumbers: () => PurchasedNumber[];
  getAssignedNumbers: (subAccountId: string) => PurchasedNumber[];
}

const UserNumbersContext = createContext<UserNumbersContextType | undefined>(undefined);

export const UserNumbersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [purchasedNumbers, setPurchasedNumbers] = useState<PurchasedNumber[]>([
    // User's actual purchased number
    {
      id: '1',
      number: '+1 (249) 444-0933',
      label: 'Primary Business Line',
      city: 'Ontario',
      state: 'Ontario',
      country: 'CA',
      isActive: true,
      purchaseDate: '2024-01-01',
      monthlyPrice: 5.00,
      assignedTo: null
    }
  ]);

  const addPurchasedNumber = (number: PurchasedNumber) => {
    setPurchasedNumbers(prev => [...prev, number]);
  };

  const removePurchasedNumber = (numberId: string) => {
    setPurchasedNumbers(prev => prev.filter(num => num.id !== numberId));
  };

  const updateNumberAssignment = (numberId: string, assignedTo: string | null) => {
    setPurchasedNumbers(prev => prev.map(num => 
      num.id === numberId ? { ...num, assignedTo } : num
    ));
  };

  const getAvailableNumbers = () => {
    return purchasedNumbers.filter(num => num.isActive && !num.assignedTo);
  };

  const getAssignedNumbers = (subAccountId: string) => {
    return purchasedNumbers.filter(num => num.assignedTo === subAccountId);
  };

  return (
    <UserNumbersContext.Provider value={{
      purchasedNumbers,
      addPurchasedNumber,
      removePurchasedNumber,
      updateNumberAssignment,
      getAvailableNumbers,
      getAssignedNumbers
    }}>
      {children}
    </UserNumbersContext.Provider>
  );
};

export const useUserNumbers = () => {
  const context = useContext(UserNumbersContext);
  if (context === undefined) {
    throw new Error('useUserNumbers must be used within a UserNumbersProvider');
  }
  return context;
};
