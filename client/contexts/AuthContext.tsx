import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string; // computed from firstName + lastName
  email: string;
  phone: string;
  walletBalance: number;
  subscription: {
    plan: string;
  };
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in (check token with server)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('connectlify_token');
        if (token) {
          // Verify token with server
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              const userData = data.data.user;
              setUser({
                id: userData.id,
                firstName: userData.firstName,
                lastName: userData.lastName,
                name: `${userData.firstName} ${userData.lastName}`,
                email: userData.email,
                phone: userData.phone,
                walletBalance: userData.walletBalance,
                subscription: userData.subscription,
                isAuthenticated: true
              });
            } else {
              // Invalid token, remove it
              localStorage.removeItem('connectlify_token');
            }
          } else {
            // Invalid token, remove it
            localStorage.removeItem('connectlify_token');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('connectlify_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const userData = data.data.user;
        const token = data.data.token;

        const user: User = {
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          phone: userData.phone,
          walletBalance: userData.walletBalance,
          subscription: userData.subscription,
          isAuthenticated: true
        };

        setUser(user);
        localStorage.setItem('connectlify_token', token);

        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('connectlify_user');
    
    // Clear any other sensitive data
    localStorage.removeItem('connectlify_wallet_balance');
    localStorage.removeItem('connectlify_api_keys');
    
    // Redirect to home
    window.location.href = '/';
  };

  const isAuthenticated = !!user?.isAuthenticated;

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
