import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  Phone,
  Users,
  Wallet,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Send,
  Calendar,
  Inbox,
  Key,
  Bell,
  Webhook,
  DollarSign,
  Receipt,
  X,
  Activity,
  User,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallet } from "@/contexts/WalletContext";
import { useAuth } from "@/contexts/AuthContext";
import { AdSense, AdSenseConfigs } from "@/components/AdSense";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  href?: string;
  children?: NavItem[];
}

export function AppSidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(["messaging"]);
  const { balance } = useWallet();
  const { user } = useAuth();

  // Check if user has permissions
  const canBuyNumbers = user?.permissions?.canBuyNumbers ?? true;
  const canManageWallet = user?.permissions?.canManageWallet ?? true;
  const isMainUser = user?.userType === "main";

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const navigation: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, href: "/home" },
    {
      id: "messaging",
      label: "Messaging",
      icon: MessageSquare,
      children: [
        {
          id: "conversations",
          label: "Conversations",
          icon: MessageSquare,
          href: "/conversations",
        },
        { id: "send", label: "Send SMS", icon: Send, href: "/send" },
        {
          id: "scheduled",
          label: "Scheduled",
          icon: Calendar,
          href: "/scheduled",
        },
      ],
    },
    {
      id: "sub-accounts",
      label: "Sub-Accounts",
      icon: Users,
      href: "/sub-accounts",
    },
    {
      id: "buy-numbers",
      label: "Buy Numbers",
      icon: Phone,
      href: "/buy-numbers",
    },
    {
      id: "billing",
      label: "Billing",
      icon: DollarSign,
      children: [
        { id: "wallet", label: "Wallet", icon: Wallet, href: "/wallet" },
        {
          id: "transactions",
          label: "Transactions",
          icon: Receipt,
          href: "/transactions",
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      children: [
        { id: "profile", label: "Profile", icon: User, href: "/profile" },
      ],
    },
    { id: "support", label: "Support", icon: HelpCircle, href: "/support" },
  ];

  const renderNavItem = (item: NavItem, level = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const isActive = item.href && location.pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors text-left",
              "hover:bg-blue-800/50 text-white",
              level > 0 && "ml-4 pl-6",
            )}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1">{item.label}</span>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 flex-shrink-0" />
            )}
          </button>
        ) : (
          <Link
            to={item.href || "#"}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors text-white",
              "hover:bg-blue-800/50",
              isActive &&
                "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg",
              level > 0 && "ml-4 pl-6",
            )}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span>{item.label}</span>
          </Link>
        )}

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-72 bg-gradient-to-b from-blue-900 via-indigo-900 to-purple-900 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col border-r border-blue-800/50",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-blue-800/30 backdrop-blur flex-shrink-0 border-b border-blue-700/50">
          <Link to="/" className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-bold">Connectlify</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:bg-slate-700"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Wallet Balance */}
        <div className="p-4 flex-shrink-0">
          <Card className="bg-gradient-to-r from-emerald-500 to-cyan-500 border-emerald-400/50 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white/90 text-xs font-medium uppercase tracking-wide">
                    Current Balance
                  </p>
                  <p className="text-white text-xl font-bold">
                    ${balance.toFixed(2)}
                  </p>
                </div>
              </div>
              <Button
                asChild
                size="sm"
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                variant="outline"
              >
                <Link to="/wallet" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Funds
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-4">
            <div className="space-y-2 pb-4">
              <div className="text-xs font-medium text-blue-300 uppercase tracking-wide px-3 py-2">
                Navigation
              </div>
              {navigation.map((item) => renderNavItem(item))}
            </div>

            <Separator className="my-4 bg-blue-700/50 mx-3" />

            {/* Advertisement */}
            <div className="px-3 pb-4">
              <AdSense
                adSlot={AdSenseConfigs.sidebar.adSlot}
                adFormat={AdSenseConfigs.sidebar.adFormat}
                style={AdSenseConfigs.sidebar.style}
                className="w-full"
              />
            </div>

            <div className="space-y-2 pb-6">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide px-3 py-2">
                System Health
              </div>
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-slate-300">
                  All Systems Operational
                </span>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Activity className="h-4 w-4" />
            <span>Made with ❤️ for SMS</span>
          </div>
        </div>
      </div>
    </>
  );
}
