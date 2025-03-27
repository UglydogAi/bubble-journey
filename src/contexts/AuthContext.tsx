
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type Role = 'admin' | 'user';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Enhanced admin email list - ensure lowercase for consistent comparison
  const adminEmails = ['admin@example.com', 'admin@wiz.app'].map(email => email.toLowerCase());

  useEffect(() => {
    console.log('Auth Provider initialized');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);
        
        if (session?.user) {
          // Check admin status immediately after auth state change
          const isUserAdmin = await checkIsAdmin();
          console.log('Admin status after auth state change:', isUserAdmin);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // Initialize auth state
    const initializeAuth = async () => {
      console.log('Initializing auth state...');
      setIsLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Got session:', session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);
        
        if (session?.user) {
          const isUserAdmin = await checkIsAdmin();
          console.log('Initial admin status:', isUserAdmin);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
        console.log('Auth initialization complete');
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  const checkIsAdmin = async (): Promise<boolean> => {
    try {
      if (!user) {
        console.log('No user found when checking admin status');
        setIsAdmin(false);
        return false;
      }
      
      console.log('Checking admin status for:', user.email);
      
      // Check if user email is in the admin emails list - ensure lowercase comparison
      const userEmail = user.email.toLowerCase();
      const isUserAdmin = adminEmails.includes(userEmail);
      
      console.log('Is admin check result:', isUserAdmin, 'for email:', userEmail, 'Admin emails:', adminEmails);
      setIsAdmin(isUserAdmin);
      return isUserAdmin;
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      
      console.log('Login successful for:', email);
      toast.success('Logged in successfully');
      
      // The auth state change listener will handle the navigation
      // Redirect happens in Auth page useEffect based on isAuthenticated and isAdmin
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to log in');
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('Attempting signup for:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: 'user' }
        }
      });

      if (error) throw error;
      
      if (data.user && !data.session) {
        toast.info('Please check your email to confirm your account');
      } else if (data.session) {
        toast.success('Account created and logged in successfully');
        // Navigation will be handled by the auth state change listener
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setIsAuthenticated(false);
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to log out');
    }
  };

  const createAdminUser = async (email: string, password: string) => {
    try {
      console.log('Attempting to create admin user:', email);
      
      // First check if user already exists by trying to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (!signInError) {
        console.log('User already exists with correct password');
        toast.info('Admin user already exists with the provided credentials');
        await supabase.auth.signOut();
        return;
      }
      
      if (signInError.message.includes("Invalid login credentials")) {
        console.log('Creating new admin user');
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role: 'admin' }
          }
        });
        
        if (signUpError) throw signUpError;
        console.log('Admin user created successfully');
        toast.success('Admin user created successfully. You can now log in with these credentials.');
      } else {
        throw signInError;
      }
      
      return;
    } catch (error: any) {
      console.error('Admin user creation error:', error);
      toast.error(error.message || 'Failed to create admin user');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        session,
        isAdmin,
        isLoading,
        login,
        signUp,
        logout,
        checkIsAdmin,
        createAdminUser,
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
