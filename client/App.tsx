import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./contexts/WalletContext";
import { UserNumbersProvider } from "./contexts/UserNumbersContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Home from "./pages/Home";
import Send from "./pages/Send";
import Conversations from "./pages/Conversations";
import BuyNumbers from "./pages/BuyNumbers";
import SubAccounts from "./pages/SubAccounts";
import Wallet from "./pages/Wallet";
import Scheduled from "./pages/Scheduled";
import Transactions from "./pages/Transactions";
import Support from "./pages/Support";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WalletProvider>
            <UserNumbersProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />

                  {/* Protected Routes */}
                  <Route
                    path="/home"
                    element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/send"
                    element={
                      <ProtectedRoute>
                        <Send />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/conversations"
                    element={
                      <ProtectedRoute>
                        <Conversations />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/buy-numbers"
                    element={
                      <ProtectedRoute>
                        <BuyNumbers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/sub-accounts"
                    element={
                      <ProtectedRoute>
                        <SubAccounts />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/wallet"
                    element={
                      <ProtectedRoute>
                        <Wallet />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/scheduled"
                    element={
                      <ProtectedRoute>
                        <Scheduled />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/transactions"
                    element={
                      <ProtectedRoute>
                        <Transactions />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/support"
                    element={
                      <ProtectedRoute>
                        <Support />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </UserNumbersProvider>
          </WalletProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

// Ensure we only create one root instance with proper error handling
const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container not found");
}

// Check if we already have a root instance
let root = (container as any)._reactRoot;

if (!root) {
  try {
    // Clear any existing content to prevent conflicts
    container.innerHTML = "";
    root = createRoot(container);
    (container as any)._reactRoot = root;
  } catch (error) {
    console.error("Failed to create React root:", error);
    throw error;
  }
}

// Handle hot module replacement cleanup
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if ((container as any)._reactRoot) {
      (container as any)._reactRoot = null;
    }
  });
}

root.render(<App />);
