import { Request, Response } from "express";
import PhoneNumber from "../models/PhoneNumber";
import SubAccount from "../models/SubAccount";
import { AuthRequest } from "./auth";

// Sync phone number assignments with sub-accounts
export const syncPhoneNumberAssignments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    // Get all phone numbers for this user
    const phoneNumbers = await PhoneNumber.find({ userId, isActive: true });
    
    // Get all sub-accounts for this user
    const subAccounts = await SubAccount.find({ 
      userId, 
      status: { $ne: "deleted" } 
    });

    let syncedCount = 0;

    // Clear all assignedNumbers arrays first
    await SubAccount.updateMany(
      { userId, status: { $ne: "deleted" } },
      { $set: { assignedNumbers: [] } }
    );

    // Rebuild assignedNumbers arrays based on phone number assignments
    for (const phoneNumber of phoneNumbers) {
      if (phoneNumber.assignedTo) {
        const subAccount = subAccounts.find(sa => sa._id.toString() === phoneNumber.assignedTo?.toString());
        if (subAccount) {
          await SubAccount.updateOne(
            { _id: subAccount._id },
            { $addToSet: { assignedNumbers: phoneNumber._id } }
          );
          syncedCount++;
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `Synced ${syncedCount} phone number assignments`,
      data: {
        phoneNumbersProcessed: phoneNumbers.length,
        assignmentsSynced: syncedCount
      }
    });

  } catch (error) {
    console.error("Sync assignments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to sync phone number assignments"
    });
  }
};
