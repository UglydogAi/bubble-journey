
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CallPage from "./pages/call/CallPage";
import CodeActivationPage from "./pages/call/CodeActivationPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import InvitePage from "./pages/invite/InvitePage";
import InvitationCodesPage from "./pages/admin/InvitationCodesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Index />} />
            <Route path="/invite" element={<InvitePage />} />
            <Route path="/call" element={<CodeActivationPage />} />
            <Route path="/call/chat" element={<CallPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin/invitation-codes" element={<InvitationCodesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
