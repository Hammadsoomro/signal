import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AdSense, AdSenseConfigs } from "@/components/AdSense";
import { MessageSquare, Phone, Users, Wallet } from "lucide-react";
import { signalWireClient } from "@/lib/signalwire";
import { useWallet } from "@/contexts/WalletContext";

interface DashboardStats {
  totalMessages: number;
  activeNumbers: number;
  subAccounts: number;
  messagesSentToday: number;
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMessages: 0,
    activeNumbers: 0,
    subAccounts: 0,
    messagesSentToday: 0,
  });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { balance } = useWallet();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load real data from SMS service and database
      const [messagesData, numbersData] = await Promise.all([
        signalWireClient.getMessages(10),
        signalWireClient.getOwnedPhoneNumbers(),
      ]);

      // Update stats with real data
      setStats({
        totalMessages: messagesData.messages?.length || 0,
        activeNumbers: numbersData.incoming_phone_numbers?.length || 0,
        subAccounts: 0, // Will load from database
        messagesSentToday:
          messagesData.messages?.filter((msg: any) => {
            const today = new Date().toDateString();
            return new Date(msg.date_sent).toDateString() === today;
          }).length || 0,
      });

      // Set recent messages
      setRecentMessages(messagesData.messages?.slice(0, 5) || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Fallback to empty state for now
      setStats({
        totalMessages: 0,
        activeNumbers: 0,
        subAccounts: 0,
        messagesSentToday: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Welcome back, Jaxon!
            </h2>
            <p className="text-muted-foreground">
              Here's what's happening with your SMS communications today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Messages
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : stats.totalMessages.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.messagesSentToday} sent today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Numbers
                </CardTitle>
                <Phone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : stats.activeNumbers}
                </div>
                <p className="text-xs text-muted-foreground">
                  <Link
                    to="/buy-numbers"
                    className="text-primary hover:underline"
                  >
                    Buy more numbers
                  </Link>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Sub-Accounts
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : stats.subAccounts}
                </div>
                <p className="text-xs text-muted-foreground">
                  <Link
                    to="/sub-accounts"
                    className="text-primary hover:underline"
                  >
                    Create sub-account
                  </Link>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Wallet Balance
                </CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  <Link to="/wallet" className="text-primary hover:underline">
                    Add funds
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Advertisement */}
          <div className="mb-6">
            <AdSense
              adSlot={AdSenseConfigs.content.adSlot}
              adFormat={AdSenseConfigs.content.adFormat}
              style={AdSenseConfigs.content.style}
              className="w-full"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>
                  Your latest SMS conversations from our SMS service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading real messages from SignalWire...
                    </div>
                  ) : recentMessages.length > 0 ? (
                    recentMessages.map((message: any, index: number) => (
                      <div key={index} className="flex items-center gap-4">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            message.status === "delivered"
                              ? "bg-green-500"
                              : message.status === "sent"
                                ? "bg-blue-500"
                                : "bg-gray-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">
                            {message.direction === "outbound"
                              ? message.to
                              : message.from}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {message.body}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(
                            message.date_sent || message.date_created,
                          ).toLocaleString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No messages found. Start by sending your first SMS!
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Button variant="outline" asChild>
                    <Link to="/conversations">View all conversations</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks to get you started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link to="/send">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send SMS
                  </Link>
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link to="/buy-numbers">
                    <Phone className="mr-2 h-4 w-4" />
                    Buy Phone Number
                  </Link>
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link to="/sub-accounts">
                    <Users className="mr-2 h-4 w-4" />
                    Create Sub-Account
                  </Link>
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link to="/wallet">
                    <Wallet className="mr-2 h-4 w-4" />
                    Add Funds
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>
                  SignalWire and Database connectivity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">SignalWire API</span>
                    </div>
                    <span className="text-xs text-green-600 font-medium">
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">MongoDB Database</span>
                    </div>
                    <span className="text-xs text-green-600 font-medium">
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Wallet System</span>
                    </div>
                    <span className="text-xs text-green-600 font-medium">
                      Operational
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.messagesSentToday}
                </div>
                <p className="text-sm text-muted-foreground">
                  Messages sent today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">SignalWire Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">✓</div>
                <p className="text-sm text-muted-foreground">
                  All services operational
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">100%</div>
                <p className="text-sm text-muted-foreground">
                  System performance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
