import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Link>
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Connectlify</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms & Conditions</CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using Connectlify, you accept and agree to be bound by the terms
              and provision of this agreement.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily use Connectlify for personal and commercial
              communication purposes. This is the grant of a license, not a transfer of title.
            </p>

            <h2 className="text-2xl font-semibold mb-4">User Account</h2>
            <p className="mb-4">
              You are responsible for safeguarding the password and for maintaining the confidentiality 
              of your account. You agree to accept responsibility for all activities under your account.
            </p>

            <h2 className="text-2xl font-semibold mb-4">SMS Usage</h2>
            <p className="mb-4">
              You agree to use our SMS services responsibly and in compliance with all applicable laws. 
              Spam, harassment, or any illegal activity is strictly prohibited.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Payment and Billing</h2>
            <p className="mb-4">
              You agree to pay all fees associated with your use of Connectlify. Wallet balances are
              non-refundable unless required by law.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="mb-4">
              SMSFlow shall not be liable for any damages arising from the use or inability to use 
              our services, even if we have been notified of the possibility of such damages.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms & Conditions, please contact us at legal@smsflow.com
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
