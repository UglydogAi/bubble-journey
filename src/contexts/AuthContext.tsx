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
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileError) throw profileError;

      const adminEmails = ['admin@example.com', 'admin@wiz.app'];
      const isUserAdmin = adminEmails.includes(user?.email);
      
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to log in');
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user && !data.session) {
        toast.info('Please check your email to confirm your account');
      } else if (data.session) {
        toast.success('Account created and logged in successfully');
        navigate('/dashboard');
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
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: 'admin' },
      });

      if (error) {
        if (error.message.includes('already exists')) {
          const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
            data?.user?.id || '',
            {
              password,
              email_confirm: true,
              user_metadata: { role: 'admin' },
            }
          );

          if (updateError) throw updateError;
          
          toast.success('Admin user updated successfully');
          return;
        }
        throw error;
      }

      if (data?.user?.id) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ id: data.user.id })
          .select();

        if (profileError) throw profileError;
      }

      toast.success('Admin user created successfully');
    } catch (error: any) {
      console.error('Admin user creation error:', error);
      
      if (error.message.includes('unauthorized') || error.message.includes('permission')) {
        try {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { role: 'admin' },
            },
          });
          
          if (signUpError) throw signUpError;
          
          if (data?.user) {
            const { error: updateError } = await supabase.auth.updateUser({
              data: { role: 'admin' },
            });
            
            if (updateError) throw updateError;
            
            toast.success('User created. Please check email for confirmation.');
          }
        } catch (fallbackError: any) {
          toast.error(fallbackError.message || 'Failed to create admin user');
          throw fallbackError;
        }
      } else {
        toast.error(error.message || 'Failed to create admin user');
        throw error;
      }
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
