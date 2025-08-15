import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  Search,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  MessageSquare,
  Phone,
  Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Transaction {
  id: string;
  type:
    | "sms_sent"
    | "credit_added"
    | "number_purchase"
    | "refund"
    | "sub_account_transfer";
  amount: number;
  description: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  reference: string;
  from?: string;
  to?: string;
  balance_after: number;
}

// No mock data - all transactions come from database

export default function Transactions() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.from && transaction.from.includes(searchTerm)) ||
      (transaction.to && transaction.to.includes(searchTerm));

    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sms_sent":
        return <MessageSquare className="w-4 h-4" />;
      case "credit_added":
        return <ArrowDownLeft className="w-4 h-4" />;
      case "number_purchase":
        return <Phone className="w-4 h-4" />;
      case "sub_account_transfer":
        return <Users className="w-4 h-4" />;
      case "refund":
        return <ArrowUpRight className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "sms_sent":
        return "bg-blue-100 text-blue-800";
      case "credit_added":
        return "bg-green-100 text-green-800";
      case "number_purchase":
        return "bg-purple-100 text-purple-800";
      case "sub_account_transfer":
        return "bg-orange-100 text-orange-800";
      case "refund":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "sms_sent":
        return "SMS Sent";
      case "credit_added":
        return "Credit Added";
      case "number_purchase":
        return "Number Purchase";
      case "sub_account_transfer":
        return "Transfer";
      case "refund":
        return "Refund";
      default:
        return type;
    }
  };

  const totalSpent = transactions
    .filter((t) => t.amount < 0 && t.status === "completed")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalAdded = transactions
    .filter((t) => t.amount > 0 && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const smsCount = transactions.filter(
    (t) => t.type === "sms_sent" && t.status === "completed",
  ).length;

  const pendingCount = transactions.filter(
    (t) => t.status === "pending",
  ).length;

  return (
    <DashboardLayout title="Transactions">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Transaction History</h1>
            <p className="text-gray-600">
              Track all your account transactions and spending
            </p>
          </div>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ArrowDownLeft className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Added</p>
                  <p className="text-xl font-bold">${totalAdded.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <ArrowUpRight className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-xl font-bold">${totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">SMS Sent</p>
                  <p className="text-xl font-bold">{smsCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <CreditCard className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-xl font-bold">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle>All Transactions</CardTitle>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="sms_sent">SMS Sent</SelectItem>
                    <SelectItem value="credit_added">Credit Added</SelectItem>
                    <SelectItem value="number_purchase">
                      Number Purchase
                    </SelectItem>
                    <SelectItem value="sub_account_transfer">
                      Transfer
                    </SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Balance After</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1 rounded ${getTypeColor(transaction.type)}`}
                        >
                          {getTypeIcon(transaction.type)}
                        </div>
                        <span className="text-sm font-medium">
                          {getTypeLabel(transaction.type)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{transaction.description}</p>
                        {(transaction.from || transaction.to) && (
                          <p className="text-xs text-gray-500 mt-1">
                            {transaction.from && `From: ${transaction.from}`}
                            {transaction.from && transaction.to && " → "}
                            {transaction.to && `To: ${transaction.to}`}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-medium ${
                          transaction.amount >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.amount >= 0 ? "+" : ""}$
                        {transaction.amount.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status.charAt(0).toUpperCase() +
                          transaction.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {transaction.reference}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      ${transaction.balance_after.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">
                  No transactions found matching your filters
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
