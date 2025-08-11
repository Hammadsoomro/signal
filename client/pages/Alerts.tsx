import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Bell,
  Settings,
  Mail,
  MessageSquare,
  AlertTriangle,
  DollarSign,
  TrendingDown,
  Users,
  Phone,
  Zap,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AlertSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: "email" | "sms" | "push";
  threshold?: number;
  icon: React.ReactNode;
  category: "financial" | "operational" | "security" | "performance";
}

interface Alert {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  timestamp: string;
  read: boolean;
  category: "financial" | "operational" | "security" | "performance";
}

const alertSettings: AlertSetting[] = [
  {
    id: "1",
    name: "Low Balance Warning",
    description: "Get notified when wallet balance falls below threshold",
    enabled: true,
    type: "email",
    threshold: 10,
    icon: <DollarSign className="w-4 h-4" />,
    category: "financial",
  },
  {
    id: "2",
    name: "SMS Delivery Failures",
    description: "Alert when SMS delivery failure rate exceeds threshold",
    enabled: true,
    type: "sms",
    threshold: 5,
    icon: <MessageSquare className="w-4 h-4" />,
    category: "operational",
  },
  {
    id: "3",
    name: "High Usage Alert",
    description: "Notify when daily SMS usage exceeds normal patterns",
    enabled: false,
    type: "email",
    threshold: 100,
    icon: <TrendingDown className="w-4 h-4" />,
    category: "performance",
  },
  {
    id: "4",
    name: "New Sub-Account Created",
    description: "Get notified when a new sub-account is created",
    enabled: true,
    type: "push",
    icon: <Users className="w-4 h-4" />,
    category: "operational",
  },
  {
    id: "5",
    name: "Number Purchase",
    description: "Alert when new phone numbers are purchased",
    enabled: true,
    type: "email",
    icon: <Phone className="w-4 h-4" />,
    category: "operational",
  },
  {
    id: "6",
    name: "System Performance Issues",
    description: "Get notified about system outages or performance degradation",
    enabled: true,
    type: "sms",
    icon: <Zap className="w-4 h-4" />,
    category: "performance",
  },
];

const recentAlerts: Alert[] = [
  {
    id: "1",
    title: "Low Balance Warning",
    message:
      "Your wallet balance has dropped below $10. Please add funds to continue sending SMS.",
    type: "warning",
    timestamp: "2024-01-14 15:30",
    read: false,
    category: "financial",
  },
  {
    id: "2",
    title: "SMS Delivery Success",
    message:
      "Successfully delivered 125 SMS messages to your marketing campaign recipients.",
    type: "success",
    timestamp: "2024-01-14 14:15",
    read: true,
    category: "operational",
  },
  {
    id: "3",
    title: "High Usage Detected",
    message:
      "Your account has sent 150% more SMS than usual today. Monitor for unusual activity.",
    type: "info",
    timestamp: "2024-01-14 13:45",
    read: false,
    category: "performance",
  },
  {
    id: "4",
    title: "New Number Purchase",
    message: "Successfully purchased phone number +1234567890 for $5.00.",
    type: "success",
    timestamp: "2024-01-14 12:20",
    read: true,
    category: "operational",
  },
  {
    id: "5",
    title: "System Maintenance Complete",
    message:
      "Scheduled maintenance has been completed. All services are now operational.",
    type: "info",
    timestamp: "2024-01-14 11:10",
    read: true,
    category: "performance",
  },
];

export default function Alerts() {
  const [settings, setSettings] = useState<AlertSetting[]>(alertSettings);
  const [alerts, setAlerts] = useState<Alert[]>(recentAlerts);
  const [notificationEmail, setNotificationEmail] =
    useState("user@example.com");
  const [notificationPhone, setNotificationPhone] = useState("+1234567890");

  const toggleAlert = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting,
      ),
    );
  };

  const updateThreshold = (id: string, threshold: number) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, threshold } : setting,
      ),
    );
  };

  const markAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert)),
    );
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "financial":
        return "bg-green-100 text-green-800";
      case "operational":
        return "bg-blue-100 text-blue-800";
      case "security":
        return "bg-red-100 text-red-800";
      case "performance":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const unreadCount = alerts.filter((alert) => !alert.read).length;
  const enabledAlertsCount = settings.filter(
    (setting) => setting.enabled,
  ).length;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Alerts & Notifications</h1>
            <p className="text-gray-600">
              Manage your notification preferences and view recent alerts
            </p>
          </div>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Advanced Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bell className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Unread Alerts</p>
                  <p className="text-xl font-bold">{unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Settings className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Alerts</p>
                  <p className="text-xl font-bold">{enabledAlertsCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Alerts</p>
                  <p className="text-xl font-bold">{alerts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Notification Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Notification Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={notificationPhone}
                    onChange={(e) => setNotificationPhone(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Alert Preferences</h3>
                {settings.map((setting) => (
                  <div
                    key={setting.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${getCategoryColor(setting.category)}`}
                      >
                        {setting.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{setting.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {setting.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {setting.description}
                        </p>
                        {setting.threshold && (
                          <div className="flex items-center gap-2">
                            <Label className="text-xs">Threshold:</Label>
                            <Input
                              type="number"
                              value={setting.threshold}
                              onChange={(e) =>
                                updateThreshold(
                                  setting.id,
                                  Number(e.target.value),
                                )
                              }
                              className="w-20 h-7 text-xs"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <Switch
                      checked={setting.enabled}
                      onCheckedChange={() => toggleAlert(setting.id)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      alert.read ? "bg-gray-50" : "bg-white border-blue-200"
                    }`}
                    onClick={() => markAsRead(alert.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4
                            className={`font-medium ${!alert.read ? "text-blue-900" : "text-gray-900"}`}
                          >
                            {alert.title}
                          </h4>
                          {!alert.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {alert.message}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge className={getAlertTypeColor(alert.type)}>
                            {alert.type.charAt(0).toUpperCase() +
                              alert.type.slice(1)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {alert.category}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {alerts.length === 0 && (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No alerts to display</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Custom Alert Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rule-name">Rule Name</Label>
                  <Input
                    id="rule-name"
                    placeholder="Enter rule name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="trigger">Trigger Condition</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balance">Balance threshold</SelectItem>
                      <SelectItem value="usage">Usage limit</SelectItem>
                      <SelectItem value="delivery">Delivery rate</SelectItem>
                      <SelectItem value="response">Response rate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="rule-description">Description</Label>
                <Textarea
                  id="rule-description"
                  placeholder="Describe when this alert should trigger"
                  className="mt-1"
                />
              </div>

              <Button>Create Custom Rule</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
