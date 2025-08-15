import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
  reference?: string;
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  deductBalance: (amount: number, description: string) => Promise<boolean>;
  addBalance: (amount: number, description: string, reference?: string) => Promise<void>;
  loadTransactions: () => Promise<void>;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load wallet data when user changes
  useEffect(() => {
    if (user) {
      setBalance(user.walletBalance);
      loadTransactions();
    } else {
      setBalance(0);
      setTransactions([]);
    }
  }, [user]);

  // Load transactions from database
  const loadTransactions = async () => {
    if (!user) {
      setTransactions([]);
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('connectlify_token');
      const response = await fetch('/api/wallet/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.transactions) {
          setTransactions(data.data.transactions);
        }
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deductBalance = async (amount: number, description: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "User not authenticated. Please log in again.",
        variant: "destructive",
      });
      return false;
    }

    if (amount > balance) {
      toast({
        title: "Insufficient Balance",
        description: `You need $${amount.toFixed(2)} but only have $${balance.toFixed(2)}. Please add funds to your wallet.`,
        variant: "destructive",
      });
      return false;
    }

    try {
      const token = localStorage.getItem('connectlify_token');
      const response = await fetch('/api/wallet/debit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, description }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update local balance
        setBalance(data.data.newBalance);
        // Reload transactions
        await loadTransactions();
        return true;
      } else {
        toast({
          title: "Transaction Failed",
          description: data.message || "Failed to process transaction.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "Failed to process transaction. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const addBalance = async (
    amount: number,
    description: string,
    reference?: string,
  ) => {
    try {
      const token = localStorage.getItem('connectlify_token');
      const response = await fetch('/api/wallet/credit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, description, reference }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update local balance
        setBalance(data.data.newBalance);
        // Reload transactions
        await loadTransactions();

        toast({
          title: "Funds Added",
          description: `$${amount.toFixed(2)} has been added to your wallet.`,
        });
      } else {
        toast({
          title: "Transaction Failed",
          description: data.message || "Failed to add funds.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "Failed to add funds. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Expose functions globally for backward compatibility
  useEffect(() => {
    (window as any).deductWalletBalance = deductBalance;
    (window as any).addWalletBalance = addBalance;
    (window as any).getWalletBalance = () => balance;

    return () => {
      delete (window as any).deductWalletBalance;
      delete (window as any).addWalletBalance;
      delete (window as any).getWalletBalance;
    };
  }, [balance]);

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        deductBalance,
        addBalance,
        loadTransactions,
        isLoading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
