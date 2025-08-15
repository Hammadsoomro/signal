import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
  Wallet as WalletIcon,
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Loader2,
  History,
  TrendingUp,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand: string;
  isDefault: boolean;
}

export default function Wallet() {
  const { toast } = useToast();
  const { balance, transactions: walletTransactions, addBalance } = useWallet();
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const [transactions, setTransactions] = useState<Transaction[]>(walletTransactions);

  // Sync transactions with wallet context
  useEffect(() => {
    setTransactions(walletTransactions);
  }, [walletTransactions]);

  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      isDefault: true
    },
    {
      id: '2',
      type: 'card',
      last4: '8888',
      brand: 'Mastercard',
      isDefault: false
    }
  ];

  const quickAmounts = [10, 25, 50, 100, 200, 500];

  const handleAddFunds = async () => {
    const amount = parseFloat(addAmount);
    
    if (!amount || amount < 5) {
      toast({
        title: "Invalid Amount",
        description: "Minimum top-up amount is $5.00",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPaymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate Safepay integration
      const safepayPayload = {
        amount: amount * 100, // Convert to cents
        currency: 'USD',
        publicKey: 'sec_059c0a39-1197-4b9f-b1cd-9a91f319bee8',
        paymentMethodId: selectedPaymentMethod,
        description: `Connectlify wallet top-up - $${amount.toFixed(2)}`,
        metadata: {
          userId: 'user_123',
          walletTopUp: true
        }
      };

      // Simulate API call to Safepay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate successful payment
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'credit',
        amount: amount,
        description: `Wallet top-up via Safepay`,
        date: new Date().toISOString(),
        status: 'completed',
        reference: `SP_${Math.random().toString(36).substr(2, 8).toUpperCase()}`
      };

      addBalance(amount, `Wallet top-up via Safepay`, `SP_${Math.random().toString(36).substr(2, 8).toUpperCase()}`);
      setAddAmount('');
      setSelectedPaymentMethod('');
      setIsAddFundsOpen(false);

      toast({
        title: "Funds Added Successfully!",
        description: `$${amount.toFixed(2)} has been added to your wallet`,
      });

    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Remove local deductBalance - it's now handled by WalletContext

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const totalCredits = transactions
    .filter(t => t.type === 'credit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalDebits = transactions
    .filter(t => t.type === 'debit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <DashboardLayout title="Wallet Management">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Wallet Management</h1>
            <p className="text-muted-foreground">
              Manage your wallet balance, add funds, and view transaction history
            </p>
          </div>
        </div>

        {/* Balance Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <WalletIcon className="h-5 w-5" />
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-primary">${balance.toFixed(2)}</p>
                  <p className="text-muted-foreground">Available for SMS and purchases</p>
                </div>
                <Dialog open={isAddFundsOpen} onOpenChange={setIsAddFundsOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Funds
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Funds to Wallet</DialogTitle>
                      <DialogDescription>
                        Top up your wallet using Safepay secure payment gateway
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          value={addAmount}
                          onChange={(e) => setAddAmount(e.target.value)}
                          min="5"
                          step="0.01"
                        />
                        <p className="text-sm text-muted-foreground">Minimum amount: $5.00</p>
                      </div>

                      <div className="space-y-2">
                        <Label>Quick Amounts</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {quickAmounts.map((amount) => (
                            <Button
                              key={amount}
                              variant="outline"
                              size="sm"
                              onClick={() => setAddAmount(amount.toString())}
                            >
                              ${amount}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethods.map((method) => (
                              <SelectItem key={method.id} value={method.id}>
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4" />
                                  <span>{method.brand} ending in {method.last4}</span>
                                  {method.isDefault && (
                                    <Badge variant="secondary" className="text-xs">Default</Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                          Payments are processed securely through Safepay. Your payment information is encrypted and protected.
                        </AlertDescription>
                      </Alert>

                      {addAmount && (
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="flex justify-between items-center">
                            <span>Amount to add:</span>
                            <span className="font-semibold">${parseFloat(addAmount || '0').toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>New balance:</span>
                            <span className="font-semibold">${(balance + parseFloat(addAmount || '0')).toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddFundsOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddFunds} disabled={isProcessing}>
                        {isProcessing ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CreditCard className="mr-2 h-4 w-4" />
                        )}
                        {isProcessing ? 'Processing...' : 'Add Funds'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${totalDebits.toFixed(2)}</p>
              <p className="text-muted-foreground text-sm">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5" />
                Total Added
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${totalCredits.toFixed(2)}</p>
              <p className="text-muted-foreground text-sm">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Transaction History
            </CardTitle>
            <CardDescription>
              Recent wallet transactions and activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Transactions Yet</h3>
                  <p className="text-muted-foreground">Your transaction history will appear here</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.map((transaction, index) => (
                    <div key={transaction.id}>
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${
                            transaction.type === 'credit' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {transaction.type === 'credit' ? (
                              <ArrowUpRight className="h-4 w-4" />
                            ) : (
                              <ArrowDownLeft className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(transaction.date)}</span>
                              {transaction.reference && (
                                <>
                                  <span>•</span>
                                  <span>Ref: {transaction.reference}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                            </p>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(transaction.status)}
                              <span className="text-sm text-muted-foreground capitalize">
                                {transaction.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < transactions.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Manage your saved payment methods for quick top-ups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{method.brand} ending in {method.last4}</p>
                      <p className="text-sm text-muted-foreground">
                        {method.type === 'card' ? 'Credit/Debit Card' : 'Bank Account'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
