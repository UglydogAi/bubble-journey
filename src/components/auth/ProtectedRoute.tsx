
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isAdmin, isLoading, user, checkIsAdmin } = useAuth();
  const location = useLocation();
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(requireAdmin);
  const [adminCheckComplete, setAdminCheckComplete] = useState(false);

  useEffect(() => {
    // Additional admin check when the route requires admin access
    if (requireAdmin && isAuthenticated && !isLoading && !adminCheckComplete) {
      setIsCheckingAdmin(true);
      
      const verifyAdminStatus = async () => {
        console.log('Verifying admin status for protected route');
        try {
          // Force a re-check of admin status
          const isUserAdmin = await checkIsAdmin();
          console.log('Admin verification result:', isUserAdmin);
          
          if (!isUserAdmin) {
            toast.error("You don't have admin permissions to access this page");
          }
        } catch (error) {
          console.error('Error verifying admin status:', error);
        } finally {
          setIsCheckingAdmin(false);
          setAdminCheckComplete(true);
        }
      };
      
      verifyAdminStatus();
    } else if (!requireAdmin || !isAuthenticated) {
      setIsCheckingAdmin(false);
      setAdminCheckComplete(true);
    }
  }, [isAuthenticated, isLoading, requireAdmin, adminCheckComplete, checkIsAdmin]);

  // Debug logging
  useEffect(() => {
    console.log('ProtectedRoute - Auth state:', { 
      isAuthenticated, 
      isAdmin, 
      isLoading,
      isCheckingAdmin,
      adminCheckComplete,
      path: location.pathname,
      requireAdmin,
      user: user?.email
    });
  }, [isAuthenticated, isAdmin, isLoading, isCheckingAdmin, adminCheckComplete, location.pathname, requireAdmin, user]);

  // Show loading state if we're still loading auth state or checking admin status
  if (isLoading || isCheckingAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <span className="text-lg">
          {isCheckingAdmin ? "Verifying admin permissions..." : "Loading authentication..."}
        </span>
        <span className="text-sm text-muted-foreground mt-1">
          Please wait while we verify your credentials
        </span>
      </div>
    );
  }

  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to /auth');
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // If admin required but user is not an admin, redirect to dashboard
  if (requireAdmin && !isAdmin) {
    console.log('Admin required but user is not admin, redirecting to /dashboard');
    toast.error("You don't have admin permissions to access this page");
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has required permission level
  console.log('Access granted to protected route');
  return <>{children}</>;
};

export default ProtectedRoute;
