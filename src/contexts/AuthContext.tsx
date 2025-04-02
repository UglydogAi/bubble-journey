
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
  persistUserData: (profileData?: any) => Promise<void>;
}

// Create context with undefined as initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The provider now returns simplified mock data with persistent auth
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  
  // Check for existing session on initial load
  useEffect(() => {
    const checkSession = async () => {
      // Check if we have a saved session in localStorage
      const savedSession = localStorage.getItem('wizUserSession');
      const savedUser = localStorage.getItem('wizUserProfile');
      
      if (savedSession && savedUser) {
        try {
          setSession(JSON.parse(savedSession));
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
          console.log('User authenticated from saved session');
        } catch (error) {
          console.error('Error parsing saved session:', error);
          // Clear invalid session data
          localStorage.removeItem('wizUserSession');
          localStorage.removeItem('wizUserProfile');
        }
      }
      
      setIsLoading(false);
    };
    
    checkSession();
  }, []);

  // Helper function to persist user data across sessions
  const persistUserData = async (profileData?: any) => {
    if (!user) return;
    
    const userData = { ...user };
    
    // If profile data is provided, merge it with existing user data
    if (profileData) {
      userData.profileData = { ...userData.profileData, ...profileData };
    }
    
    // Store updated user data
    localStorage.setItem('wizUserProfile', JSON.stringify(userData));
    
    // Update state
    setUser(userData);
  };
  
  const mockCreateAdminUser = async (email: string, password: string) => {
    console.log('Mock creating admin user:', email);
    toast.success(`Admin user ${email} created successfully (mock)`);
    return;
  };
  
  const mockLogin = async (email: string, password: string) => {
    console.log('Mock login for:', email);
    setIsLoading(true);
    
    try {
      // In a real app, this would be the Supabase login call
      // For this mock, we'll create a session with the email
      const mockUser = { id: 'mock-user-id', email };
      const mockSession = { user: mockUser };
      
      // Check if we have saved profile data for this user
      const savedProfileData = localStorage.getItem(`wizUserData-${email}`);
      if (savedProfileData) {
        try {
          const profileData = JSON.parse(savedProfileData);
          mockUser.profileData = profileData;
        } catch (error) {
          console.error('Error parsing saved profile data:', error);
        }
      }
      
      // Store session and user in localStorage for persistence
      localStorage.setItem('wizUserSession', JSON.stringify(mockSession));
      localStorage.setItem('wizUserProfile', JSON.stringify(mockUser));
      
      // Also store the invitation code to prevent asking again
      localStorage.setItem('wizInviteVerified', 'true');
      
      setUser(mockUser);
      setSession(mockSession);
      setIsAuthenticated(true);
      toast.success('Logged in successfully');
    } catch (error: any) {
      console.error('Error during login:', error);
      toast.error(error.message || 'Failed to log in');
    } finally {
      setIsLoading(false);
    }
  };
  
  const mockSignUp = async (email: string, password: string) => {
    console.log('Mock signup for:', email);
    setIsLoading(true);
    
    try {
      // In a real app, this would be the Supabase signup call
      // For this mock, we'll create a user and session
      const mockUser = { id: 'mock-user-id', email };
      const mockSession = { user: mockUser };
      
      // Store session and user in localStorage for persistence
      localStorage.setItem('wizUserSession', JSON.stringify(mockSession));
      localStorage.setItem('wizUserProfile', JSON.stringify(mockUser));
      
      // Also store the invitation code to prevent asking again
      localStorage.setItem('wizInviteVerified', 'true');
      
      setUser(mockUser);
      setSession(mockSession);
      setIsAuthenticated(true);
      toast.success('Account created successfully');
    } catch (error: any) {
      console.error('Error during signup:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };
  
  const mockLogout = async () => {
    console.log('Mock logout');
    setIsLoading(true);
    
    try {
      // Remove session and user from localStorage
      localStorage.removeItem('wizUserSession');
      localStorage.removeItem('wizUserProfile');
      
      // Keep invitation code verification to prevent asking again
      
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Error during logout:', error);
      toast.error(error.message || 'Failed to log out');
    } finally {
      setIsLoading(false);
    }
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
        isAdmin: true, // Always admin for mock
        isLoading,
        login: mockLogin,
        signUp: mockSignUp,
        logout: mockLogout,
        checkIsAdmin: mockCheckIsAdmin,
        createAdminUser: mockCreateAdminUser,
        persistUserData,
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
