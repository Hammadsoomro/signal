import { Request, Response } from "express";
import PhoneNumber, { IPhoneNumber } from "../models/PhoneNumber";
import SubAccount from "../models/SubAccount";
import { AuthRequest } from "./auth";

// Get user's purchased phone numbers
export const getUserPhoneNumbers = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const phoneNumbers = await PhoneNumber.find({
      userId,
      isActive: true,
    }).sort({ purchaseDate: -1 });

    res.status(200).json({
      success: true,
      data: phoneNumbers,
    });
  } catch (error) {
    console.error("Get phone numbers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve phone numbers",
    });
  }
};

// Purchase a new phone number
export const purchasePhoneNumber = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { number, label, city, state, country, monthlyPrice, capabilities } =
      req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Validation
    if (!number || !label || !city || !state || !country || !monthlyPrice) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if number already exists
    const existingNumber = await PhoneNumber.findOne({ number });
    if (existingNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number already purchased",
      });
    }

    // Create new phone number record
    const newPhoneNumber = new PhoneNumber({
      userId,
      number,
      label,
      city,
      state,
      country,
      monthlyPrice,
      capabilities: capabilities || ["SMS", "Voice"],
      isActive: true,
      purchaseDate: new Date(),
      assignedTo: null,
    });

    await newPhoneNumber.save();

    res.status(201).json({
      success: true,
      message: "Phone number purchased successfully",
      data: newPhoneNumber,
    });
  } catch (error) {
    console.error("Purchase phone number error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to purchase phone number",
    });
  }
};

// Assign phone number to sub-account
export const assignPhoneNumber = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { phoneNumberId, subAccountId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Find phone number owned by user
    const phoneNumber = await PhoneNumber.findOne({
      _id: phoneNumberId,
      userId,
      isActive: true,
    });

    if (!phoneNumber) {
      return res.status(404).json({
        success: false,
        message: "Phone number not found or not owned by user",
      });
    }

    // Update assignment
    const oldAssignedTo = phoneNumber.assignedTo;
    phoneNumber.assignedTo = subAccountId || null;
    await phoneNumber.save();

    // Update SubAccount's assignedNumbers array
    if (oldAssignedTo) {
      // Remove from old sub-account
      await SubAccount.updateOne(
        { _id: oldAssignedTo },
        { $pull: { assignedNumbers: phoneNumberId } },
      );
    }

    if (subAccountId) {
      // Add to new sub-account
      await SubAccount.updateOne(
        { _id: subAccountId },
        { $addToSet: { assignedNumbers: phoneNumberId } },
      );
    }

    res.status(200).json({
      success: true,
      message: subAccountId
        ? "Phone number assigned to sub-account"
        : "Phone number unassigned",
      data: phoneNumber,
    });
  } catch (error) {
    console.error("Assign phone number error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to assign phone number",
    });
  }
};

// Get available numbers for user (not assigned to any sub-account)
export const getAvailableNumbers = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const availableNumbers = await PhoneNumber.find({
      userId,
      isActive: true,
      assignedTo: null,
    }).sort({ purchaseDate: -1 });

    res.status(200).json({
      success: true,
      data: availableNumbers,
    });
  } catch (error) {
    console.error("Get available numbers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve available numbers",
    });
  }
};

// Get numbers assigned to a specific sub-account
export const getAssignedNumbers = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { subAccountId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const assignedNumbers = await PhoneNumber.find({
      userId,
      isActive: true,
      assignedTo: subAccountId,
    }).sort({ purchaseDate: -1 });

    res.status(200).json({
      success: true,
      data: assignedNumbers,
    });
  } catch (error) {
    console.error("Get assigned numbers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve assigned numbers",
    });
  }
};

// Release/delete a phone number
export const releasePhoneNumber = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { phoneNumberId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Find phone number owned by user
    const phoneNumber = await PhoneNumber.findOne({
      _id: phoneNumberId,
      userId,
    });

    if (!phoneNumber) {
      return res.status(404).json({
        success: false,
        message: "Phone number not found or not owned by user",
      });
    }

    // Soft delete - mark as inactive
    phoneNumber.isActive = false;
    phoneNumber.assignedTo = null;
    await phoneNumber.save();

    res.status(200).json({
      success: true,
      message: "Phone number released successfully",
    });
  } catch (error) {
    console.error("Release phone number error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to release phone number",
    });
  }
};

// Manually add phone number to user account (admin function)
export const addPhoneNumberToUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { number, label, city, state, country, monthlyPrice } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Validation
    if (!number || !label || !city || !state || !country) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if number already exists
    const existingNumber = await PhoneNumber.findOne({ number });
    if (existingNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists in system",
      });
    }

    // Create new phone number record
    const newPhoneNumber = new PhoneNumber({
      userId,
      number,
      label,
      city,
      state,
      country,
      monthlyPrice: monthlyPrice || 5.0,
      capabilities: ["SMS", "Voice"],
      isActive: true,
      purchaseDate: new Date(),
      assignedTo: null,
    });

    await newPhoneNumber.save();

    res.status(201).json({
      success: true,
      message: "Phone number added successfully",
      data: newPhoneNumber,
    });
  } catch (error) {
    console.error("Add phone number error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add phone number",
    });
  }
};
