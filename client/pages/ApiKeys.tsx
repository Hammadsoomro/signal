import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Key,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Shield,
  Calendar,
  AlertTriangle,
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
import { useToast } from "@/hooks/use-toast";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  enabled: boolean;
  created: string;
  lastUsed: string | null;
  expiresAt: string | null;
  description?: string;
  usageCount: number;
  rateLimit: number;
}

const mockApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production API Key",
    key: "ck_1234567890abcdefghijklmnopqrstuvwxyz",
    permissions: ["sms:send", "sms:read", "wallet:read"],
    enabled: true,
    created: "2024-01-10 10:00",
    lastUsed: "2024-01-14 15:30",
    expiresAt: null,
    description: "Main API key for production SMS sending",
    usageCount: 1547,
    rateLimit: 1000,
  },
  {
    id: "2",
    name: "Analytics Dashboard",
    key: "ck_abcdef1234567890ghijklmnopqrstuvwxyz",
    permissions: ["analytics:read", "sms:read"],
    enabled: true,
    created: "2024-01-12 14:30",
    lastUsed: "2024-01-14 12:45",
    expiresAt: "2024-06-12",
    description: "Read-only access for analytics dashboard",
    usageCount: 234,
    rateLimit: 500,
  },
  {
    id: "3",
    name: "Webhook Testing",
    key: "ck_testing123456789abcdefghijklmnopqr",
    permissions: ["webhooks:manage"],
    enabled: false,
    created: "2024-01-13 16:45",
    lastUsed: null,
    expiresAt: "2024-02-13",
    description: "Temporary key for webhook development",
    usageCount: 0,
    rateLimit: 100,
  },
];

const availablePermissions = [
  { value: "sms:send", label: "Send SMS", description: "Send SMS messages" },
  {
    value: "sms:read",
    label: "Read SMS",
    description: "View SMS history and details",
  },
  {
    value: "numbers:manage",
    label: "Manage Numbers",
    description: "Purchase and manage phone numbers",
  },
  {
    value: "wallet:read",
    label: "Read Wallet",
    description: "View wallet balance and transactions",
  },
  {
    value: "wallet:manage",
    label: "Manage Wallet",
    description: "Add funds and manage wallet",
  },
  {
    value: "subaccounts:manage",
    label: "Manage Sub-accounts",
    description: "Create and manage sub-accounts",
  },
  {
    value: "analytics:read",
    label: "Read Analytics",
    description: "View analytics and reports",
  },
  {
    value: "webhooks:manage",
    label: "Manage Webhooks",
    description: "Create and manage webhook endpoints",
  },
  {
    value: "admin:full",
    label: "Full Admin Access",
    description: "Complete access to all features",
  },
];

export default function ApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
    enabled: true,
    expiresAt: "",
    rateLimit: 1000,
  });

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "API key has been copied to clipboard",
    });
  };

  const toggleApiKey = (id: string) => {
    setApiKeys((prev) =>
      prev.map((key) =>
        key.id === id ? { ...key, enabled: !key.enabled } : key,
      ),
    );
  };

  const generateApiKey = () => {
    return `ck_${Math.random().toString(36).substring(2, 50)}`;
  };

  const handleCreate = () => {
    const newApiKey: ApiKey = {
      id: Date.now().toString(),
      name: formData.name,
      key: generateApiKey(),
      permissions: formData.permissions,
      enabled: formData.enabled,
      created: new Date().toISOString(),
      lastUsed: null,
      expiresAt: formData.expiresAt || null,
      description: formData.description,
      usageCount: 0,
      rateLimit: formData.rateLimit,
    };

    setApiKeys((prev) => [...prev, newApiKey]);
    setShowCreateDialog(false);
    resetForm();

    toast({
      title: "API Key Created",
      description: "Your new API key has been generated successfully",
    });
  };

  const handleUpdate = () => {
    if (!editingKey) return;

    setApiKeys((prev) =>
      prev.map((key) =>
        key.id === editingKey.id ? { ...key, ...formData } : key,
      ),
    );
    setEditingKey(null);
    resetForm();

    toast({
      title: "API Key Updated",
      description: "API key has been updated successfully",
    });
  };

  const handleDelete = (id: string) => {
    setApiKeys((prev) => prev.filter((key) => key.id !== id));
    setDeleteId(null);

    toast({
      title: "API Key Deleted",
      description: "API key has been permanently deleted",
      variant: "destructive",
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      permissions: [],
      enabled: true,
      expiresAt: "",
      rateLimit: 1000,
    });
  };

  const openEditDialog = (key: ApiKey) => {
    setFormData({
      name: key.name,
      description: key.description || "",
      permissions: key.permissions,
      enabled: key.enabled,
      expiresAt: key.expiresAt || "",
      rateLimit: key.rateLimit,
    });
    setEditingKey(key);
  };

  const isExpiringSoon = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    const expiryDate = new Date(expiresAt);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow;
  };

  const activeKeys = apiKeys.filter((k) => k.enabled).length;
  const totalUsage = apiKeys.reduce((sum, k) => sum + k.usageCount, 0);
  const expiringKeys = apiKeys.filter((k) =>
    isExpiringSoon(k.expiresAt),
  ).length;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">API Keys</h1>
            <p className="text-gray-600">
              Manage API keys for programmatic access to your account
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create API Key
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Key className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Keys</p>
                  <p className="text-xl font-bold">{activeKeys}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Usage</p>
                  <p className="text-xl font-bold">
                    {totalUsage.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expiring Soon</p>
                  <p className="text-xl font-bold">{expiringKeys}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Keys</p>
                  <p className="text-xl font-bold">{apiKeys.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your API Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold">{apiKey.name}</h3>
                        <Badge
                          variant={apiKey.enabled ? "default" : "secondary"}
                        >
                          {apiKey.enabled ? "Active" : "Disabled"}
                        </Badge>
                        {apiKey.expiresAt &&
                          isExpiringSoon(apiKey.expiresAt) && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Expiring Soon
                            </Badge>
                          )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-medium">
                            API Key:
                          </Label>
                          <div className="flex items-center gap-2">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                              {visibleKeys.has(apiKey.id)
                                ? apiKey.key
                                : `${apiKey.key.substring(0, 16)}${"*".repeat(24)}`}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                            >
                              {visibleKeys.has(apiKey.id) ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(apiKey.key)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {apiKey.description && (
                          <p className="text-sm text-gray-600">
                            {apiKey.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-1">
                          {apiKey.permissions.map((permission) => (
                            <Badge
                              key={permission}
                              variant="outline"
                              className="text-xs"
                            >
                              {availablePermissions.find(
                                (p) => p.value === permission,
                              )?.label || permission}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Created:</span>
                            <div>
                              {new Date(apiKey.created).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Last Used:</span>
                            <div>
                              {apiKey.lastUsed
                                ? new Date(apiKey.lastUsed).toLocaleDateString()
                                : "Never"}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Usage Count:</span>
                            <div>{apiKey.usageCount.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="font-medium">Rate Limit:</span>
                            <div>{apiKey.rateLimit}/hour</div>
                          </div>
                        </div>

                        {apiKey.expiresAt && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Expires:</span>{" "}
                            {new Date(apiKey.expiresAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Switch
                        checked={apiKey.enabled}
                        onCheckedChange={() => toggleApiKey(apiKey.id)}
                      />

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(apiKey)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(apiKey.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {apiKeys.length === 0 && (
                <div className="text-center py-8">
                  <Key className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No API keys created yet</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => setShowCreateDialog(true)}
                  >
                    Create your first API key
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Dialog
          open={showCreateDialog || !!editingKey}
          onOpenChange={(open) => {
            if (!open) {
              setShowCreateDialog(false);
              setEditingKey(null);
              resetForm();
            }
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingKey ? "Edit API Key" : "Create New API Key"}
              </DialogTitle>
              <DialogDescription>
                Configure your API key with specific permissions and usage
                limits
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">API Key Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Production API Key"
                  />
                </div>
                <div>
                  <Label htmlFor="rateLimit">Rate Limit (requests/hour)</Label>
                  <Input
                    id="rateLimit"
                    type="number"
                    value={formData.rateLimit}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        rateLimit: Number(e.target.value),
                      }))
                    }
                    placeholder="1000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe what this API key will be used for"
                />
              </div>

              <div>
                <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      expiresAt: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label>Permissions</Label>
                <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
                  {availablePermissions.map((permission) => (
                    <label
                      key={permission.value}
                      className="flex items-start gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(
                          permission.value,
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData((prev) => ({
                              ...prev,
                              permissions: [
                                ...prev.permissions,
                                permission.value,
                              ],
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              permissions: prev.permissions.filter(
                                (p) => p !== permission.value,
                              ),
                            }));
                          }
                        }}
                        className="mt-1"
                      />
                      <div>
                        <span className="font-medium text-sm">
                          {permission.label}
                        </span>
                        <p className="text-xs text-gray-600">
                          {permission.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.enabled}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, enabled: checked }))
                  }
                />
                <Label>Enable API key immediately</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  setEditingKey(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={editingKey ? handleUpdate : handleCreate}>
                {editingKey ? "Update API Key" : "Create API Key"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete API Key?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The API key will be permanently
                deleted and all applications using this key will lose access
                immediately.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && handleDelete(deleteId)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete API Key
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
