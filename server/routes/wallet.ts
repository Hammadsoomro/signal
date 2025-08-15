import { Request, Response } from "express";
import Transaction, { ITransaction } from "../models/Transaction";
import User from "../models/User";
import { AuthRequest } from "./auth";

// Get user's wallet balance
export const getWalletBalance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        balance: user.walletBalance || 0
      }
    });

  } catch (error) {
    console.error("Get wallet balance error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve wallet balance"
    });
  }
};

// Get user's transaction history
export const getTransactionHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { page = 1, limit = 20 } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const pageNumber = Math.max(1, parseInt(page as string));
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit as string)));
    const skip = (pageNumber - 1) * limitNumber;

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const totalTransactions = await Transaction.countDocuments({ userId });

    res.status(200).json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total: totalTransactions,
          pages: Math.ceil(totalTransactions / limitNumber)
        }
      }
    });

  } catch (error) {
    console.error("Get transaction history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve transaction history"
    });
  }
};

// Create a new transaction (debit)
export const debitWallet = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { amount, description, relatedTo } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    if (!amount || amount <= 0 || !description) {
      return res.status(400).json({
        success: false,
        message: "Amount and description are required"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.walletBalance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient wallet balance"
      });
    }

    // Create transaction record
    const transaction = new Transaction({
      userId,
      type: "debit",
      amount,
      description,
      status: "completed",
      relatedTo: relatedTo || undefined
    });

    await transaction.save();

    // Update user's wallet balance
    user.walletBalance -= amount;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        transaction,
        newBalance: user.walletBalance
      }
    });

  } catch (error) {
    console.error("Debit wallet error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to debit wallet"
    });
  }
};

// Add funds to wallet (credit)
export const creditWallet = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { amount, description, reference, relatedTo } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    if (!amount || amount <= 0 || !description) {
      return res.status(400).json({
        success: false,
        message: "Amount and description are required"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Create transaction record
    const transaction = new Transaction({
      userId,
      type: "credit",
      amount,
      description,
      reference,
      status: "completed",
      relatedTo: relatedTo || undefined
    });

    await transaction.save();

    // Update user's wallet balance
    user.walletBalance += amount;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        transaction,
        newBalance: user.walletBalance
      }
    });

  } catch (error) {
    console.error("Credit wallet error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to credit wallet"
    });
  }
};
