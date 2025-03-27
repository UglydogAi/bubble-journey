
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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

// Create context with undefined as initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The provider now returns simplified mock data
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState({ id: 'mock-user-id', email: 'admin@example.com' });
  const [session, setSession] = useState({ user: { id: 'mock-user-id', email: 'admin@example.com' } });
  
  // Mock implementation - always authenticated as admin
  const mockCreateAdminUser = async (email: string, password: string) => {
    console.log('Mock creating admin user:', email);
    toast.success(`Admin user ${email} created successfully (mock)`);
    return;
  };
  
  const mockLogin = async () => {
    console.log('Mock login');
    setIsAuthenticated(true);
    toast.success('Logged in successfully (mock)');
  };
  
  const mockSignUp = async () => {
    console.log('Mock signup');
    toast.success('Account created successfully (mock)');
  };
  
  const mockLogout = async () => {
    console.log('Mock logout');
    setIsAuthenticated(false);
    setUser(null);
    setSession(null);
    // Redirect happens in the component
    toast.success('Logged out successfully (mock)');
  };
  
  const mockCheckIsAdmin = async () => {
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated, 
        user,
        session,
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
