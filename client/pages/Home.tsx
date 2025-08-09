import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
  Upload,
  UserPlus,
  Group,
  CreditCard,
  Key,
  Bell,
  Webhook,
  DollarSign,
  Receipt,
  Menu,
  X,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['messaging']);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const navigation: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, href: '/home' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics' },
    {
      id: 'messaging',
      label: 'Messaging',
      icon: MessageSquare,
      children: [
        { id: 'conversations', label: 'Conversations', icon: MessageSquare, href: '/conversations' },
        { id: 'send', label: 'Send SMS', icon: Send, href: '/send' },
        { id: 'scheduled', label: 'Scheduled', icon: Calendar, href: '/scheduled' },
        { id: 'responses', label: 'Responses', icon: Inbox, href: '/responses' }
      ]
    },
    { id: 'sub-accounts', label: 'Sub-Accounts', icon: Users, href: '/sub-accounts' },
    { id: 'buy-numbers', label: 'Buy Numbers', icon: Phone, href: '/buy-numbers' },
    {
      id: 'billing',
      label: 'Billing',
      icon: DollarSign,
      children: [
        { id: 'wallet', label: 'Wallet', icon: Wallet, href: '/wallet' },
        { id: 'transactions', label: 'Transactions', icon: Receipt, href: '/transactions' }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      children: [
        { id: 'api-keys', label: 'API Keys', icon: Key, href: '/api-keys' },
        { id: 'webhooks', label: 'Webhooks', icon: Webhook, href: '/webhooks' },
        { id: 'alerts', label: 'Alerts', icon: Bell, href: '/alerts' }
      ]
    },
    { id: 'support', label: 'Support', icon: HelpCircle, href: '/support' }
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
              "hover:bg-slate-700 text-white",
              level > 0 && "ml-4 pl-6"
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
            to={item.href || '#'}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors text-white",
              "hover:bg-slate-700",
              isActive && "bg-blue-600 hover:bg-blue-600",
              level > 0 && "ml-4 pl-6"
            )}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span>{item.label}</span>
          </Link>
        )}
        
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderNavItem(child, level + 1))}
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
      <div className={cn(
        "fixed left-0 top-0 z-50 h-screen w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-800 flex-shrink-0">
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
          <Card className="bg-blue-600 border-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Wallet className="h-6 w-6 text-white" />
                <div>
                  <p className="text-white/80 text-sm font-medium uppercase">Current Balance</p>
                  <p className="text-white text-lg font-bold">$125.50</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-4">
            <div className="space-y-2 pb-4">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide px-3 py-2">
                Navigation
              </div>
              {navigation.map(item => renderNavItem(item))}
            </div>
            
            <Separator className="my-4 bg-slate-700 mx-3" />
            
            <div className="space-y-2 pb-4">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide px-3 py-2">
                Help
              </div>
              {renderNavItem({ id: 'support', label: 'Support', icon: HelpCircle, href: '/support' })}
            </div>

            <div className="space-y-2 pb-6">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide px-3 py-2">
                System Health
              </div>
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-slate-300">All Systems Operational</span>
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

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="border-b border-border bg-background/95 backdrop-blur flex-shrink-0">
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="font-medium">$125.50</span>
              </div>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">U</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
              <p className="text-muted-foreground">
                Here's what's happening with your SMS communications today.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,543</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Numbers</CardTitle>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">
                    3 main + 2 assigned
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sub-Accounts</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">
                    1 remaining slot
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$125.50</div>
                  <p className="text-xs text-muted-foreground">
                    <Link to="/wallet" className="text-primary hover:underline">
                      Add funds
                    </Link>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                  <CardDescription>
                    Your latest SMS conversations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { contact: '+1 (555) 123-4567', message: 'Thanks for the quick response!', time: '2 min ago', status: 'received' },
                      { contact: '+1 (555) 234-5678', message: 'Meeting confirmed for tomorrow', time: '15 min ago', status: 'sent' },
                      { contact: '+1 (555) 345-6789', message: 'Can you send me the details?', time: '1 hour ago', status: 'received' },
                    ].map((msg, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          msg.status === 'sent' ? 'bg-blue-500' : 'bg-green-500'
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{msg.contact}</p>
                          <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">{msg.time}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/conversations">View all conversations</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common tasks and shortcuts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/send">
                      <Send className="mr-2 h-4 w-4" />
                      Send New SMS
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/buy-numbers">
                      <Phone className="mr-2 h-4 w-4" />
                      Buy New Number
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/sub-accounts">
                      <Users className="mr-2 h-4 w-4" />
                      Manage Sub-Accounts
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/wallet">
                      <Wallet className="mr-2 h-4 w-4" />
                      Add Funds
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
