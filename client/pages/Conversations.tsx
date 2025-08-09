import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DashboardLayout } from '@/components/DashboardLayout';
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
  Pin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sent: boolean;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'failed';
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
  isArchived: boolean;
}

interface UserNumber {
  id: string;
  number: string;
  label: string;
  isActive: boolean;
}

export default function Conversations() {
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [selectedNumber, setSelectedNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      contact: '+1 (555) 987-6543',
      name: 'John Doe',
      lastMessage: 'Hey, how are you?',
      lastMessageTime: '2024-01-20T14:30:00Z',
      unreadCount: 2,
      isPinned: false,
      isArchived: false,
      messages: [
        {
          id: '1',
          text: 'Hello! How can I help you today?',
          sent: false,
          timestamp: '2024-01-20T14:25:00Z',
          status: 'delivered'
        },
        {
          id: '2',
          text: 'Hi, I need some information about your services',
          sent: true,
          timestamp: '2024-01-20T14:26:00Z',
          status: 'delivered'
        },
        {
          id: '3',
          text: 'Of course! What would you like to know?',
          sent: false,
          timestamp: '2024-01-20T14:28:00Z',
          status: 'delivered'
        },
        {
          id: '4',
          text: 'Hey, how are you?',
          sent: true,
          timestamp: '2024-01-20T14:30:00Z',
          status: 'sent'
        }
      ]
    },
    {
      id: '2',
      contact: '+1 (555) 876-5432',
      name: 'Jane Smith',
      lastMessage: 'Thanks for the info!',
      lastMessageTime: '2024-01-20T13:15:00Z',
      unreadCount: 0,
      isPinned: true,
      isArchived: false,
      messages: [
        {
          id: '1',
          text: 'Can you send me the pricing details?',
          sent: true,
          timestamp: '2024-01-20T13:10:00Z',
          status: 'delivered'
        },
        {
          id: '2',
          text: 'Thanks for the info!',
          sent: true,
          timestamp: '2024-01-20T13:15:00Z',
          status: 'delivered'
        }
      ]
    },
    {
      id: '3',
      contact: '+1 (555) 765-4321',
      name: 'Mike Johnson',
      lastMessage: 'Let me know when you\'re free',
      lastMessageTime: '2024-01-20T12:45:00Z',
      unreadCount: 1,
      isPinned: false,
      isArchived: false,
      messages: [
        {
          id: '1',
          text: 'Let me know when you\'re free',
          sent: true,
          timestamp: '2024-01-20T12:45:00Z',
          status: 'delivered'
        }
      ]
    }
  ]);

  const userNumbers: UserNumber[] = [
    { id: '1', number: '+1 (555) 123-4567', label: 'Primary', isActive: true },
    { id: '2', number: '+1 (555) 234-5678', label: 'Business', isActive: true },
    { id: '3', number: '+1 (555) 345-6789', label: 'Support', isActive: true }
  ];

  // Simulate WebSocket connection for real-time messaging
  useEffect(() => {
    const connectToSocket = () => {
      setIsConnected(true);
      
      // Simulate incoming messages
      const messageInterval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance of receiving a message
          const randomConvId = conversations[Math.floor(Math.random() * conversations.length)]?.id;
          if (randomConvId) {
            const newMessage: Message = {
              id: Date.now().toString(),
              text: `Auto message at ${new Date().toLocaleTimeString()}`,
              sent: false,
              timestamp: new Date().toISOString(),
              status: 'delivered'
            };
            
            setConversations(prev => prev.map(conv => {
              if (conv.id === randomConvId) {
                return {
                  ...conv,
                  messages: [...conv.messages, newMessage],
                  lastMessage: newMessage.text,
                  lastMessageTime: newMessage.timestamp,
                  unreadCount: conv.id === selectedConversation ? 0 : conv.unreadCount + 1
                };
              }
              return conv;
            }));

            // Show notification if not current conversation
            if (randomConvId !== selectedConversation) {
              toast({
                title: "New Message",
                description: `New message from ${conversations.find(c => c.id === randomConvId)?.name}`,
              });
            }
          }
        }
      }, 15000); // Check every 15 seconds

      return () => clearInterval(messageInterval);
    };

    const cleanup = connectToSocket();
    return cleanup;
  }, [selectedConversation, conversations]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, selectedConversation]);

  const sendMessage = async () => {
    if (!message.trim() || !selectedNumber || !selectedConversation || isSending) return;

    // Check wallet balance (SMS costs $0.01 per message)
    const smsPrice = 0.01;
    const deductBalance = (window as any).deductWalletBalance;
    
    if (deductBalance && !deductBalance(smsPrice, `SMS sent to ${getCurrentConversation()?.contact}`)) {
      return; // Insufficient balance, error already shown
    }

    setIsSending(true);
    const tempId = Date.now().toString();
    const newMessage: Message = {
      id: tempId,
      text: message.trim(),
      sent: true,
      timestamp: new Date().toISOString(),
      status: 'sending'
    };

    // Add message to conversation immediately
    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversation) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: newMessage.text,
          lastMessageTime: newMessage.timestamp
        };
      }
      return conv;
    }));

    setMessage('');

    try {
      // Simulate SMS sending API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update message status to sent
      setConversations(prev => prev.map(conv => {
        if (conv.id === selectedConversation) {
          return {
            ...conv,
            messages: conv.messages.map(msg => 
              msg.id === tempId ? { ...msg, status: 'sent' } : msg
            )
          };
        }
        return conv;
      }));

      // Simulate delivery status after a delay
      setTimeout(() => {
        setConversations(prev => prev.map(conv => {
          if (conv.id === selectedConversation) {
            return {
              ...conv,
              messages: conv.messages.map(msg => 
                msg.id === tempId ? { ...msg, status: 'delivered' } : msg
              )
            };
          }
          return conv;
        }));
      }, 3000);

      toast({
        title: "Message Sent",
        description: `SMS sent successfully to ${getCurrentConversation()?.contact}`,
      });

    } catch (error) {
      // Update message status to failed
      setConversations(prev => prev.map(conv => {
        if (conv.id === selectedConversation) {
          return {
            ...conv,
            messages: conv.messages.map(msg => 
              msg.id === tempId ? { ...msg, status: 'failed' } : msg
            )
          };
        }
        return conv;
      }));

      toast({
        title: "Message Failed",
        description: "Failed to send SMS. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const selectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    
    // Mark messages as read
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (selectedConversation === conversationId) {
      setSelectedConversation(null);
    }
    toast({
      title: "Conversation Deleted",
      description: "The conversation has been permanently deleted.",
    });
  };

  const togglePin = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, isPinned: !conv.isPinned } : conv
    ));
  };

  const archiveConversation = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, isArchived: !conv.isArchived } : conv
    ));
  };

  const getCurrentConversation = () => {
    return conversations.find(conv => conv.id === selectedConversation);
  };

  const getMessageStatus = (status: string) => {
    switch (status) {
      case 'sending':
        return <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />;
      case 'sent':
        return <CheckCircle className="h-3 w-3 text-muted-foreground" />;
      case 'delivered':
        return <CheckCircle className="h-3 w-3 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const activeConversations = conversations.filter(conv => !conv.isArchived);
  const sortedConversations = activeConversations.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
  });

  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

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
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isConnected ? "bg-green-500" : "bg-red-500"
                )} />
                <Button size="sm" variant="ghost">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* SMS Sending Number Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Send from:</label>
              <Select value={selectedNumber} onValueChange={setSelectedNumber}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sending number" />
                </SelectTrigger>
                <SelectContent>
                  {userNumbers.filter(num => num.isActive).map((num) => (
                    <SelectItem key={num.id} value={num.number}>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{num.number}</span>
                        <Badge variant="secondary" className="text-xs">{num.label}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2">
              {sortedConversations.map((conv) => (
                <Card 
                  key={conv.id} 
                  className={cn(
                    "p-3 mb-2 cursor-pointer transition-colors",
                    selectedConversation === conv.id 
                      ? "bg-primary/10 border-primary" 
                      : "hover:bg-accent/50",
                    conv.isPinned && "border-yellow-200"
                  )}
                  onClick={() => selectConversation(conv.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium truncate">{conv.name}</h3>
                          {conv.isPinned && <Pin className="h-3 w-3 text-yellow-500" />}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatMessageTime(conv.lastMessageTime)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                        {conv.unreadCount > 0 && (
                          <Badge variant="default" className="text-xs">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{conv.contact}</p>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Conversation Options</DialogTitle>
                          <DialogDescription>
                            Manage this conversation with {conv.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => togglePin(conv.id)}
                            className="justify-start"
                          >
                            <Pin className="mr-2 h-4 w-4" />
                            {conv.isPinned ? 'Unpin' : 'Pin'} Conversation
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => archiveConversation(conv.id)}
                            className="justify-start"
                          >
                            <Archive className="mr-2 h-4 w-4" />
                            Archive Conversation
                          </Button>
                          <Button 
                            variant="destructive" 
                            onClick={() => deleteConversation(conv.id)}
                            className="justify-start"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Conversation
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
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
                      <h3 className="font-medium">{getCurrentConversation()?.name}</h3>
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
                      className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.sent
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <div className={`flex items-center justify-between gap-2 mt-1 ${
                          msg.sent ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          <span className="text-xs">{formatTime(msg.timestamp)}</span>
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
                {!selectedNumber && (
                  <Alert className="mb-3">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Please select a sending number from the dropdown above to send messages.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                    disabled={!selectedNumber || isSending}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
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
                <h3 className="text-lg font-medium mb-2">Select a Conversation</h3>
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
