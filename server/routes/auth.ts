import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { google } from "googleapis";
import User, { IUser } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "connectlify_secret_key_2024";
const JWT_EXPIRES_IN = "7d";

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "your-google-client-id";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "your-google-client-secret";
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/auth/google/callback";

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

export interface AuthRequest extends Request {
  user?: IUser;
}

// Register new user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email: email.toLowerCase() }, { phone }] 
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return res.status(400).json({
          success: false,
          message: "Email is already registered"
        });
      }
      if (existingUser.phone === phone) {
        return res.status(400).json({
          success: false,
          message: "Phone number is already registered"
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with 0 balance (must deposit)
    const newUser = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      walletBalance: 0, // New users start with 0 balance
      subscription: {
        plan: "free"
      }
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser._id, 
        email: newUser.email 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user data without password
    const userResponse = {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phone: newUser.phone,
      walletBalance: newUser.walletBalance,
      subscription: newUser.subscription,
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during registration"
    });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user by email
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user data without password
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      walletBalance: user.walletBalance,
      subscription: user.subscription,
      createdAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during login"
    });
  }
};

// Verify token middleware
export const verifyToken = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await User.findById(decoded.userId).select("-password");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid token or user not found"
      });
    }

    req.user = user;
    next();

  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

// Google OAuth login/register
export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Google ID token is required"
      });
    }

    // Verify the Google ID token
    const ticket = await oauth2Client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google token"
      });
    }

    const { email, given_name, family_name, sub: googleId } = payload;

    // Check if user already exists
    let user = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { googleId }
      ]
    });

    if (user) {
      // Update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Create new user with Google data
      user = new User({
        firstName: given_name || 'User',
        lastName: family_name || 'Google',
        email: email.toLowerCase(),
        phone: '', // Will be updated later if needed
        password: '', // Google users don't need password
        googleId,
        walletBalance: 0, // New users start with 0 balance
        subscription: {
          plan: "free"
        },
        isGoogleUser: true
      });

      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user data
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      walletBalance: user.walletBalance,
      subscription: user.subscription,
      isGoogleUser: user.isGoogleUser,
      createdAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      message: user.isGoogleUser ? "Signed in with Google successfully" : "Account linked with Google",
      data: {
        user: userResponse,
        token,
        isNewUser: !user.createdAt || (Date.now() - new Date(user.createdAt).getTime()) < 10000 // Created within last 10 seconds
      }
    });

  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({
      success: false,
      message: "Google authentication failed"
    });
  }
};

// Get current user profile
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      walletBalance: user.walletBalance,
      subscription: user.subscription,
      settings: user.settings,
      createdAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      data: {
        user: userResponse
      }
    });

  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
