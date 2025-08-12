import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in (simulate with localStorage)
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('connectlify_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('connectlify_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call with validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo - accept any email/password combination
      // In production, this would be a real API call
      if (email && password && password.length >= 6) {
        const userData: User = {
          id: '1',
          name: email.split('@')[0] || 'User',
          email: email,
          isAuthenticated: true
        };
        
        setUser(userData);
        localStorage.setItem('connectlify_user', JSON.stringify(userData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
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
