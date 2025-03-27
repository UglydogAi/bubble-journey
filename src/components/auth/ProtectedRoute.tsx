
import React, { useEffect } from 'react';
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
  const { isAuthenticated, isAdmin, isLoading, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Debug logging
    console.log('ProtectedRoute - Auth state:', { 
      isAuthenticated, 
      isAdmin, 
      isLoading,
      path: location.pathname,
      requireAdmin,
      user: user?.email
    });
    
    if (!isLoading && isAuthenticated && requireAdmin && !isAdmin) {
      toast.error("You don't have admin permissions to access this page");
    }
  }, [isAuthenticated, isAdmin, isLoading, location.pathname, requireAdmin, user]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <span className="text-lg">Loading authentication...</span>
        <span className="text-sm text-muted-foreground mt-1">Please wait while we verify your credentials</span>
      </div>
    );
  }

  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // If admin required but user is not an admin, redirect to dashboard
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has required permission level
  return <>{children}</>;
};

export default ProtectedRoute;
