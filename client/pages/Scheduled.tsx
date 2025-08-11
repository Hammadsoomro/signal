import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Users,
  MessageSquare,
  Play,
  Pause,
  Trash2,
  Edit3,
  Eye,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface ScheduledMessage {
  id: string;
  message: string;
  recipients: number;
  scheduledTime: string;
  status: "pending" | "paused" | "sent" | "failed";
  created: string;
  sender: string;
}

const mockScheduledMessages: ScheduledMessage[] = [
  {
    id: "1",
    message:
      "Reminder: Your appointment is scheduled for tomorrow at 2 PM. Please arrive 15 minutes early.",
    recipients: 125,
    scheduledTime: "2024-01-15 14:00",
    status: "pending",
    created: "2024-01-14 10:30",
    sender: "+1234567890",
  },
  {
    id: "2",
    message:
      "Flash Sale Alert! 50% off all products today only. Use code FLASH50 at checkout.",
    recipients: 1250,
    scheduledTime: "2024-01-16 09:00",
    status: "pending",
    created: "2024-01-14 15:45",
    sender: "+1234567891",
  },
  {
    id: "3",
    message:
      "Thank you for your purchase! Your order has been processed and will ship within 24 hours.",
    recipients: 87,
    scheduledTime: "2024-01-14 12:00",
    status: "sent",
    created: "2024-01-14 08:30",
    sender: "+1234567892",
  },
  {
    id: "4",
    message: "Weekly newsletter: This week in technology and innovation.",
    recipients: 500,
    scheduledTime: "2024-01-17 10:00",
    status: "paused",
    created: "2024-01-14 16:20",
    sender: "+1234567893",
  },
];

export default function Scheduled() {
  const [messages, setMessages] = useState<ScheduledMessage[]>(
    mockScheduledMessages,
  );
  const [selectedMessage, setSelectedMessage] =
    useState<ScheduledMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "sent":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusToggle = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id
          ? {
              ...msg,
              status: msg.status === "pending" ? "paused" : ("pending" as any),
            }
          : msg,
      ),
    );
  };

  const handleDelete = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
    setDeleteId(null);
  };

  const pendingCount = messages.filter((m) => m.status === "pending").length;
  const pausedCount = messages.filter((m) => m.status === "paused").length;
  const sentCount = messages.filter((m) => m.status === "sent").length;
  const totalRecipients = messages.reduce((sum, m) => sum + m.recipients, 0);

  return (
    <DashboardLayout title="Scheduled Messages">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Scheduled Messages</h1>
            <p className="text-gray-600">Manage your scheduled SMS campaigns</p>
          </div>
          <Button>
            <Calendar className="w-4 h-4 mr-2" />
            Schedule New Message
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-xl font-bold">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Pause className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Paused</p>
                  <p className="text-xl font-bold">{pausedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sent</p>
                  <p className="text-xl font-bold">{sentCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Recipients</p>
                  <p className="text-xl font-bold">
                    {totalRecipients.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Scheduled Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getStatusColor(message.status)}>
                          {message.status.charAt(0).toUpperCase() +
                            message.status.slice(1)}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          From: {message.sender}
                        </span>
                        <span className="text-sm text-gray-600">
                          Recipients: {message.recipients}
                        </span>
                      </div>
                      <p className="text-gray-800 mb-2 line-clamp-2">
                        {message.message}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>
                          Scheduled:{" "}
                          {new Date(message.scheduledTime).toLocaleString()}
                        </span>
                        <span>
                          Created: {new Date(message.created).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedMessage(message)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      {message.status !== "sent" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusToggle(message.id)}
                          >
                            {message.status === "pending" ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>

                          <Button variant="outline" size="sm">
                            <Edit3 className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteId(message.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog
          open={!!selectedMessage}
          onOpenChange={() => setSelectedMessage(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Message Details</DialogTitle>
              <DialogDescription>
                Scheduled message information and content
              </DialogDescription>
            </DialogHeader>

            {selectedMessage && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Status
                    </label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(selectedMessage.status)}>
                        {selectedMessage.status.charAt(0).toUpperCase() +
                          selectedMessage.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Recipients
                    </label>
                    <p className="mt-1 text-lg font-semibold">
                      {selectedMessage.recipients}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Sender Number
                    </label>
                    <p className="mt-1">{selectedMessage.sender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Scheduled Time
                    </label>
                    <p className="mt-1">
                      {new Date(selectedMessage.scheduledTime).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Message Content
                  </label>
                  <div className="mt-1 p-3 border rounded-lg bg-gray-50">
                    <p className="whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Created
                  </label>
                  <p className="mt-1">
                    {new Date(selectedMessage.created).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Scheduled Message?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The scheduled message will be
                permanently deleted.
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
