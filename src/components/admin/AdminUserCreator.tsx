
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, UserPlus, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface AdminUserCreatorProps {
  className?: string;
}

const AdminUserCreator: React.FC<AdminUserCreatorProps> = ({ className }) => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('bankai33');
  const [isLoading, setIsLoading] = useState(false);
  const { createAdminUser } = useAuth();

  const handleCreateAdmin = async () => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    
    setIsLoading(true);
    try {
      await createAdminUser(email, password);
      toast.success("Admin user created successfully!");
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
      <Card className={`${className} overflow-hidden border border-primary/20 backdrop-blur-sm`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background/0 pointer-events-none" />
        
        <CardHeader className="relative">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-xl">Create Admin User</CardTitle>
          </div>
          <CardDescription>
            Create a new admin user with full system privileges
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 relative">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="bg-background/40 border-primary/20 focus:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Strong password"
              className="bg-background/40 border-primary/20 focus:border-primary/50"
            />
          </div>
        </CardContent>
        
        <CardFooter className="relative">
          <Button 
            onClick={handleCreateAdmin} 
            disabled={isLoading || !email || !password}
            className="w-full bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90"
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
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AdminUserCreator;
