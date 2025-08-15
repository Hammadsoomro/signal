import { Request, Response } from "express";
import Stripe from "stripe";
import { AuthRequest } from "./auth";
import User from "../models/User";
import Transaction from "../models/Transaction";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

// Create payment intent for wallet top-up
export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { amount, currency = "usd" } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!amount || amount < 5) {
      return res.status(400).json({
        success: false,
        message: "Minimum amount is $5.00",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        userId: userId.toString(),
        type: "wallet_topup",
        userEmail: user.email,
      },
      description: `Wallet top-up for ${user.firstName} ${user.lastName}`,
    });

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (error) {
    console.error("Create payment intent error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment intent",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Confirm payment and add funds to wallet
export const confirmPayment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { paymentIntentId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: "Payment Intent ID is required",
      });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        message: "Payment not successful",
        status: paymentIntent.status,
      });
    }

    // Verify the payment belongs to this user
    if (paymentIntent.metadata.userId !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Payment does not belong to this user",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const amount = paymentIntent.amount / 100; // Convert from cents

    // Check if we already processed this payment
    const existingTransaction = await Transaction.findOne({
      reference: paymentIntentId,
      userId,
    });

    if (existingTransaction) {
      return res.status(200).json({
        success: true,
        message: "Payment already processed",
        data: {
          transaction: existingTransaction,
          newBalance: user.walletBalance,
        },
      });
    }

    // Create transaction record
    const transaction = new Transaction({
      userId,
      type: "credit",
      amount,
      description: `Wallet top-up via Stripe`,
      reference: paymentIntentId,
      status: "completed",
      relatedTo: "wallet_topup",
    });

    await transaction.save();

    // Update user's wallet balance
    user.walletBalance += amount;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        transaction,
        newBalance: user.walletBalance,
      },
    });
  } catch (error) {
    console.error("Confirm payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to confirm payment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get payment methods for user
export const getPaymentMethods = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If user has a Stripe customer ID, get their payment methods
    if (user.stripeCustomerId) {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: user.stripeCustomerId,
        type: "card",
      });

      res.status(200).json({
        success: true,
        data: {
          paymentMethods: paymentMethods.data.map((pm) => ({
            id: pm.id,
            type: pm.type,
            card: pm.card ? {
              brand: pm.card.brand,
              last4: pm.card.last4,
              exp_month: pm.card.exp_month,
              exp_year: pm.card.exp_year,
            } : null,
          })),
        },
      });
    } else {
      res.status(200).json({
        success: true,
        data: {
          paymentMethods: [],
        },
      });
    }
  } catch (error) {
    console.error("Get payment methods error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve payment methods",
    });
  }
};

// Create or get Stripe customer
export const createCustomer = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If user already has a Stripe customer ID, return it
    if (user.stripeCustomerId) {
      try {
        const customer = await stripe.customers.retrieve(user.stripeCustomerId);
        return res.status(200).json({
          success: true,
          data: {
            customerId: user.stripeCustomerId,
            customer,
          },
        });
      } catch (error) {
        // Customer doesn't exist in Stripe, create a new one
        console.warn("Stripe customer not found, creating new one");
      }
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      metadata: {
        userId: userId.toString(),
      },
    });

    // Save customer ID to user
    user.stripeCustomerId = customer.id;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        customerId: customer.id,
        customer,
      },
    });
  } catch (error) {
    console.error("Create customer error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create customer",
    });
  }
};

// Webhook for Stripe events
export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !endpointSecret) {
    return res.status(400).send('Missing signature or webhook secret');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err);
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment succeeded:', paymentIntent.id);
      // Additional webhook processing can be added here
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      console.log('Payment failed:', failedPayment.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
