import { Request, Response } from "express";
import { Conversation, Message } from "../models/Conversation";
import User from "../models/User";
import { AuthRequest } from "./auth";

// Get user's conversations
export const getUserConversations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const conversations = await Conversation.find({ 
      userId,
      isArchived: false
    }).sort({ isPinned: -1, lastMessageTime: -1 });

    res.status(200).json({
      success: true,
      data: conversations
    });

  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve conversations"
    });
  }
};

// Get conversation messages
export const getConversationMessages = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    // Verify conversation belongs to user
    const conversation = await Conversation.findOne({ 
      _id: conversationId, 
      userId 
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    const pageNumber = Math.max(1, parseInt(page as string));
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit as string)));
    const skip = (pageNumber - 1) * limitNumber;

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    // Mark messages as read
    await Conversation.findByIdAndUpdate(conversationId, { unreadCount: 0 });

    res.status(200).json({
      success: true,
      data: {
        messages: messages.reverse(), // Return in chronological order
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          hasMore: messages.length === limitNumber
        }
      }
    });

  } catch (error) {
    console.error("Get conversation messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve messages"
    });
  }
};

// Create or get conversation
export const createOrGetConversation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { contactNumber, contactName } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    if (!contactNumber) {
      return res.status(400).json({
        success: false,
        message: "Contact number is required"
      });
    }

    // Clean and format phone number
    const cleanNumber = contactNumber.replace(/\D/g, '');
    const formattedNumber = cleanNumber.startsWith('1') ? `+${cleanNumber}` : `+1${cleanNumber}`;

    // Try to find existing conversation
    let conversation = await Conversation.findOne({
      userId,
      contactNumber: formattedNumber
    });

    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        userId,
        contactNumber: formattedNumber,
        contactName: contactName || formattedNumber,
        lastMessage: "No messages yet",
        lastMessageTime: new Date(),
        unreadCount: 0,
        isPinned: false,
        isStarred: false,
        isArchived: false,
        messageCount: 0
      });

      await conversation.save();
    } else if (contactName && contactName !== conversation.contactName) {
      // Update contact name if provided
      conversation.contactName = contactName;
      await conversation.save();
    }

    res.status(200).json({
      success: true,
      data: conversation
    });

  } catch (error) {
    console.error("Create conversation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create conversation"
    });
  }
};

// Send SMS message
export const sendSMSMessage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { conversationId, fromNumber, toNumber, message: messageText } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    if (!conversationId || !fromNumber || !toNumber || !messageText) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Verify conversation belongs to user
    const conversation = await Conversation.findOne({ 
      _id: conversationId, 
      userId 
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    // Create message record first
    const newMessage = new Message({
      conversationId,
      senderId: userId,
      senderNumber: fromNumber,
      recipientNumber: toNumber,
      content: messageText,
      messageType: "sms",
      status: "sending",
      direction: "outbound",
      cost: 0.01
    });

    await newMessage.save();

    // Update conversation
    conversation.lastMessage = messageText;
    conversation.lastMessageTime = new Date();
    conversation.messageCount += 1;
    await conversation.save();

    // TODO: Here you would integrate with SignalWire to actually send the SMS
    // For now, we'll just mark it as sent
    newMessage.status = "sent";
    await newMessage.save();

    res.status(200).json({
      success: true,
      data: newMessage
    });

  } catch (error) {
    console.error("Send SMS error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message"
    });
  }
};

// Update conversation (pin, star, archive)
export const updateConversation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { conversationId } = req.params;
    const { isPinned, isStarred, isArchived, contactName } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const conversation = await Conversation.findOne({ 
      _id: conversationId, 
      userId 
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    // Update fields
    if (typeof isPinned === 'boolean') conversation.isPinned = isPinned;
    if (typeof isStarred === 'boolean') conversation.isStarred = isStarred;
    if (typeof isArchived === 'boolean') conversation.isArchived = isArchived;
    if (contactName) conversation.contactName = contactName;

    await conversation.save();

    res.status(200).json({
      success: true,
      data: conversation
    });

  } catch (error) {
    console.error("Update conversation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update conversation"
    });
  }
};

// Delete conversation
export const deleteConversation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { conversationId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const conversation = await Conversation.findOne({ 
      _id: conversationId, 
      userId 
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    // Delete all messages in the conversation
    await Message.deleteMany({ conversationId });

    // Delete the conversation
    await Conversation.findByIdAndDelete(conversationId);

    res.status(200).json({
      success: true,
      message: "Conversation deleted successfully"
    });

  } catch (error) {
    console.error("Delete conversation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete conversation"
    });
  }
};

// Receive SMS webhook (for incoming messages)
export const receiveSMSMessage = async (req: Request, res: Response) => {
  try {
    const { From, To, Body, MessageSid } = req.body;

    if (!From || !To || !Body) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    // Find user who owns the receiving number
    const PhoneNumber = require("../models/PhoneNumber").default;
    const phoneNumber = await PhoneNumber.findOne({ 
      number: To,
      isActive: true 
    });

    if (!phoneNumber) {
      console.log(`No active phone number found for ${To}`);
      return res.status(404).json({
        success: false,
        message: "Phone number not found"
      });
    }

    const userId = phoneNumber.userId;

    // Find or create conversation
    let conversation = await Conversation.findOne({
      userId,
      contactNumber: From
    });

    if (!conversation) {
      conversation = new Conversation({
        userId,
        contactNumber: From,
        contactName: From,
        lastMessage: Body,
        lastMessageTime: new Date(),
        unreadCount: 1,
        isPinned: false,
        isStarred: false,
        isArchived: false,
        messageCount: 1
      });
    } else {
      conversation.lastMessage = Body;
      conversation.lastMessageTime = new Date();
      conversation.unreadCount += 1;
      conversation.messageCount += 1;
    }

    await conversation.save();

    // Create message record
    const newMessage = new Message({
      conversationId: conversation._id,
      senderId: null, // Incoming message
      senderNumber: From,
      recipientNumber: To,
      content: Body,
      messageType: "sms",
      status: "received",
      direction: "inbound",
      cost: 0,
      externalId: MessageSid
    });

    await newMessage.save();

    res.status(200).json({
      success: true,
      message: "SMS received and processed"
    });

  } catch (error) {
    console.error("Receive SMS error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process incoming SMS"
    });
  }
};
