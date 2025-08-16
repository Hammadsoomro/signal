import { Request, Response } from "express";
import SubAccount from "../models/SubAccount";
import User from "../models/User";
import { AuthRequest } from "./auth";

// Get user's sub-accounts
export const getUserSubAccounts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const subAccounts = await SubAccount.find({
      userId,
      status: { $ne: "deleted" },
    })
      .populate("assignedNumbers", "number")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: subAccounts,
    });
  } catch (error) {
    console.error("Get sub-accounts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve sub-accounts",
    });
  }
};

// Create a new sub-account
export const createSubAccount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { name, email, walletBalance = 0, assignedNumber } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    // Check if email already exists
    const existingSubAccount = await SubAccount.findOne({
      email: email.toLowerCase(),
    });
    if (existingSubAccount) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use",
      });
    }

    // Check sub-account limit (max 3 per user)
    const subAccountCount = await SubAccount.countDocuments({
      userId,
      status: { $ne: "deleted" },
    });
    if (subAccountCount >= 3) {
      return res.status(400).json({
        success: false,
        message: "Maximum 3 sub-accounts allowed per user",
      });
    }

    // Check if user has sufficient balance for transfer
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (walletBalance > 0 && user.walletBalance < walletBalance) {
      return res.status(400).json({
        success: false,
        message: "Insufficient wallet balance for transfer",
      });
    }

    // Create new sub-account
    const newSubAccount = new SubAccount({
      userId,
      name,
      email: email.toLowerCase(),
      walletBalance: walletBalance || 0,
      assignedNumbers: [],
      permissions: {
        canSendSMS: true,
        canBuyNumbers: false, // Sub-accounts cannot buy numbers
        canManageWallet: false, // Sub-accounts cannot manage wallet
        canViewAnalytics: true,
      },
      status: "active",
    });

    await newSubAccount.save();

    // Deduct transferred amount from user's wallet if any
    if (walletBalance > 0) {
      user.walletBalance -= walletBalance;
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: "Sub-account created successfully",
      data: newSubAccount,
    });
  } catch (error) {
    console.error("Create sub-account error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create sub-account",
    });
  }
};

// Update sub-account
export const updateSubAccount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { subAccountId } = req.params;
    const { name, email, status } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const subAccount = await SubAccount.findOne({
      _id: subAccountId,
      userId,
    });

    if (!subAccount) {
      return res.status(404).json({
        success: false,
        message: "Sub-account not found",
      });
    }

    // Update fields
    if (name) subAccount.name = name;
    if (email) subAccount.email = email.toLowerCase();
    if (status) subAccount.status = status;

    await subAccount.save();

    res.status(200).json({
      success: true,
      message: "Sub-account updated successfully",
      data: subAccount,
    });
  } catch (error) {
    console.error("Update sub-account error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update sub-account",
    });
  }
};

// Delete sub-account
export const deleteSubAccount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { subAccountId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const subAccount = await SubAccount.findOne({
      _id: subAccountId,
      userId,
    });

    if (!subAccount) {
      return res.status(404).json({
        success: false,
        message: "Sub-account not found",
      });
    }

    // Mark as deleted instead of hard delete to preserve data integrity
    subAccount.status = "deleted";
    await subAccount.save();

    res.status(200).json({
      success: true,
      message: "Sub-account deleted successfully",
    });
  } catch (error) {
    console.error("Delete sub-account error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete sub-account",
    });
  }
};

// Transfer funds to sub-account
export const transferFunds = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { subAccountId, amount } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid transfer amount",
      });
    }

    const user = await User.findById(userId);
    if (!user || user.walletBalance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient wallet balance",
      });
    }

    const subAccount = await SubAccount.findOne({
      _id: subAccountId,
      userId,
      status: "active",
    });

    if (!subAccount) {
      return res.status(404).json({
        success: false,
        message: "Sub-account not found",
      });
    }

    // Transfer funds
    user.walletBalance -= amount;
    subAccount.walletBalance += amount;

    await user.save();
    await subAccount.save();

    res.status(200).json({
      success: true,
      message: "Funds transferred successfully",
      data: {
        userBalance: user.walletBalance,
        subAccountBalance: subAccount.walletBalance,
      },
    });
  } catch (error) {
    console.error("Transfer funds error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to transfer funds",
    });
  }
};
