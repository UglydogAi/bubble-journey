
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, UserPlus } from "lucide-react";

interface AdminUserCreatorProps {
  className?: string;
}

const AdminUserCreator: React.FC<AdminUserCreatorProps> = ({ className }) => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('bankai33');
  const [isLoading, setIsLoading] = useState(false);
  const { createAdminUser } = useAuth();

  const handleCreateAdmin = async () => {
    if (!email || !password) return;
    
    setIsLoading(true);
    try {
      await createAdminUser(email, password);
    } catch (error) {
      console.error('Error creating admin user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">Create Admin User</CardTitle>
        <CardDescription>
          Create a new admin user with full system privileges
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="admin-email">Email</Label>
          <Input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
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
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleCreateAdmin} 
          disabled={isLoading || !email || !password}
          className="w-full"
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
  );
};

export default AdminUserCreator;
