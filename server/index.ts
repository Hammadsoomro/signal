import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/database";
import {
  registerUser,
  loginUser,
  verifyToken,
  getCurrentUser,
  googleAuth,
} from "./routes/auth";
import {
  getUserPhoneNumbers,
  purchasePhoneNumber,
  assignPhoneNumber,
  getAvailableNumbers,
  getAssignedNumbers,
  releasePhoneNumber,
  addPhoneNumberToUser
} from "./routes/phoneNumbers";
import {
  getWalletBalance,
  getTransactionHistory,
  debitWallet,
  creditWallet
} from "./routes/wallet";
import {
  getUserSubAccounts,
  createSubAccount,
  updateSubAccount,
  deleteSubAccount,
  transferFunds
} from "./routes/subAccounts";

export function createServer() {
  const app = express();

  // Initialize MongoDB connection
  connectDatabase();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Database test endpoint
  app.get("/api/db-test", async (_req, res) => {
    try {
      const mongoose = require('mongoose');
      const isConnected = mongoose.connection.readyState === 1;
      res.json({
        connected: isConnected,
        status: mongoose.connection.readyState,
        message: isConnected ? "MongoDB Connected" : "MongoDB Disconnected"
      });
    } catch (error) {
      res.status(500).json({ error: "Database test failed", details: error });
    }
  });


  // Debug endpoint
  app.post("/api/debug/register-test", async (req, res) => {
    try {
      console.log("Debug registration test:", req.body);
      const User = require('./models/User').default;
      const userCount = await User.countDocuments();
      res.json({
        success: true,
        message: "Database accessible",
        userCount,
        receivedData: req.body
      });
    } catch (error) {
      console.error("Debug registration error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: error
      });
    }
  });

  // Authentication routes
  app.post("/api/auth/register", registerUser);
  app.post("/api/auth/login", loginUser);
  app.post("/api/auth/google", googleAuth);
  app.get("/api/auth/me", verifyToken, getCurrentUser);

  // Phone Numbers routes
  app.get("/api/phone-numbers", verifyToken, getUserPhoneNumbers);
  app.post("/api/phone-numbers/purchase", verifyToken, purchasePhoneNumber);
  app.post("/api/phone-numbers/assign", verifyToken, assignPhoneNumber);
  app.get("/api/phone-numbers/available", verifyToken, getAvailableNumbers);
  app.get("/api/phone-numbers/assigned/:subAccountId", verifyToken, getAssignedNumbers);
  app.delete("/api/phone-numbers/:phoneNumberId", verifyToken, releasePhoneNumber);

  // Wallet routes
  app.get("/api/wallet/balance", verifyToken, getWalletBalance);
  app.get("/api/wallet/transactions", verifyToken, getTransactionHistory);
  app.post("/api/wallet/debit", verifyToken, debitWallet);
  app.post("/api/wallet/credit", verifyToken, creditWallet);

  // Sub-Account routes
  app.get("/api/sub-accounts", verifyToken, getUserSubAccounts);
  app.post("/api/sub-accounts", verifyToken, createSubAccount);
  app.put("/api/sub-accounts/:subAccountId", verifyToken, updateSubAccount);
  app.delete("/api/sub-accounts/:subAccountId", verifyToken, deleteSubAccount);
  app.post("/api/sub-accounts/transfer", verifyToken, transferFunds);

  return app;
}
