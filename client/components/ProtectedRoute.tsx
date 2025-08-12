import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Shield, Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
    <Card className="w-full max-w-md bg-white/80 backdrop-blur-lg border-0 shadow-2xl">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <div className="mb-6">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Verifying Authentication</h3>
          <p className="text-slate-600">Please wait while we secure your session...</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

const UnauthorizedScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
    <Card className="w-full max-w-md bg-white/80 backdrop-blur-lg border-0 shadow-2xl">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Lock className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Access Restricted</h3>
        <p className="text-slate-600 mb-6">
          This area requires authentication. Please log in to access your account and wallet features.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Security Notice</span>
          </div>
          <p className="text-sm text-yellow-700 mt-2">
            For your protection, all wallet and messaging features require secure authentication.
          </p>
        </div>
        <p className="text-xs text-slate-500">
          Redirecting to login page...
        </p>
      </CardContent>
    </Card>
  </div>
);

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the attempted route for redirect after login
      const redirectTo = location.pathname + location.search;
      
      // Show unauthorized screen briefly before redirect
      const timer = setTimeout(() => {
        navigate('/login', { 
          state: { from: redirectTo },
          replace: true 
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show unauthorized screen if not authenticated
  if (!isAuthenticated) {
    return <UnauthorizedScreen />;
  }

  // Render protected content if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
