import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Message {
  _id: string;
  conversationId: string;
  senderId?: string;
  senderNumber: string;
  recipientNumber: string;
  content: string;
  messageType: "sms" | "mms";
  status: "sending" | "sent" | "delivered" | "failed" | "received";
  direction: "inbound" | "outbound";
  cost?: number;
  externalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  userId: string;
  contactNumber: string;
  contactName?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isPinned: boolean;
  isStarred: boolean;
  isArchived: boolean;
  messageCount: number;
  messages?: Message[]; // Loaded separately
  createdAt: string;
  updatedAt: string;
}

interface ConversationsContextType {
  conversations: Conversation[];
  isLoading: boolean;
  loadConversations: () => Promise<void>;
  loadConversationMessages: (conversationId: string) => Promise<Message[]>;
  createOrGetConversation: (contactNumber: string, contactName?: string) => Promise<Conversation | null>;
  sendMessage: (conversationId: string, fromNumber: string, toNumber: string, message: string) => Promise<boolean>;
  updateConversation: (conversationId: string, updates: {
    isPinned?: boolean;
    isStarred?: boolean;
    isArchived?: boolean;
    contactName?: string;
  }) => Promise<boolean>;
  deleteConversation: (conversationId: string) => Promise<boolean>;
  getConversationById: (conversationId: string) => Conversation | undefined;
}

const ConversationsContext = createContext<ConversationsContextType | undefined>(
  undefined,
);

export const ConversationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load user's conversations from database
  const loadConversations = async () => {
    if (!user) {
      setConversations([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('connectlify_token');
      if (!token) {
        console.log('No auth token found, user not authenticated');
        setConversations([]);
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setConversations(data.data);
          console.log(`Loaded ${data.data.length} conversations from database`);
        } else {
          console.log('No conversations found for user');
          setConversations([]);
        }
      } else {
        console.error('Failed to fetch conversations:', response.status);
        setConversations([]);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load conversations when user changes
  useEffect(() => {
    loadConversations();
  }, [user]);

  // Load messages for a specific conversation
  const loadConversationMessages = async (conversationId: string): Promise<Message[]> => {
    try {
      const token = localStorage.getItem('connectlify_token');
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.messages) {
          return data.data.messages;
        }
      }
      return [];
    } catch (error) {
      console.error('Failed to load conversation messages:', error);
      return [];
    }
  };

  // Create or get conversation
  const createOrGetConversation = async (contactNumber: string, contactName?: string): Promise<Conversation | null> => {
    try {
      const token = localStorage.getItem('connectlify_token');
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contactNumber, contactName }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Reload conversations to get the updated list
        await loadConversations();
        return result.data;
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create conversation",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      console.error('Failed to create conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive",
      });
      return null;
    }
  };

  // Send message
  const sendMessage = async (conversationId: string, fromNumber: string, toNumber: string, message: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('connectlify_token');
      const response = await fetch('/api/conversations/send-sms', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          conversationId, 
          fromNumber, 
          toNumber, 
          message 
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Reload conversations to update last message
        await loadConversations();
        return true;
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to send message",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      return false;
    }
  };

  // Update conversation
  const updateConversation = async (conversationId: string, updates: {
    isPinned?: boolean;
    isStarred?: boolean;
    isArchived?: boolean;
    contactName?: string;
  }): Promise<boolean> => {
    try {
      const token = localStorage.getItem('connectlify_token');
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update local state
        setConversations(prev => 
          prev.map(conv => 
            conv._id === conversationId 
              ? { ...conv, ...updates }
              : conv
          )
        );
        return true;
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update conversation",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Failed to update conversation:', error);
      toast({
        title: "Error",
        description: "Failed to update conversation",
        variant: "destructive",
      });
      return false;
    }
  };

  // Delete conversation
  const deleteConversation = async (conversationId: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('connectlify_token');
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Remove from local state
        setConversations(prev => prev.filter(conv => conv._id !== conversationId));
        toast({
          title: "Success",
          description: "Conversation deleted successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete conversation",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      });
      return false;
    }
  };

  // Get conversation by ID
  const getConversationById = (conversationId: string): Conversation | undefined => {
    return conversations.find(conv => conv._id === conversationId);
  };

  return (
    <ConversationsContext.Provider
      value={{
        conversations,
        isLoading,
        loadConversations,
        loadConversationMessages,
        createOrGetConversation,
        sendMessage,
        updateConversation,
        deleteConversation,
        getConversationById,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
};

export const useConversations = () => {
  const context = useContext(ConversationsContext);
  if (context === undefined) {
    throw new Error("useConversations must be used within a ConversationsProvider");
  }
  return context;
};
