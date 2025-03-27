
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, UserPlus, Shield, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface AdminUserCreatorProps {
  className?: string;
}

const AdminUserCreator: React.FC<AdminUserCreatorProps> = ({ className }) => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const { createAdminUser } = useAuth();

  // Auto-create admin on component mount
  useEffect(() => {
    const createAdmin = async () => {
      if (!isCreated) {
        setIsLoading(true);
        try {
          await createAdminUser(email, password);
          toast.success("Admin user created automatically!");
          setIsCreated(true);
        } catch (error) {
          console.error('Error auto-creating admin user:', error);
          // Don't show error toast for auto-creation
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
    try {
      await createAdminUser(email, password);
      toast.success("Admin user created successfully!");
      setIsCreated(true);
    } catch (error) {
      console.error('Error creating admin user:', error);
      toast.error(error instanceof Error ? error.message : "Failed to create admin user");
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
            <CardTitle className="text-xl text-amber-50">Admin Access</CardTitle>
          </div>
          <CardDescription className="text-amber-200/70">
            {isCreated ? 
              "Admin account has been created automatically" : 
              "Create a new admin user with full system privileges"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 relative">
          {isCreated ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-green-400 font-medium">Admin user created</p>
                <p className="text-green-400/70 text-sm">Email: {email}</p>
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
            <Button
              variant="outline"
              className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              onClick={() => {
                setIsCreated(false);
                setEmail('admin@example.com');
                setPassword('admin123');
              }}
            >
              Reset Form
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AdminUserCreator;
