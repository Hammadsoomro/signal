import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  UserPlus, 
  Edit, 
  Trash2, 
  DollarSign, 
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Users,
  Wallet
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubAccount {
  id: string;
  name: string;
  email: string;
  walletBalance: number;
  assignedNumbers: string[];
  createdAt: string;
  status: 'active' | 'suspended';
}

interface PhoneNumber {
  id: string;
  number: string;
  label: string;
  assigned: boolean;
}

export default function SubAccounts() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedSubAccount, setSelectedSubAccount] = useState<SubAccount | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mock data
  const [userWalletBalance] = useState(125.50);
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@company.com',
      walletBalance: 25.00,
      assignedNumbers: ['+1 (555) 123-4567'],
      createdAt: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      walletBalance: 15.75,
      assignedNumbers: [],
      createdAt: '2024-01-20',
      status: 'active'
    }
  ]);

  const [availableNumbers] = useState<PhoneNumber[]>([
    { id: '1', number: '+1 (555) 123-4567', label: 'Main Line', assigned: true },
    { id: '2', number: '+1 (555) 234-5678', label: 'Business', assigned: false },
    { id: '3', number: '+1 (555) 345-6789', label: 'Support', assigned: false },
    { id: '4', number: '+1 (555) 456-7890', label: 'Marketing', assigned: false },
    { id: '5', number: '+1 (555) 567-8901', label: 'Sales', assigned: false }
  ]);

  // Form states
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    transferAmount: '',
    assignedNumber: ''
  });

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [transferForm, setTransferForm] = useState({
    amount: '',
    subAccountId: ''
  });

  const handleCreateSubAccount = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (createForm.password !== createForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (subAccounts.length >= 3) {
      toast({
        title: "Error",
        description: "Maximum 3 sub-accounts allowed per user",
        variant: "destructive",
      });
      return;
    }

    const transferAmount = parseFloat(createForm.transferAmount);
    if (transferAmount > userWalletBalance) {
      toast({
        title: "Error",
        description: "Insufficient wallet balance",
        variant: "destructive",
      });
      return;
    }

    // Create new sub-account
    const newSubAccount: SubAccount = {
      id: Date.now().toString(),
      name: createForm.name,
      email: createForm.email,
      walletBalance: transferAmount || 0,
      assignedNumbers: createForm.assignedNumber ? [createForm.assignedNumber] : [],
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setSubAccounts(prev => [...prev, newSubAccount]);
    setCreateForm({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      transferAmount: '',
      assignedNumber: ''
    });
    setIsCreateDialogOpen(false);

    toast({
      title: "Success",
      description: "Sub-account created successfully",
    });
  };

  const handleEditSubAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSubAccount) return;

    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setSubAccounts(prev => prev.map(account => 
      account.id === selectedSubAccount.id 
        ? { ...account, name: editForm.name, email: editForm.email }
        : account
    ));

    setIsEditDialogOpen(false);
    setSelectedSubAccount(null);

    toast({
      title: "Success",
      description: "Sub-account updated successfully",
    });
  };

  const handleTransferFunds = (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(transferForm.amount);
    if (amount > userWalletBalance) {
      toast({
        title: "Error",
        description: "Insufficient wallet balance",
        variant: "destructive",
      });
      return;
    }

    setSubAccounts(prev => prev.map(account => 
      account.id === transferForm.subAccountId 
        ? { ...account, walletBalance: account.walletBalance + amount }
        : account
    ));

    setTransferForm({ amount: '', subAccountId: '' });
    setIsTransferDialogOpen(false);

    toast({
      title: "Success",
      description: `$${amount.toFixed(2)} transferred successfully`,
    });
  };

  const handleDeleteSubAccount = (id: string) => {
    setSubAccounts(prev => prev.filter(account => account.id !== id));
    toast({
      title: "Success",
      description: "Sub-account deleted successfully",
    });
  };

  const openEditDialog = (subAccount: SubAccount) => {
    setSelectedSubAccount(subAccount);
    setEditForm({
      name: subAccount.name,
      email: subAccount.email,
      password: '',
      confirmPassword: ''
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sub-Account Management</h1>
          <p className="text-muted-foreground">
            Create and manage up to 3 sub-accounts with wallet permissions and number assignments
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Your Balance</p>
                <p className="font-semibold">${userWalletBalance.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={subAccounts.length >= 3}>
              <UserPlus className="mr-2 h-4 w-4" />
              Create Sub-Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Sub-Account</DialogTitle>
              <DialogDescription>
                Create a new sub-account with optional wallet transfer and number assignment
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubAccount} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={createForm.name}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={createForm.password}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={createForm.confirmPassword}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Optional Settings</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="transferAmount">Initial Wallet Transfer (Optional)</Label>
                  <Input
                    id="transferAmount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={createForm.transferAmount}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, transferAmount: e.target.value }))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Available balance: ${userWalletBalance.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedNumber">Assign Phone Number (Optional)</Label>
                  <Select
                    value={createForm.assignedNumber}
                    onValueChange={(value) => setCreateForm(prev => ({ ...prev, assignedNumber: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a number to assign" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableNumbers.filter(num => !num.assigned).map((number) => (
                        <SelectItem key={number.id} value={number.number}>
                          {number.number} ({number.label})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Sub-Account</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Transfer Funds
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transfer Funds to Sub-Account</DialogTitle>
              <DialogDescription>
                Transfer money from your wallet to a sub-account's wallet
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleTransferFunds} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subAccount">Select Sub-Account</Label>
                <Select
                  value={transferForm.subAccountId}
                  onValueChange={(value) => setTransferForm(prev => ({ ...prev, subAccountId: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub-account" />
                  </SelectTrigger>
                  <SelectContent>
                    {subAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} ({account.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={transferForm.amount}
                  onChange={(e) => setTransferForm(prev => ({ ...prev, amount: e.target.value }))}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Available balance: ${userWalletBalance.toFixed(2)}
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Transfer Funds</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sub-Accounts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Sub-Accounts ({subAccounts.length}/3)</h2>
          {subAccounts.length >= 3 && (
            <Alert className="w-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Maximum sub-accounts limit reached
              </AlertDescription>
            </Alert>
          )}
        </div>

        {subAccounts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Sub-Accounts Yet</h3>
              <p className="text-muted-foreground text-center mb-6">
                Create your first sub-account to start delegating SMS management
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Create First Sub-Account
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {subAccounts.map((account) => (
              <Card key={account.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {account.name}
                        <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                          {account.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{account.email}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(account)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSubAccount(account.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Wallet Balance</p>
                      <p className="text-lg font-semibold">${account.walletBalance.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Assigned Numbers</p>
                      <div className="space-y-1">
                        {account.assignedNumbers.length > 0 ? (
                          account.assignedNumbers.map((number, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              <Phone className="h-3 w-3 mr-1" />
                              {number}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">None assigned</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created</p>
                      <p className="text-sm">{new Date(account.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Sub-Account</DialogTitle>
            <DialogDescription>
              Update sub-account details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubAccount} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Name</Label>
              <Input
                id="editName"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editEmail">Email</Label>
              <Input
                id="editEmail"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Change Password (Optional)</h4>
              
              <div className="space-y-2">
                <Label htmlFor="editPassword">New Password</Label>
                <Input
                  id="editPassword"
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editConfirmPassword">Confirm New Password</Label>
                <Input
                  id="editConfirmPassword"
                  type="password"
                  value={editForm.confirmPassword}
                  onChange={(e) => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Sub-Account</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
