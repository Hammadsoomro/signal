import { loadStripe, Stripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  throw new Error('Missing Stripe publishable key. Please add VITE_STRIPE_PUBLISHABLE_KEY to your environment variables.');
}

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

export const createPaymentIntent = async (amount: number) => {
  const token = localStorage.getItem('connectlify_token');
  
  const response = await fetch('/api/stripe/create-payment-intent', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create payment intent');
  }

  return data.data;
};

export const confirmPayment = async (paymentIntentId: string) => {
  const token = localStorage.getItem('connectlify_token');
  
  const response = await fetch('/api/stripe/confirm-payment', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentIntentId }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to confirm payment');
  }

  return data.data;
};

export const getPaymentMethods = async () => {
  const token = localStorage.getItem('connectlify_token');
  
  const response = await fetch('/api/stripe/payment-methods', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to get payment methods');
  }

  return data.data.paymentMethods;
};

export const createCustomer = async () => {
  const token = localStorage.getItem('connectlify_token');
  
  const response = await fetch('/api/stripe/create-customer', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create customer');
  }

  return data.data;
};
