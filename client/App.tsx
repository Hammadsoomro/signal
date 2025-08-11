import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./contexts/WalletContext";
import { UserNumbersProvider } from "./contexts/UserNumbersContext";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import Send from "./pages/Send";
import Conversations from "./pages/Conversations";
import BuyNumbers from "./pages/BuyNumbers";
import SubAccounts from "./pages/SubAccounts";
import Wallet from "./pages/Wallet";
import Scheduled from "./pages/Scheduled";
import Responses from "./pages/Responses";
import Transactions from "./pages/Transactions";
import Alerts from "./pages/Alerts";
import Webhooks from "./pages/Webhooks";
import ApiKeys from "./pages/ApiKeys";
import Support from "./pages/Support";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WalletProvider>
        <UserNumbersProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/home" element={<Home />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/send" element={<Send />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/buy-numbers" element={<BuyNumbers />} />
          <Route path="/sub-accounts" element={<SubAccounts />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/scheduled" element={<Scheduled />} />
          <Route path="/responses" element={<Responses />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/webhooks" element={<Webhooks />} />
          <Route path="/api-keys" element={<ApiKeys />} />
          <Route path="/support" element={<Support />} />
          <Route path="/profile" element={<Profile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </UserNumbersProvider>
      </WalletProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
