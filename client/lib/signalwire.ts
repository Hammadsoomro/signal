// Helper function to clean phone number format for SignalWire
export const cleanPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-digit characters except the leading +
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');

  // Ensure it starts with + if it doesn't already
  if (!cleaned.startsWith('+')) {
    return `+${cleaned}`;
  }

  return cleaned;
};

// SignalWire Configuration
export const SIGNALWIRE_CONFIG = {
  projectId: '208c6520-b4c1-4dfa-a8ac-e91a18b37f38',
  spaceUrl: 'connectlify.signalwire.com',
  token: 'PTce1a5791efe2e874f8c89cb2fe15a5e10090ebd8e1304868',
  apiUrl: 'https://connectlify.signalwire.com/api/laml/2010-04-01'
};

// SignalWire API client
export class SignalWireClient {
  private baseUrl: string;
  private auth: string;

  constructor() {
    this.baseUrl = SIGNALWIRE_CONFIG.apiUrl;
    // Use btoa for browser compatibility instead of Buffer
    this.auth = btoa(`${SIGNALWIRE_CONFIG.projectId}:${SIGNALWIRE_CONFIG.token}`);
  }

  // Send SMS message
  async sendSMS(from: string, to: string, body: string) {
    try {
      // Clean phone numbers to E.164 format
      const cleanFrom = cleanPhoneNumber(from);
      const cleanTo = cleanPhoneNumber(to);

      console.log('Sending SMS:', { from: cleanFrom, to: cleanTo, body });

      // Validate that the from number is owned by this account
      try {
        const ownedNumbers = await this.getOwnedPhoneNumbers();
        const isOwnedNumber = ownedNumbers.incoming_phone_numbers?.some((num: any) =>
          cleanPhoneNumber(num.phone_number) === cleanFrom
        );

        if (!isOwnedNumber) {
          throw new Error(`Phone number ${cleanFrom} is not owned by this SignalWire account. Please purchase this number first or verify it in your SignalWire dashboard.`);
        }
      } catch (validateError) {
        console.warn('Could not validate number ownership:', validateError);
        // Continue with the request anyway - let SignalWire handle the validation
      }

      const response = await fetch(`${this.baseUrl}/Accounts/${SIGNALWIRE_CONFIG.projectId}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: cleanFrom,
          To: cleanTo,
          Body: body
        })
      });

      if (!response.ok) {
        // Get detailed error information from SignalWire
        let errorDetails = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorDetails += ` - ${errorData.message}`;
          }
          if (errorData.more_info) {
            errorDetails += ` - More info: ${errorData.more_info}`;
          }
          if (errorData.code) {
            errorDetails += ` - Code: ${errorData.code}`;
          }
          console.error('SignalWire API Error Details:', errorData);
        } catch (parseError) {
          const responseText = await response.text();
          errorDetails += ` - Response: ${responseText}`;
          console.error('SignalWire Raw Error Response:', responseText);
        }
        throw new Error(errorDetails);
      }

      return await response.json();
    } catch (error) {
      console.error('SignalWire SMS send error:', error);
      throw error;
    }
  }

  // Get available phone numbers
  async getAvailablePhoneNumbers(country = 'US', areaCode?: string) {
    try {
      const params = new URLSearchParams({
        Country: country,
        ...(areaCode && { AreaCode: areaCode })
      });

      const response = await fetch(
        `${this.baseUrl}/Accounts/${SIGNALWIRE_CONFIG.projectId}/AvailablePhoneNumbers/${country}/Local.json?${params}`,
        {
          headers: {
            'Authorization': `Basic ${this.auth}`,
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('SignalWire get numbers error:', error);
      throw error;
    }
  }

  // Purchase phone number
  async purchasePhoneNumber(phoneNumber: string) {
    try {
      const response = await fetch(`${this.baseUrl}/Accounts/${SIGNALWIRE_CONFIG.projectId}/IncomingPhoneNumbers.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          PhoneNumber: phoneNumber
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('SignalWire purchase number error:', error);
      throw error;
    }
  }

  // Get owned phone numbers
  async getOwnedPhoneNumbers() {
    try {
      const response = await fetch(`${this.baseUrl}/Accounts/${SIGNALWIRE_CONFIG.projectId}/IncomingPhoneNumbers.json`, {
        headers: {
          'Authorization': `Basic ${this.auth}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('SignalWire get owned numbers error:', error);
      throw error;
    }
  }

  // Get message history
  async getMessages(limit = 20) {
    try {
      const response = await fetch(`${this.baseUrl}/Accounts/${SIGNALWIRE_CONFIG.projectId}/Messages.json?PageSize=${limit}`, {
        headers: {
          'Authorization': `Basic ${this.auth}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('SignalWire get messages error:', error);
      throw error;
    }
  }

  // Test connection and verify account
  async testConnection() {
    try {
      console.log('Testing SignalWire connection...');
      const account = await fetch(`${this.baseUrl}/Accounts/${SIGNALWIRE_CONFIG.projectId}.json`, {
        headers: {
          'Authorization': `Basic ${this.auth}`,
        }
      });

      if (!account.ok) {
        throw new Error(`Account verification failed: ${account.status}`);
      }

      const accountData = await account.json();
      console.log('SignalWire account verified:', accountData.friendly_name);

      // Get owned numbers
      const numbers = await this.getOwnedPhoneNumbers();
      console.log('Owned phone numbers:', numbers.incoming_phone_numbers?.map((num: any) => num.phone_number) || []);

      return {
        accountVerified: true,
        accountName: accountData.friendly_name,
        ownedNumbers: numbers.incoming_phone_numbers || []
      };
    } catch (error) {
      console.error('SignalWire connection test failed:', error);
      throw error;
    }
  }
}

export const signalWireClient = new SignalWireClient();
