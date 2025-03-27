
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, UserPlus, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AdminUserCreatorProps {
  className?: string;
}

const AdminUserCreator: React.FC<AdminUserCreatorProps> = ({ className }) => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createAdminUser } = useAuth();

  // Function to check if the admin user already exists
  const checkAdminExists = async (email: string) => {
    try {
      // Try signing in with the credentials to see if they exist
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // If there's no error, the user exists and credentials are valid
      if (!error) {
        console.log("Admin user already exists and credentials are valid");
        setIsCreated(true);
        toast.success("Admin user verified!");
        
        // Sign out immediately since we're just checking
        await supabase.auth.signOut();
        return true;
      }
      
      // If there's an error but it's not about invalid credentials, log it
      if (error && error.message !== "Invalid login credentials") {
        console.error("Error checking admin:", error);
      }
      
      return false;
    } catch (err) {
      console.error("Error checking admin existence:", err);
      return false;
    }
  };

  // Auto-create admin on component mount
  useEffect(() => {
    const createAdmin = async () => {
      if (!isCreated) {
        setIsLoading(true);
        setError(null);
        
        try {
          // First check if admin already exists with valid credentials
          const adminExists = await checkAdminExists(email);
          
          if (adminExists) {
            setIsCreated(true);
            setIsLoading(false);
            return;
          }
          
          // If not, try to create the admin
          await createAdminUser(email, password);
          console.log("Admin user created automatically!");
          toast.success("Admin user created automatically!");
          setIsCreated(true);
        } catch (error) {
          console.error('Error auto-creating admin user:', error);
          // Don't show error toast for auto-creation
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError("Failed to auto-create admin user");
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    createAdmin();
  }, [createAdminUser, email, password, isCreated]);

  const handleCreateAdmin = async () => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await createAdminUser(email, password);
      toast.success("Admin user created successfully!");
      setIsCreated(true);
    } catch (error) {
      console.error('Error creating admin user:', error);
      if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setError("Failed to create admin user");
        toast.error("Failed to create admin user");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`${className} overflow-hidden border-orange-400/30 shadow-lg shadow-orange-400/10`}>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/5 pointer-events-none" />
        
        <CardHeader className="relative">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mr-2">
              <Shield className="h-4 w-4 text-amber-500" />
            </div>
            <CardTitle className="text-xl text-amber-50">Admin Setup</CardTitle>
          </div>
          <CardDescription className="text-amber-200/70">
            {isCreated ? 
              "Admin account has been created successfully" : 
              "Create the system administrator account with full privileges"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 relative">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-red-400 font-medium">Error</p>
                <p className="text-red-400/70 text-sm">{error}</p>
                <p className="text-amber-400/70 text-sm mt-2">
                  This is the admin setup page. For standard user login, please visit the <a href="/auth" className="text-amber-400 hover:underline">Auth page</a>
                </p>
              </div>
            </div>
          )}
          
          {isCreated ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-green-400 font-medium">Admin user created</p>
                <p className="text-green-400/70 text-sm">Email: {email}</p>
                <p className="text-amber-200/70 text-sm mt-2">
                  You can now log in with these credentials on the <a href="/auth" className="text-amber-400 hover:underline">Authentication page</a>
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-amber-200">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="bg-amber-900/20 border-amber-500/30 focus:border-amber-500/50 text-amber-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-amber-200">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Strong password"
                  className="bg-amber-900/20 border-amber-500/30 focus:border-amber-500/50 text-amber-50"
                />
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="relative">
          {!isCreated && (
            <Button 
              onClick={handleCreateAdmin} 
              disabled={isLoading || !email || !password}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-amber-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Admin User
                </>
              )}
            </Button>
          )}
          {isCreated && (
            <div className="w-full flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                onClick={() => {
                  setIsCreated(false);
                  setEmail('admin@example.com');
                  setPassword('admin123');
                  setError(null);
                }}
              >
                Create Another Admin
              </Button>
              
              <Button 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-amber-50"
                asChild
              >
                <a href="/auth">
                  <Shield className="mr-2 h-4 w-4" />
                  Go to Login Page
                </a>
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AdminUserCreator;
