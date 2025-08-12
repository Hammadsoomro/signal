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

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/register", registerUser);
  app.post("/api/auth/login", loginUser);
  app.post("/api/auth/google", googleAuth);
  app.get("/api/auth/me", verifyToken, getCurrentUser);

  return app;
}
