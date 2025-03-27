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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);
        
        if (session?.user) {
          setTimeout(() => {
            checkIsAdmin();
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Got session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        checkIsAdmin().finally(() => {
          setIsLoading(false);
        });
      } else {
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkIsAdmin = async (): Promise<boolean> => {
    try {
      if (!user) return false;
      
      console.log('Checking admin status for:', user.email);
      const adminEmails = ['admin@example.com', 'admin@wiz.app'];
      const isUserAdmin = adminEmails.includes(user?.email);
      
      console.log('Is admin:', isUserAdmin);
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
      
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (!signInError) {
        console.log('User already exists with correct password');
        
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
      } else {
        throw signInError;
      }
      
      return;
    } catch (error: any) {
      console.error('Admin user creation error:', error);
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
