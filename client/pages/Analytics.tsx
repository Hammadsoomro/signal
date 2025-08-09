import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  MessageSquare, 
  Users, 
  DollarSign,
  Calendar
} from 'lucide-react';

export default function Analytics() {
  const stats = [
    {
      title: "Messages Sent",
      value: "2,543",
      change: "+12%",
      icon: MessageSquare,
      trend: "up"
    },
    {
      title: "Total Recipients",
      value: "1,234",
      change: "+8%",
      icon: Users,
      trend: "up"
    },
    {
      title: "Total Spent",
      value: "$456.78",
      change: "-3%",
      icon: DollarSign,
      trend: "down"
    },
    {
      title: "Delivery Rate",
      value: "98.5%",
      change: "+0.5%",
      icon: TrendingUp,
      trend: "up"
    }
  ];

  return (
    <DashboardLayout title="Analytics">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track your SMS performance, delivery rates, and spending analytics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <Badge variant={stat.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                    {stat.change} from last month
                  </Badge>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Placeholder */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Message Volume Over Time</CardTitle>
              <CardDescription>Daily SMS sending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Chart visualization coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Success Rate</CardTitle>
              <CardDescription>Message delivery performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Chart visualization coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaign Performance</CardTitle>
            <CardDescription>Latest SMS campaign results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { campaign: "Welcome Message", sent: 145, delivered: 142, date: "Today" },
                { campaign: "Promotion Alert", sent: 89, delivered: 87, date: "Yesterday" },
                { campaign: "Support Follow-up", sent: 67, delivered: 66, date: "2 days ago" }
              ].map((campaign, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{campaign.campaign}</p>
                    <p className="text-sm text-muted-foreground">{campaign.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{campaign.delivered}/{campaign.sent} delivered</p>
                    <p className="text-sm text-muted-foreground">
                      {((campaign.delivered / campaign.sent) * 100).toFixed(1)}% success rate
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
