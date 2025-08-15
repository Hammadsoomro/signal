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
import { useConversations } from "@/contexts/ConversationsContext";
import { useWallet } from "@/contexts/WalletContext";

// Using types from ConversationsContext
import type { Message, Conversation } from "@/contexts/ConversationsContext";

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
  const {
    conversations,
    isLoading: conversationsLoading,
    loadConversationMessages,
    createOrGetConversation,
    sendMessage: sendMessageAPI,
    updateConversation: updateConversationAPI,
    deleteConversation: deleteConversationAPI,
    getConversationById
  } = useConversations();
  const { deductBalance } = useWallet();
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", phone: "" });

  const { purchasedNumbers, getAvailableNumbers } = useUserNumbers();
  const availableNumbers = getAvailableNumbers() || [];

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
    const conversation = getCurrentConversation();
    if (!conversation) return;

    // Deduct balance first
    if (!deductBalance) {
      console.error("Wallet context not available");
      toast({
        title: "Error",
        description: "Wallet service not available. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await deductBalance(smsPrice, `SMS sent to ${conversation.contactNumber}`);
      if (!success) {
        return; // Insufficient balance, error already shown
      }
    } catch (error) {
      console.error("Error deducting balance:", error);
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      // Send message via API
      const success = await sendMessageAPI(
        selectedConversation,
        selectedNumber,
        conversation.contactNumber,
        message.trim()
      );

      if (success) {
        setMessage("");
        // Reload messages for this conversation
        await loadMessages(selectedConversation);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Load messages for selected conversation
  const loadMessages = async (conversationId: string) => {
    if (!conversationId) {
      setCurrentMessages([]);
      return;
    }

    try {
      const messages = await loadConversationMessages(conversationId);
      setCurrentMessages(messages || []);
    } catch (error) {
      console.error("Failed to load messages:", error);
      setCurrentMessages([]);
    }
  };

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    } else {
      setCurrentMessages([]);
    }
  }, [selectedConversation]);

  const selectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    // Messages will be loaded by useEffect
  };

  const handleDeleteConversation = async (conversationId: string) => {
    const success = await deleteConversationAPI(conversationId);
    if (success && selectedConversation === conversationId) {
      setSelectedConversation(null);
      setCurrentMessages([]);
    }
  };

  const togglePin = async (conversationId: string) => {
    const conv = conversations.find((c) => c._id === conversationId);
    if (!conv) return;

    await updateConversationAPI(conversationId, { isPinned: !conv.isPinned });
  };

  const toggleStar = async (conversationId: string) => {
    const conv = conversations.find((c) => c._id === conversationId);
    if (!conv) return;

    await updateConversationAPI(conversationId, { isStarred: !conv.isStarred });
  };

  const archiveConversation = async (conversationId: string) => {
    const conv = conversations.find((c) => c._id === conversationId);
    if (!conv) return;

    await updateConversationAPI(conversationId, { isArchived: !conv.isArchived });
  };

  const getCurrentConversation = () => {
    if (!selectedConversation || !conversations) return null;
    return conversations.find((conv) => conv._id === selectedConversation) || null;
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
    try {
      if (!timestamp) return "";
      return new Date(timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  };

  const formatMessageTime = (timestamp: string) => {
    try {
      if (!timestamp) return "";
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
    } catch (error) {
      console.error("Error formatting message time:", error);
      return "";
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

  const addNewContact = async () => {
    if (!newContact.phone.trim()) {
      toast({
        title: "Error",
        description: "Phone number is required.",
        variant: "destructive",
      });
      return;
    }

    const conversation = await createOrGetConversation(
      newContact.phone.trim(),
      newContact.name.trim() || newContact.phone.trim()
    );

    if (conversation) {
      setNewContact({ name: "", phone: "" });
      setShowAddContact(false);
      // Select the new conversation
      setSelectedConversation(conversation._id);
    }
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
                  <div key={conv._id} className="relative group mb-2">
                    {/* Action buttons above contact */}
                    <div className="flex items-center justify-end gap-1 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(conv._id);
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
                          togglePin(conv._id);
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
                          handleDeleteConversation(conv._id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    <Card
                      className={cn(
                        "p-3 cursor-pointer transition-colors",
                        selectedConversation === conv._id
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-accent/50",
                        conv.isPinned && "border-yellow-200",
                        conv.isStarred && "border-yellow-100",
                      )}
                      onClick={() => selectConversation(conv._id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{(conv.contactName || conv.contactNumber).charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <h3 className="font-medium truncate">
                                {conv.contactName || conv.contactNumber}
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
                            {conv.contactNumber}
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
              style={{ width: "100%", minHeight: "200px" }}
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
                        {getCurrentConversation()?.contactName?.charAt(0) || getCurrentConversation()?.contactNumber?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {getCurrentConversation()?.contactName || getCurrentConversation()?.contactNumber}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {getCurrentConversation()?.contactNumber}
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
                  {currentMessages?.map((msg) => (
                    <div
                      key={msg._id}
                      className={`flex ${msg.direction === 'outbound' ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.direction === 'outbound'
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <div
                          className={`flex items-center justify-between gap-2 mt-1 ${
                            msg.direction === 'outbound'
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          <span className="text-xs">
                            {formatTime(msg.createdAt)}
                          </span>
                          {msg.direction === 'outbound' && getMessageStatus(msg.status)}
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
                      {availableNumbers?.map((num) => (
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
