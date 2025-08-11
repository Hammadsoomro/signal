import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Webhook, 
  Plus, 
  Edit3, 
  Trash2, 
  Globe, 
  Shield,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  enabled: boolean;
  secret: string;
  created: string;
  lastCalled: string | null;
  status: 'active' | 'failed' | 'pending';
  failureCount: number;
  description?: string;
}

interface WebhookEvent {
  id: string;
  webhookId: string;
  event: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: string;
  responseCode?: number;
  responseTime?: number;
  payload: any;
  error?: string;
}

const mockWebhooks: WebhookEndpoint[] = [
  {
    id: '1',
    name: 'SMS Delivery Notifications',
    url: 'https://api.myapp.com/webhooks/sms-delivery',
    events: ['sms.delivered', 'sms.failed'],
    enabled: true,
    secret: 'whsec_1234567890abcdef',
    created: '2024-01-10 10:00',
    lastCalled: '2024-01-14 15:30',
    status: 'active',
    failureCount: 0,
    description: 'Receives notifications when SMS messages are delivered or fail'
  },
  {
    id: '2',
    name: 'Low Balance Alert',
    url: 'https://api.myapp.com/webhooks/balance',
    events: ['wallet.low_balance'],
    enabled: true,
    secret: 'whsec_abcdef1234567890',
    created: '2024-01-12 14:30',
    lastCalled: '2024-01-14 14:15',
    status: 'active',
    failureCount: 0,
    description: 'Triggered when wallet balance falls below threshold'
  },
  {
    id: '3',
    name: 'Sub-Account Management',
    url: 'https://api.myapp.com/webhooks/subaccounts',
    events: ['subaccount.created', 'subaccount.updated'],
    enabled: false,
    secret: 'whsec_fedcba0987654321',
    created: '2024-01-13 16:45',
    lastCalled: null,
    status: 'pending',
    failureCount: 0,
    description: 'Notifications for sub-account changes'
  },
  {
    id: '4',
    name: 'Incoming SMS Responses',
    url: 'https://api.myapp.com/webhooks/responses',
    events: ['sms.received'],
    enabled: true,
    secret: 'whsec_9876543210fedcba',
    created: '2024-01-11 09:15',
    lastCalled: '2024-01-14 12:20',
    status: 'failed',
    failureCount: 3,
    description: 'Receives incoming SMS messages and responses'
  }
];

const mockEvents: WebhookEvent[] = [
  {
    id: '1',
    webhookId: '1',
    event: 'sms.delivered',
    status: 'success',
    timestamp: '2024-01-14 15:30',
    responseCode: 200,
    responseTime: 245,
    payload: { messageId: 'msg_123', recipient: '+1987654321', status: 'delivered' }
  },
  {
    id: '2',
    webhookId: '2',
    event: 'wallet.low_balance',
    status: 'success',
    timestamp: '2024-01-14 14:15',
    responseCode: 200,
    responseTime: 180,
    payload: { balance: 9.50, threshold: 10.00 }
  },
  {
    id: '3',
    webhookId: '4',
    event: 'sms.received',
    status: 'failed',
    timestamp: '2024-01-14 12:20',
    responseCode: 500,
    responseTime: 5000,
    payload: { messageId: 'msg_456', sender: '+1987654322', message: 'Hello' },
    error: 'Internal Server Error'
  }
];

export default function Webhooks() {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(mockWebhooks);
  const [events, setEvents] = useState<WebhookEvent[]>(mockEvents);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookEndpoint | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    events: [] as string[],
    enabled: true
  });

  const availableEvents = [
    { value: 'sms.sent', label: 'SMS Sent' },
    { value: 'sms.delivered', label: 'SMS Delivered' },
    { value: 'sms.failed', label: 'SMS Failed' },
    { value: 'sms.received', label: 'SMS Received' },
    { value: 'wallet.low_balance', label: 'Low Balance' },
    { value: 'wallet.credit_added', label: 'Credit Added' },
    { value: 'subaccount.created', label: 'Sub-account Created' },
    { value: 'subaccount.updated', label: 'Sub-account Updated' },
    { value: 'number.purchased', label: 'Number Purchased' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleWebhook = (id: string) => {
    setWebhooks(prev => prev.map(webhook => 
      webhook.id === id ? { ...webhook, enabled: !webhook.enabled } : webhook
    ));
  };

  const handleCreate = () => {
    const newWebhook: WebhookEndpoint = {
      id: Date.now().toString(),
      name: formData.name,
      url: formData.url,
      events: formData.events,
      enabled: formData.enabled,
      secret: `whsec_${Math.random().toString(36).substring(2, 18)}`,
      created: new Date().toISOString(),
      lastCalled: null,
      status: 'pending',
      failureCount: 0,
      description: formData.description
    };
    
    setWebhooks(prev => [...prev, newWebhook]);
    setShowCreateDialog(false);
    resetForm();
  };

  const handleUpdate = () => {
    if (!editingWebhook) return;
    
    setWebhooks(prev => prev.map(webhook => 
      webhook.id === editingWebhook.id 
        ? { ...webhook, ...formData }
        : webhook
    ));
    setEditingWebhook(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setWebhooks(prev => prev.filter(webhook => webhook.id !== id));
    setDeleteId(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      description: '',
      events: [],
      enabled: true
    });
  };

  const openEditDialog = (webhook: WebhookEndpoint) => {
    setFormData({
      name: webhook.name,
      url: webhook.url,
      description: webhook.description || '',
      events: webhook.events,
      enabled: webhook.enabled
    });
    setEditingWebhook(webhook);
  };

  const activeWebhooks = webhooks.filter(w => w.enabled).length;
  const failedWebhooks = webhooks.filter(w => w.status === 'failed').length;
  const totalEvents = events.length;
  const successfulEvents = events.filter(e => e.status === 'success').length;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Webhooks</h1>
            <p className="text-gray-600">Manage webhook endpoints for real-time notifications</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Webhook
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Webhook className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Webhooks</p>
                  <p className="text-xl font-bold">{activeWebhooks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Failed Webhooks</p>
                  <p className="text-xl font-bold">{failedWebhooks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Events Delivered</p>
                  <p className="text-xl font-bold">{successfulEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Globe className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Events</p>
                  <p className="text-xl font-bold">{totalEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Webhook Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{webhook.name}</h3>
                        <Badge className={getStatusColor(webhook.status)}>
                          {webhook.status.charAt(0).toUpperCase() + webhook.status.slice(1)}
                        </Badge>
                        {webhook.failureCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {webhook.failureCount} failures
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Globe className="w-4 h-4" />
                          <span className="font-mono">{webhook.url}</span>
                        </div>
                        
                        {webhook.description && (
                          <p className="text-sm text-gray-600">{webhook.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-1">
                          {webhook.events.map((event) => (
                            <Badge key={event} variant="outline" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Created: {new Date(webhook.created).toLocaleDateString()}</span>
                          {webhook.lastCalled && (
                            <span>Last called: {new Date(webhook.lastCalled).toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Switch
                        checked={webhook.enabled}
                        onCheckedChange={() => toggleWebhook(webhook.id)}
                      />
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(webhook)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(webhook.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {webhooks.length === 0 && (
                <div className="text-center py-8">
                  <Webhook className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No webhooks configured</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setShowCreateDialog(true)}
                  >
                    Create your first webhook
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={getEventStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{event.event}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {event.responseCode && (
                      <span>Status: {event.responseCode}</span>
                    )}
                    {event.responseTime && (
                      <span>Time: {event.responseTime}ms</span>
                    )}
                    {event.error && (
                      <span className="text-red-600">{event.error}</span>
                    )}
                  </div>
                </div>
              ))}
              
              {events.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No webhook events yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Dialog open={showCreateDialog || !!editingWebhook} onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setEditingWebhook(null);
            resetForm();
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingWebhook ? 'Edit Webhook' : 'Create New Webhook'}
              </DialogTitle>
              <DialogDescription>
                Configure your webhook endpoint to receive real-time notifications
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Webhook Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="SMS Delivery Notifications"
                  />
                </div>
                <div>
                  <Label htmlFor="url">Endpoint URL</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://api.myapp.com/webhooks"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this webhook is used for"
                />
              </div>
              
              <div>
                <Label>Events to Subscribe</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableEvents.map((event) => (
                    <label key={event.value} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.events.includes(event.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({ 
                              ...prev, 
                              events: [...prev.events, event.value] 
                            }));
                          } else {
                            setFormData(prev => ({ 
                              ...prev, 
                              events: prev.events.filter(ev => ev !== event.value) 
                            }));
                          }
                        }}
                      />
                      <span className="text-sm">{event.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.enabled}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
                />
                <Label>Enable webhook immediately</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowCreateDialog(false);
                setEditingWebhook(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={editingWebhook ? handleUpdate : handleCreate}>
                {editingWebhook ? 'Update Webhook' : 'Create Webhook'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Webhook?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The webhook endpoint will be permanently deleted
                and will no longer receive events.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && handleDelete(deleteId)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
