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
      const response = await fetch(`${this.baseUrl}/Accounts/${SIGNALWIRE_CONFIG.projectId}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: from,
          To: to,
          Body: body
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
}

export const signalWireClient = new SignalWireClient();
