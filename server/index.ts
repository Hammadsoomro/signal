import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
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
  releasePhoneNumber
} from "./routes/phoneNumbers";

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

  app.get("/api/demo", handleDemo);

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

  return app;
}
