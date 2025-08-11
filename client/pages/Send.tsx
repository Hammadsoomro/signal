import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useWallet } from '@/contexts/WalletContext';
import { 
  Send as SendIcon, 
  Phone, 
  MessageSquare, 
  Users,
  AlertCircle,
  CheckCircle,
  Loader2,
  User,
  Upload,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserNumbers } from '@/contexts/UserNumbersContext';

export default function Send() {
  const { toast } = useToast();
  const { balance, deductBalance } = useWallet();
  const { purchasedNumbers, getAvailableNumbers } = useUserNumbers();
  const availableNumbers = getAvailableNumbers();
  const [selectedNumber, setSelectedNumber] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendType, setSendType] = useState<'single' | 'bulk'>('single');
  const [bulkRecipients, setBulkRecipients] = useState('');

  const messageTemplates = [
    { id: 'welcome', text: 'Welcome to Connectlify! Thanks for joining us.' },
    { id: 'reminder', text: 'This is a friendly reminder about your upcoming appointment.' },
    { id: 'promotion', text: 'Special offer just for you! Get 20% off your next purchase.' },
    { id: 'support', text: 'Thank you for contacting support. We\'ll get back to you soon.' }
  ];

  const calculateCost = () => {
    const smsPrice = 0.01; // $0.01 per SMS
    if (sendType === 'single') {
      return smsPrice;
    } else {
      const recipients = bulkRecipients.split('\n').filter(r => r.trim()).length;
      return recipients * smsPrice;
    }
  };

  const getRecipientCount = () => {
    if (sendType === 'single') return 1;
    return bulkRecipients.split('\n').filter(r => r.trim()).length;
  };

  const sendSMS = async () => {
    if (!selectedNumber || !message.trim() || isSending) return;
    
    if (sendType === 'single' && !recipient.trim()) {
      toast({
        title: "Recipient Required",
        description: "Please enter a recipient phone number",
        variant: "destructive",
      });
      return;
    }

    if (sendType === 'bulk' && !bulkRecipients.trim()) {
      toast({
        title: "Recipients Required",
        description: "Please enter recipient phone numbers",
        variant: "destructive",
      });
      return;
    }

    const cost = calculateCost();
    const recipientCount = getRecipientCount();
    
    if (!deductBalance(cost, `SMS sent to ${recipientCount} recipient${recipientCount > 1 ? 's' : ''}`)) {
      return; // Insufficient balance, error already shown
    }

    setIsSending(true);

    try {
      // Simulate SMS sending API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "SMS Sent Successfully!",
        description: `Message sent to ${recipientCount} recipient${recipientCount > 1 ? 's' : ''} for $${cost.toFixed(2)}`,
      });

      // Clear form
      setRecipient('');
      setBulkRecipients('');
      setMessage('');
      
    } catch (error) {
      toast({
        title: "Send Failed",
        description: "Failed to send SMS. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const useTemplate = (templateText: string) => {
    setMessage(templateText);
  };

  const remainingChars = 160 - message.length;
  const cost = calculateCost();

  return (
    <DashboardLayout title="Send SMS">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Send SMS</h1>
          <p className="text-muted-foreground">
            Send SMS messages to individual recipients or bulk send to multiple contacts
          </p>
        </div>

        {/* Send Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Message Type</CardTitle>
            <CardDescription>Choose how you want to send your message</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className={`cursor-pointer transition-colors ${
                  sendType === 'single' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSendType('single')}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <User className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-medium">Single Message</h3>
                    <p className="text-sm text-muted-foreground">Send to one recipient</p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-colors ${
                  sendType === 'bulk' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSendType('bulk')}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-medium">Bulk Message</h3>
                    <p className="text-sm text-muted-foreground">Send to multiple recipients</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Send Form */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Sender Number */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  From Number
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedNumber} onValueChange={setSelectedNumber}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sending number" />
                  </SelectTrigger>
                  <SelectContent>
                    {userNumbers.filter(num => num.isActive).map((num) => (
                      <SelectItem key={num.id} value={num.number}>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{num.number}</span>
                          <Badge variant="secondary" className="text-xs">{num.label}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Recipients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {sendType === 'single' ? 'Recipient' : 'Recipients'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sendType === 'single' ? (
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Phone Number</Label>
                    <Input
                      id="recipient"
                      placeholder="+1 (555) 123-4567"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="bulkRecipients">Phone Numbers (one per line)</Label>
                    <Textarea
                      id="bulkRecipients"
                      placeholder="+1 (555) 123-4567&#10;+1 (555) 234-5678&#10;+1 (555) 345-6789"
                      value={bulkRecipients}
                      onChange={(e) => setBulkRecipients(e.target.value)}
                      rows={6}
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{getRecipientCount()} recipients</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-1" />
                          Import CSV
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Template
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Message */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="message">Message Content</Label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    maxLength={160}
                  />
                  <div className="flex justify-between text-sm">
                    <span className={remainingChars < 0 ? 'text-red-500' : 'text-muted-foreground'}>
                      {remainingChars} characters remaining
                    </span>
                    <span className="text-muted-foreground">
                      {Math.ceil(message.length / 160)} SMS{Math.ceil(message.length / 160) > 1 ? ' segments' : ''}
                    </span>
                  </div>
                </div>

                {/* Quick Templates */}
                <div className="space-y-2">
                  <Label>Quick Templates</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {messageTemplates.map((template) => (
                      <Button
                        key={template.id}
                        variant="outline"
                        size="sm"
                        onClick={() => useTemplate(template.text)}
                        className="justify-start text-left h-auto p-2"
                      >
                        <span className="truncate">{template.text}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Send Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recipients:</span>
                    <span className="font-medium">{getRecipientCount()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Message length:</span>
                    <span className="font-medium">{message.length} chars</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SMS segments:</span>
                    <span className="font-medium">{Math.ceil(message.length / 160)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost per SMS:</span>
                    <span className="font-medium">$0.01</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>Total Cost:</span>
                    <span>${cost.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Balance:</span>
                    <span className="font-medium">${balance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">After Send:</span>
                    <span className="font-medium">${(balance - cost).toFixed(2)}</span>
                  </div>
                </div>

                {cost > balance && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Insufficient balance. Please add funds to your wallet.
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={sendSMS} 
                  disabled={!selectedNumber || !message.trim() || cost > balance || isSending}
                  className="w-full"
                >
                  {isSending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <SendIcon className="mr-2 h-4 w-4" />
                  )}
                  {isSending ? 'Sending...' : `Send SMS - $${cost.toFixed(2)}`}
                </Button>
              </CardContent>
            </Card>

            {selectedNumber && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Sending From</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedNumber}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
