import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AdSense, AdSenseConfigs } from "@/components/AdSense";
import {
  Send,
  Phone,
  MessageSquare,
  Bell,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  MoreHorizontal,
  Archive,
  Pin,
  Star,
  PinIcon,
  UserPlus,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { signalWireClient } from "@/lib/signalwire";
import { useUserNumbers } from "@/contexts/UserNumbersContext";

interface Message {
  id: string;
  text: string;
  sent: boolean;
  timestamp: string;
  status: "sending" | "sent" | "delivered" | "failed";
}

interface Conversation {
  id: string;
  contact: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
  isPinned: boolean;
  isStarred: boolean;
  isArchived: boolean;
}

export default function Conversations() {
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [selectedNumber, setSelectedNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", phone: "" });

  const { purchasedNumbers, getAvailableNumbers } = useUserNumbers();
  const availableNumbers = getAvailableNumbers();

  // Test SMS service connection
  const testSMSService = async () => {
    try {
      const result = await signalWireClient.testConnection();
      toast({
        title: "SMS Service Connection Test",
        description: `✅ Connected to SMS provider. Found ${result.ownedNumbers.length} owned numbers.`,
      });
      console.log("SMS service test result:", result);
    } catch (error) {
      toast({
        title: "SMS Service Connection Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to connect to SMS service",
        variant: "destructive",
      });
    }
  };

  // Request notification permission on mount
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Simulate WebSocket connection for real-time messaging
  useEffect(() => {
    const connectToSocket = () => {
      setIsConnected(true);
      // Removed automatic message generation to fix auto message issue
    };

    connectToSocket();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, selectedConversation]);

  const sendMessage = async () => {
    if (
      !message.trim() ||
      !selectedNumber ||
      !selectedConversation ||
      isSending
    )
      return;

    // Check wallet balance (SMS costs $0.01 per message)
    const smsPrice = 0.01;
    const deductBalance = (window as any).deductWalletBalance;

    if (
      deductBalance &&
      !deductBalance(
        smsPrice,
        `SMS sent to ${getCurrentConversation()?.contact}`,
      )
    ) {
      return; // Insufficient balance, error already shown
    }

    setIsSending(true);
    const tempId = Date.now().toString();
    const newMessage: Message = {
      id: tempId,
      text: message.trim(),
      sent: true,
      timestamp: new Date().toISOString(),
      status: "sending",
    };

    // Add message to conversation immediately
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === selectedConversation) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: newMessage.text,
            lastMessageTime: newMessage.timestamp,
          };
        }
        return conv;
      }),
    );

    setMessage("");

    try {
      // Use real SignalWire API to send SMS
      const response = await signalWireClient.sendSMS(
        selectedNumber,
        getCurrentConversation()?.contact || "",
        message.trim(),
      );

      // Update message status to sent
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === selectedConversation) {
            return {
              ...conv,
              messages: conv.messages.map((msg) =>
                msg.id === tempId ? { ...msg, status: "sent" } : msg,
              ),
            };
          }
          return conv;
        }),
      );

      // Update delivery status based on SignalWire response
      setTimeout(() => {
        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id === selectedConversation) {
              return {
                ...conv,
                messages: conv.messages.map((msg) =>
                  msg.id === tempId
                    ? {
                        ...msg,
                        status:
                          response.status === "queued" ||
                          response.status === "sent"
                            ? "delivered"
                            : "failed",
                      }
                    : msg,
                ),
              };
            }
            return conv;
          }),
        );
      }, 2000);

      toast({
        title: "Message Sent via SignalWire",
        description: `SMS sent successfully to ${getCurrentConversation()?.contact} (ID: ${response.sid})`,
      });
    } catch (error) {
      // Update message status to failed
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === selectedConversation) {
            return {
              ...conv,
              messages: conv.messages.map((msg) =>
                msg.id === tempId ? { ...msg, status: "failed" } : msg,
              ),
            };
          }
          return conv;
        }),
      );

      console.error("SMS send error details:", error);

      // Show detailed error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send SMS. Please try again.";

      toast({
        title: "Message Failed",
        description: errorMessage.includes("HTTP error! status: 422")
          ? "Invalid phone number format or number not verified in SignalWire account. Please check your sending number."
          : errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const selectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);

    // Mark messages as read
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv,
      ),
    );
  };

  const deleteConversation = (conversationId: string) => {
    setConversations((prev) =>
      prev.filter((conv) => conv.id !== conversationId),
    );
    if (selectedConversation === conversationId) {
      setSelectedConversation(null);
    }
    toast({
      title: "Conversation Deleted",
      description: "The conversation has been permanently deleted.",
    });
  };

  const togglePin = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? { ...conv, isPinned: !conv.isPinned }
          : conv,
      ),
    );

    const conv = conversations.find((c) => c.id === conversationId);
    toast({
      title: conv?.isPinned ? "Conversation Unpinned" : "Conversation Pinned",
      description: `${conv?.name} has been ${conv?.isPinned ? "unpinned" : "pinned to top"}`,
    });
  };

  const toggleStar = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? { ...conv, isStarred: !conv.isStarred }
          : conv,
      ),
    );

    const conv = conversations.find((c) => c.id === conversationId);
    toast({
      title: conv?.isStarred ? "Removed from Starred" : "Added to Starred",
      description: `${conv?.name} has been ${conv?.isStarred ? "removed from starred" : "starred"}`,
    });
  };

  const archiveConversation = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? { ...conv, isArchived: !conv.isArchived }
          : conv,
      ),
    );
  };

  const getCurrentConversation = () => {
    return conversations.find((conv) => conv.id === selectedConversation);
  };

  const getMessageStatus = (status: string) => {
    switch (status) {
      case "sending":
        return (
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        );
      case "sent":
        return <CheckCircle className="h-3 w-3 text-muted-foreground" />;
      case "delivered":
        return <CheckCircle className="h-3 w-3 text-blue-500" />;
      case "failed":
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const activeConversations = conversations.filter((conv) => !conv.isArchived);
  const sortedConversations = activeConversations.sort((a, b) => {
    // Pinned conversations first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    // Starred conversations next
    if (a.isStarred && !b.isStarred) return -1;
    if (!a.isStarred && b.isStarred) return 1;

    // Then sort by latest message time
    return (
      new Date(b.lastMessageTime).getTime() -
      new Date(a.lastMessageTime).getTime()
    );
  });

  const totalUnreadCount = conversations.reduce(
    (sum, conv) => sum + conv.unreadCount,
    0,
  );

  const addNewContact = () => {
    if (!newContact.phone.trim()) {
      toast({
        title: "Error",
        description: "Phone number is required.",
        variant: "destructive",
      });
      return;
    }

    const newConversation: Conversation = {
      id: Date.now().toString(),
      contact: newContact.phone.trim(),
      name: newContact.name.trim() || newContact.phone.trim(),
      lastMessage: "No messages yet",
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      messages: [],
      isPinned: false,
      isStarred: false,
      isArchived: false,
    };

    setConversations((prev) => [newConversation, ...prev]);
    setNewContact({ name: "", phone: "" });
    setShowAddContact(false);

    toast({
      title: "Contact Added",
      description: `${newConversation.name} has been added to your conversations.`,
    });
  };

  return (
    <DashboardLayout title="Conversations">
      <div className="h-full flex bg-background">
        {/* Contacts Sidebar */}
        <div className="w-80 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Conversations
                {totalUnreadCount > 0 && (
                  <Badge variant="default" className="ml-2">
                    {totalUnreadCount}
                  </Badge>
                )}
              </h2>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isConnected ? "bg-green-500" : "bg-red-500",
                  )}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAddContact(true)}
                  title="Add New Contact"
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add Contact Dialog */}
            {showAddContact && (
              <div className="mb-4 p-4 border border-border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Add New Contact
                  </h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowAddContact(false);
                      setNewContact({ name: "", phone: "" });
                    }}
                  >
                    ✕
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <Input
                      placeholder="Name (optional)"
                      value={newContact.name}
                      onChange={(e) =>
                        setNewContact((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Phone number (required)"
                      value={newContact.phone}
                      onChange={(e) =>
                        setNewContact((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={addNewContact}
                      size="sm"
                      className="flex-1"
                    >
                      Add Contact
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAddContact(false);
                        setNewContact({ name: "", phone: "" });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              {sortedConversations.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground mb-4">
                    No conversations yet
                  </p>
                  <Button
                    onClick={() => setShowAddContact(true)}
                    variant="outline"
                    size="sm"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Your First Contact
                  </Button>
                </div>
              ) : (
                sortedConversations.map((conv) => (
                  <div key={conv.id} className="relative group mb-2">
                    {/* Action buttons above contact */}
                    <div className="flex items-center justify-end gap-1 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(conv.id);
                        }}
                      >
                        <Star
                          className={cn(
                            "h-3 w-3",
                            conv.isStarred
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-400",
                          )}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(conv.id);
                        }}
                      >
                        <PinIcon
                          className={cn(
                            "h-3 w-3",
                            conv.isPinned ? "text-yellow-500" : "text-gray-400",
                          )}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conv.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    <Card
                      className={cn(
                        "p-3 cursor-pointer transition-colors",
                        selectedConversation === conv.id
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-accent/50",
                        conv.isPinned && "border-yellow-200",
                        conv.isStarred && "border-yellow-100",
                      )}
                      onClick={() => selectConversation(conv.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <h3 className="font-medium truncate">
                                {conv.name}
                              </h3>
                              {conv.isPinned && (
                                <PinIcon className="h-3 w-3 text-yellow-500" />
                              )}
                              {conv.isStarred && (
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatMessageTime(conv.lastMessageTime)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.lastMessage}
                            </p>
                            {conv.unreadCount > 0 && (
                              <Badge variant="default" className="text-xs">
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {conv.contact}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Advertisement */}
          <div className="p-3 border-t">
            <AdSense
              adSlot={AdSenseConfigs.sidebar.adSlot}
              adFormat="rectangle"
              style={{ width: '100%', minHeight: '200px' }}
              className="w-full"
            />
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {getCurrentConversation()?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {getCurrentConversation()?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {getCurrentConversation()?.contact}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={isConnected ? "default" : "destructive"}>
                      {isConnected ? "Connected" : "Disconnected"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteConversation(selectedConversation)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {getCurrentConversation()?.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.sent
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <div
                          className={`flex items-center justify-between gap-2 mt-1 ${
                            msg.sent
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          <span className="text-xs">
                            {formatTime(msg.timestamp)}
                          </span>
                          {msg.sent && getMessageStatus(msg.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                {/* SMS Sending Number Selection */}
                <div className="mb-3">
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Send from:
                  </label>
                  <Select
                    value={selectedNumber}
                    onValueChange={setSelectedNumber}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select sending number" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableNumbers.map((num) => (
                        <SelectItem key={num.id} value={num.number}>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{num.number}</span>
                            <Badge variant="secondary" className="text-xs">
                              {num.label}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {availableNumbers.length === 0 ? (
                  <Alert className="mb-3">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No purchased numbers available. Please buy a phone number
                      first to send messages.
                    </AlertDescription>
                  </Alert>
                ) : (
                  !selectedNumber && (
                    <Alert className="mb-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Please select a sending number from the dropdown above
                        to send messages.
                      </AlertDescription>
                    </Alert>
                  )
                )}

                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                    disabled={!selectedNumber || isSending}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!message.trim() || !selectedNumber || isSending}
                  >
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>SMS cost: $0.01 per message</span>
                  {selectedNumber && (
                    <span>Sending from: {selectedNumber}</span>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* No Conversation Selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Select a Conversation
                </h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the left to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
