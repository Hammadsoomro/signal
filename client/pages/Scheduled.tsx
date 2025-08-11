import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  Calendar, 
  Clock, 
  MessageSquare, 
  Phone,
  Users,
  Edit,
  Trash2,
  Plus,
  Play,
  Pause,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScheduledMessage {
  id: string;
  message: string;
  fromNumber: string;
  recipients: string[];
  scheduledTime: string;
  status: 'scheduled' | 'sending' | 'sent' | 'failed' | 'paused';
  createdAt: string;
  totalCost: number;
}

export default function Scheduled() {
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<ScheduledMessage | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([
    {
      id: '1',
      message: 'Welcome to our service! Thanks for signing up.',
      fromNumber: '+1 (555) 123-4567',
      recipients: ['+1 (555) 987-6543', '+1 (555) 876-5432'],
      scheduledTime: '2024-01-21T10:00:00Z',
      status: 'scheduled',
      createdAt: '2024-01-20T15:30:00Z',
      totalCost: 0.02
    },
    {
      id: '2',
      message: 'Reminder: Your appointment is tomorrow at 2 PM.',
      fromNumber: '+1 (555) 234-5678',
      recipients: ['+1 (555) 765-4321'],
      scheduledTime: '2024-01-21T09:00:00Z',
      status: 'scheduled',
      createdAt: '2024-01-20T14:15:00Z',
      totalCost: 0.01
    },
    {
      id: '3',
      message: 'Special offer: Get 20% off your next purchase!',
      fromNumber: '+1 (555) 345-6789',
      recipients: ['+1 (555) 987-6543', '+1 (555) 876-5432', '+1 (555) 765-4321'],
      scheduledTime: '2024-01-20T18:00:00Z',
      status: 'sent',
      createdAt: '2024-01-20T12:00:00Z',
      totalCost: 0.03
    },
    {
      id: '4',
      message: 'Meeting has been rescheduled to 3 PM tomorrow.',
      fromNumber: '+1 (555) 123-4567',
      recipients: ['+1 (555) 654-3210'],
      scheduledTime: '2024-01-21T11:30:00Z',
      status: 'paused',
      createdAt: '2024-01-20T13:45:00Z',
      totalCost: 0.01
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'default';
      case 'sending':
        return 'default';
      case 'sent':
        return 'secondary';
      case 'failed':
        return 'destructive';
      case 'paused':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Calendar className="h-3 w-3" />;
      case 'sending':
        return <Clock className="h-3 w-3" />;
      case 'sent':
        return <MessageSquare className="h-3 w-3" />;
      case 'failed':
        return <MessageSquare className="h-3 w-3" />;
      case 'paused':
        return <Pause className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const deleteMessage = (messageId: string) => {
    setScheduledMessages(prev => prev.filter(msg => msg.id !== messageId));
    toast({
      title: "Message Deleted",
      description: "Scheduled message has been deleted.",
    });
  };

  const pauseResumeMessage = (messageId: string) => {
    setScheduledMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, status: msg.status === 'paused' ? 'scheduled' : 'paused' as 'scheduled' | 'paused' }
        : msg
    ));

    const message = scheduledMessages.find(msg => msg.id === messageId);
    const newStatus = message?.status === 'paused' ? 'scheduled' : 'paused';
    
    toast({
      title: newStatus === 'paused' ? "Message Paused" : "Message Resumed",
      description: `Scheduled message has been ${newStatus === 'paused' ? 'paused' : 'resumed'}.`,
    });
  };

  const viewMessage = (message: ScheduledMessage) => {
    setSelectedMessage(message);
    setIsViewDialogOpen(true);
  };

  const pendingMessages = scheduledMessages.filter(msg => ['scheduled', 'sending'].includes(msg.status));
  const completedMessages = scheduledMessages.filter(msg => ['sent', 'failed'].includes(msg.status));
  const totalScheduled = scheduledMessages.filter(msg => msg.status === 'scheduled').length;
  const totalCost = scheduledMessages.reduce((sum, msg) => sum + msg.totalCost, 0);

  return (
    <DashboardLayout title="Scheduled Messages">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Scheduled Messages</h1>
            <p className="text-muted-foreground">
              Manage and monitor your scheduled SMS campaigns
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Schedule New Message
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scheduled</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalScheduled}</div>
              <p className="text-xs text-muted-foreground">Active campaigns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduledMessages.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {scheduledMessages.reduce((sum, msg) => sum + msg.recipients.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Across all campaigns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Campaign spend</p>
            </CardContent>
          </Card>
        </div>

        {/* Scheduled Messages List */}
        <div className="space-y-6">
          {/* Pending Messages */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Pending Messages</h2>
            {pendingMessages.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Scheduled Messages</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Schedule your first SMS campaign to get started
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Message
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {pendingMessages.map((message) => (
                  <Card key={message.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant={getStatusColor(message.status)} className="flex items-center gap-1">
                              {getStatusIcon(message.status)}
                              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {message.fromNumber}
                            </div>
                          </div>
                          
                          <p className="font-medium mb-1 truncate">{message.message}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {message.recipients.length} recipient{message.recipients.length > 1 ? 's' : ''}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDateTime(message.scheduledTime)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              ${message.totalCost.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewMessage(message)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => pauseResumeMessage(message.id)}
                          >
                            {message.status === 'paused' ? (
                              <Play className="h-4 w-4" />
                            ) : (
                              <Pause className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteMessage(message.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Completed Messages */}
          {completedMessages.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Completed Messages</h2>
              <div className="space-y-3">
                {completedMessages.map((message) => (
                  <Card key={message.id} className="opacity-75">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant={getStatusColor(message.status)} className="flex items-center gap-1">
                              {getStatusIcon(message.status)}
                              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {message.fromNumber}
                            </div>
                          </div>
                          
                          <p className="font-medium mb-1 truncate">{message.message}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {message.recipients.length} recipient{message.recipients.length > 1 ? 's' : ''}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Sent {formatDateTime(message.scheduledTime)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              ${message.totalCost.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewMessage(message)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* View Message Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Message Details</DialogTitle>
              <DialogDescription>
                View details for scheduled message
              </DialogDescription>
            </DialogHeader>
            
            {selectedMessage && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <Badge variant={getStatusColor(selectedMessage.status)} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(selectedMessage.status)}
                        {selectedMessage.status.charAt(0).toUpperCase() + selectedMessage.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">From Number</Label>
                    <p className="mt-1">{selectedMessage.fromNumber}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Message</Label>
                  <p className="mt-1 p-3 bg-muted rounded-lg">{selectedMessage.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Scheduled Time</Label>
                    <p className="mt-1">{formatDateTime(selectedMessage.scheduledTime)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Total Cost</Label>
                    <p className="mt-1">${selectedMessage.totalCost.toFixed(2)}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Recipients ({selectedMessage.recipients.length})</Label>
                  <div className="mt-1 p-3 bg-muted rounded-lg max-h-32 overflow-y-auto">
                    {selectedMessage.recipients.map((recipient, idx) => (
                      <div key={idx} className="text-sm">{recipient}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
