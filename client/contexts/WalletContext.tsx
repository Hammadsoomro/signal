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
  deductBalance: (amount: number, description: string) => boolean;
  addBalance: (amount: number, description: string, reference?: string) => void;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const deductBalance = (amount: number, description: string): boolean => {
    if (amount > balance) {
      toast({
        title: "Insufficient Balance",
        description: `You need $${amount.toFixed(2)} but only have $${balance.toFixed(2)}. Please add funds to your wallet.`,
        variant: "destructive",
      });
      return false;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: "debit",
      amount: amount,
      description: description,
      date: new Date().toISOString(),
      status: "completed",
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setBalance((prev) => prev - amount);

    return true;
  };

  const addBalance = (
    amount: number,
    description: string,
    reference?: string,
  ) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: "credit",
      amount: amount,
      description: description,
      date: new Date().toISOString(),
      status: "completed",
      reference: reference,
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setBalance((prev) => prev + amount);
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
