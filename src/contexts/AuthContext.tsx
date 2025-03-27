
import React, { createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  session: any | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkIsAdmin: () => Promise<boolean>;
  createAdminUser: (email: string, password: string) => Promise<void>;
}

// Create a simplified context with mock values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The provider now returns simplified mock data
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mock implementation - always authenticated as admin
  const mockCreateAdminUser = async (email: string, password: string) => {
    console.log('Mock creating admin user:', email);
    toast.success(`Admin user ${email} created successfully (mock)`);
    return;
  };
  
  const mockLogin = async () => {
    console.log('Mock login');
    toast.success('Logged in successfully (mock)');
  };
  
  const mockSignUp = async () => {
    console.log('Mock signup');
    toast.success('Account created successfully (mock)');
  };
  
  const mockLogout = async () => {
    console.log('Mock logout');
    toast.success('Logged out successfully (mock)');
  };
  
  const mockCheckIsAdmin = async () => {
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: true, // Always authenticated
        user: { id: 'mock-user-id', email: 'admin@example.com' }, // Mock user
        session: { user: { id: 'mock-user-id', email: 'admin@example.com' } }, // Mock session
        isAdmin: true, // Always admin
        isLoading: false, // Never loading
        login: mockLogin,
        signUp: mockSignUp,
        logout: mockLogout,
        checkIsAdmin: mockCheckIsAdmin,
        createAdminUser: mockCreateAdminUser,
      }}
    >
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
