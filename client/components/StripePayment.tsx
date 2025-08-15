import React, { useState } from 'react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, CreditCard } from 'lucide-react';
import { getStripe } from '@/lib/stripe';

interface StripePaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

function StripePaymentForm({ 
  amount, 
  onSuccess, 
  onError, 
  isProcessing, 
  setIsProcessing 
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/wallet`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        onError(error.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed';
      setErrorMessage(message);
      onError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <PaymentElement 
          options={{
            layout: 'tabs',
          }}
        />
        
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Your payment information is encrypted and secure. Powered by Stripe.
          </AlertDescription>
        </Alert>

        <div className="p-3 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <span>Amount to charge:</span>
            <span className="font-semibold">${amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full"
      >
        {isProcessing ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CreditCard className="mr-2 h-4 w-4" />
        )}
        {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </Button>
    </form>
  );
}

interface StripePaymentProps {
  amount: number;
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export default function StripePayment({
  amount,
  clientSecret,
  onSuccess,
  onError,
  isProcessing,
  setIsProcessing,
}: StripePaymentProps) {
  const stripePromise = getStripe();

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#0073e6',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripePaymentForm
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
    </Elements>
  );
}
