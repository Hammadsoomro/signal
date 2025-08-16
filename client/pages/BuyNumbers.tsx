import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Phone,
  Search,
  CreditCard,
  MapPin,
  AlertCircle,
  CheckCircle,
  Loader2,
  ShoppingCart,
  Wallet as WalletIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signalWireClient } from "@/lib/signalwire";
import { useUserNumbers, PurchasedNumber } from "@/contexts/UserNumbersContext";
import { useWallet } from "@/contexts/WalletContext";

interface AvailableNumber {
  id: string;
  number: string;
  city: string;
  state: string;
  country: string;
  price: number;
  features: string[];
  carrier: string;
}

export default function BuyNumbers() {
  const { toast } = useToast();
  const { addPurchasedNumber, purchaseNumber } = useUserNumbers();
  const { balance: walletBalance, deductBalance } = useWallet();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [selectedState, setSelectedState] = useState("all");
  const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<AvailableNumber | null>(
    null,
  );

  const countries = [
    { code: "all", name: "All Countries" },
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "GB", name: "United Kingdom" },
    { code: "AU", name: "Australia" },
  ];

  const usStates = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  // No mock data - all numbers come from real SMS service API

  const searchNumbers = async () => {
    setIsLoading(true);

    try {
      // Use SignalWire API to search for numbers
      const response = await signalWireClient.getAvailablePhoneNumbers(
        selectedCountry,
        searchQuery,
      );

      // Convert SignalWire response to our format
      const numbers =
        response.available_phone_numbers?.map((num: any, index: number) => ({
          id: `sw_${index}`,
          number: num.phone_number,
          city: num.locality,
          state: num.region,
          country: selectedCountry,
          price: 2.5, // Monthly price
          features: ["SMS"], // Primary feature is SMS
          carrier: "SignalWire",
        })) || [];

      setAvailableNumbers(numbers);

      toast({
        title: "Search Complete",
        description: `Found ${numbers.length} available numbers from SignalWire`,
      });
    } catch (error) {
      console.error("SignalWire search error:", error);

      // No numbers available from SMS service
      setAvailableNumbers([]);

      toast({
        title: "Service Unavailable",
        description: "SignalWire API unavailable. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchaseNumber = async (number: AvailableNumber) => {
    if (number.price > walletBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You need $${number.price.toFixed(2)} but only have $${walletBalance.toFixed(2)}. Please add funds to your wallet.`,
        variant: "destructive",
      });
      return;
    }

    setIsPurchasing(true);
    setSelectedNumber(number);

    try {
      // Deduct wallet balance first
      const walletSuccess = await deductBalance(
        number.price,
        `Phone number purchase: ${number.number}`,
      );
      if (!walletSuccess) {
        throw new Error("Insufficient wallet balance");
      }

      // Purchase through database API
      const numberData = {
        number: number.number,
        label: `${number.city} Line`,
        city: number.city,
        state: number.state,
        country: number.country,
        monthlyPrice: number.price,
        capabilities: number.features || ["SMS"],
      };

      const success = await purchaseNumber(numberData);

      if (success) {
        toast({
          title: "Purchase Successful!",
          description: `Successfully purchased ${number.number} for $${number.price.toFixed(2)}`,
        });

        // Remove purchased number from available list
        setAvailableNumbers((prev) => prev.filter((n) => n.id !== number.id));
        setSelectedNumber(null);
      } else {
        // Note: Refund would be handled by wallet context in real implementation
        throw new Error("Failed to purchase phone number");
      }
    } catch (error) {
      console.error("SignalWire purchase error:", error);
      toast({
        title: "Purchase Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to purchase phone number. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  useEffect(() => {
    // Load numbers on component mount
    searchNumbers();
  }, []);

  return (
    <DashboardLayout title="Buy Phone Numbers">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Buy Phone Numbers
            </h1>
            <p className="text-muted-foreground">
              Purchase new phone numbers for SMS communications
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <WalletIcon className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Your Balance</p>
                  <p className="font-semibold">${walletBalance.toFixed(2)}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Search Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search Available Numbers</CardTitle>
            <CardDescription>
              Find phone numbers by location, area code, or specific digits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={selectedCountry}
                  onValueChange={setSelectedCountry}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCountry === "US" && (
                <div className="space-y-2">
                  <Label htmlFor="state">State (Optional)</Label>
                  <Select
                    value={selectedState}
                    onValueChange={setSelectedState}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any State</SelectItem>
                      {usStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Area code, city, or digits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-end">
                <Button
                  onClick={searchNumbers}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  Search Numbers
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Numbers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Available Numbers</h2>
            <Badge variant="outline">
              {availableNumbers.length} numbers found
            </Badge>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Searching for available numbers...</span>
              </CardContent>
            </Card>
          ) : availableNumbers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Phone className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Numbers Found</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Try adjusting your search criteria to find available numbers
                </p>
                <Button onClick={searchNumbers} variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Search Again
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {availableNumbers.map((number) => (
                <Card
                  key={number.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Phone className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-semibold">
                            {number.number}
                          </h3>
                          <Badge variant="outline">{number.carrier}</Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {number.country}
                              {number.state ? `, ${number.state}` : ""}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Features:
                          </span>
                          {number.features.map((feature, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Monthly Cost
                          </p>
                          <p className="text-2xl font-bold text-primary">
                            ${number.price.toFixed(2)}
                          </p>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button disabled={number.price > walletBalance}>
                              {number.price > walletBalance ? (
                                <>
                                  <AlertCircle className="mr-2 h-4 w-4" />
                                  Insufficient Funds
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="mr-2 h-4 w-4" />
                                  Purchase
                                </>
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Purchase</DialogTitle>
                              <DialogDescription>
                                You're about to purchase this phone number
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div>
                                  <p className="font-medium">{number.number}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {number.country}
                                    {number.state ? `, ${number.state}` : ""}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">
                                    ${number.price.toFixed(2)}/month
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Monthly billing
                                  </p>
                                </div>
                              </div>

                              <Alert>
                                <CreditCard className="h-4 w-4" />
                                <AlertDescription>
                                  This number will be charged monthly to your
                                  wallet balance. Make sure you have sufficient
                                  funds for ongoing service.
                                </AlertDescription>
                              </Alert>

                              <div className="flex justify-between items-center p-3 border rounded">
                                <span>Current Balance:</span>
                                <span className="font-semibold">
                                  ${walletBalance.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-3 border rounded">
                                <span>After Purchase:</span>
                                <span className="font-semibold">
                                  ${(walletBalance - number.price).toFixed(2)}
                                </span>
                              </div>
                            </div>

                            <div className="flex justify-end gap-2">
                              <Button variant="outline">Cancel</Button>
                              <Button
                                onClick={() => handlePurchaseNumber(number)}
                                disabled={isPurchasing}
                              >
                                {isPurchasing ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                )}
                                {isPurchasing
                                  ? "Processing..."
                                  : "Confirm Purchase"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Insufficient Balance Alert */}
        {availableNumbers.some((num) => num.price > walletBalance) && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Some numbers require more funds than your current balance.
              <Button variant="link" className="p-0 h-auto ml-1">
                Add funds to your wallet
              </Button>{" "}
              to purchase these numbers.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </DashboardLayout>
  );
}
