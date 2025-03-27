
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CallPage from "./pages/call/CallPage";
import CodeActivationPage from "./pages/call/CodeActivationPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import InvitePage from "./pages/invite/InvitePage";
import InvitationCodesPage from "./pages/admin/InvitationCodesPage";
import { AuthProvider } from "@/contexts/AuthContext";
import AdminAuthPage from "./pages/auth/AdminAuthPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
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
              
              {/* Admin Login Routes */}
              <Route path="/admin" element={<Navigate to="/admin/auth" replace />} />
              <Route path="/admin/auth" element={<AdminAuthPage />} />
              
              {/* Protected Admin Routes */}
              <Route 
                path="/admin/invitation-codes" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <InvitationCodesPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
