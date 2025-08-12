# Integration Endpoints

## SafePay Wallet Integration

### Base URL
```
https://api.safepay.pk/v1
```

### Required Headers
```
Authorization: Bearer YOUR_SAFEPAY_SECRET_KEY
Content-Type: application/json
```

### Endpoints

#### 1. Create Payment Session
```http
POST /payments/sessions
```

**Body:**
```json
{
  "amount": 1000,
  "currency": "PKR",
  "success_url": "https://your-app.com/wallet/success",
  "cancel_url": "https://your-app.com/wallet/cancel",
  "webhook_url": "https://your-app.com/api/safepay/webhook",
  "metadata": {
    "user_id": "user123",
    "purpose": "wallet_topup"
  }
}
```

#### 2. Verify Payment
```http
GET /payments/sessions/{session_id}
```

#### 3. Wallet Balance
```http
GET /wallets/{wallet_id}/balance
```

#### 4. Add Funds to Wallet
```http
POST /wallets/{wallet_id}/credit
```

**Body:**
```json
{
  "amount": 1000,
  "currency": "PKR",
  "reference": "payment_session_id",
  "description": "Wallet top-up"
}
```

### Implementation Example (Node.js)
```javascript
const safepay = require('safepay-node');

const client = new safepay.Client({
  apiKey: process.env.SAFEPAY_SECRET_KEY,
  environment: 'sandbox' // or 'production'
});

// Create payment session
const session = await client.payments.createSession({
  amount: 1000,
  currency: 'PKR',
  success_url: 'https://your-app.com/wallet/success',
  cancel_url: 'https://your-app.com/wallet/cancel'
});
```

---

## SignalWire SMS Inbound API

### Base URL
```
https://[your-space].signalwire.com/api/laml/2010-04-01
```

### Authentication
```
Username: Your Project ID
Password: Your API Token
```

### Webhook Configuration

#### Set Inbound SMS Webhook
```http
POST /Accounts/{AccountSid}/IncomingPhoneNumbers/{PhoneNumberSid}
```

**Body:**
```json
{
  "SmsUrl": "https://your-app.com/api/sms/inbound",
  "SmsMethod": "POST"
}
```

### Inbound SMS Webhook Handler

When SignalWire receives an SMS, it will POST to your webhook URL with:

```json
{
  "MessageSid": "SM1234567890abcdef",
  "AccountSid": "ACabcdef1234567890",
  "From": "+1234567890",
  "To": "+0987654321",
  "Body": "Hello, this is an inbound SMS",
  "NumMedia": "0",
  "DateCreated": "2024-01-01T12:00:00Z"
}
```

#### Example Webhook Handler (Express.js)
```javascript
app.post('/api/sms/inbound', (req, res) => {
  const { From, To, Body, MessageSid } = req.body;
  
  // Process inbound SMS
  console.log(`Received SMS from ${From} to ${To}: ${Body}`);
  
  // Store in database
  await storeInboundMessage({
    from: From,
    to: To,
    body: Body,
    messageSid: MessageSid,
    timestamp: new Date()
  });
  
  // Optional: Send automated reply
  const response = new LaML.Response();
  response.message('Thank you for your message!');
  
  res.type('text/xml');
  res.send(response.toString());
});
```

### Setting Up Inbound SMS

1. **Configure Phone Number Webhook:**
```javascript
const client = require('@signalwire/rest')('ProjectID', 'AuthToken', {
  signalwireSpaceUrl: 'your-space.signalwire.com'
});

await client.incomingPhoneNumbers(phoneNumberSid)
  .update({
    smsUrl: 'https://your-app.com/api/sms/inbound',
    smsMethod: 'POST'
  });
```

2. **Handle Inbound Messages in Your App:**
```javascript
// Store inbound message in database
const storeInboundMessage = async (messageData) => {
  const message = new Message({
    from: messageData.from,
    to: messageData.to,
    body: messageData.body,
    direction: 'inbound',
    messageSid: messageData.messageSid,
    timestamp: messageData.timestamp
  });
  
  await message.save();
  
  // Notify user in real-time (WebSocket, etc.)
  io.to(userRoom).emit('newMessage', message);
};
```

3. **Real-time Updates (WebSocket):**
```javascript
// In your conversations component
useEffect(() => {
  const socket = io();
  
  socket.on('newMessage', (message) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.contact === message.from 
          ? { ...conv, messages: [...conv.messages, message] }
          : conv
      )
    );
  });
  
  return () => socket.disconnect();
}, []);
```

### Environment Variables Required

```bash
# SafePay
SAFEPAY_SECRET_KEY=sk_test_your_secret_key
SAFEPAY_WEBHOOK_SECRET=whsec_your_webhook_secret

# SignalWire
SIGNALWIRE_PROJECT_ID=your_project_id
SIGNALWIRE_API_TOKEN=your_api_token
SIGNALWIRE_SPACE_URL=your-space.signalwire.com
```
