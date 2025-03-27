
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Check, UserPlus } from "lucide-react";

interface AdminUserCreatorProps {
  className?: string;
  onSuccess?: () => void;
}

const AdminUserCreator: React.FC<AdminUserCreatorProps> = ({ 
  className = "",
  onSuccess
}) => {
  const [email, setEmail] = useState<string>("admin@example.com");
  const [password, setPassword] = useState<string>("admin123");
  const [confirmPassword, setConfirmPassword] = useState<string>("admin123");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const { createAdminUser } = useAuth();
  
  const handleCreateAdmin = async () => {
    setError(null);
    
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await createAdminUser(email, password);
      toast.success(`Admin user ${email} created successfully`);
      setSuccess(true);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error creating admin:", error);
      setError(error.message || "Failed to create admin user");
      toast.error(error.message || "Failed to create admin user");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={`rounded-xl border p-4 space-y-4 bg-purple-900/40 backdrop-blur-sm border-purple-500/20 shadow-lg shadow-purple-900/20 ${className}`}>
      <div className="flex items-center gap-2">
        <UserPlus className="h-5 w-5 text-purple-400" />
        <h2 className="text-xl font-semibold text-purple-50">Create Admin User</h2>
      </div>
      
      {success ? (
        <div className="flex flex-col items-center justify-center p-4 bg-purple-900/30 rounded-lg border border-purple-500/30">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
            <Check className="h-6 w-6 text-purple-400" />
          </div>
          <p className="text-purple-200 text-center mb-2">Admin user created successfully!</p>
          <p className="text-purple-400/70 text-sm text-center">
            You can now log in with the admin credentials
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block text-purple-200">
                Email Address
              </label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="bg-purple-900/30 border-purple-500/30 text-purple-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block text-purple-200">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••••••"
                className="bg-purple-900/30 border-purple-500/30 text-purple-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block text-purple-200">
                Confirm Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="•••••••••••"
                className="bg-purple-900/30 border-purple-500/30 text-purple-50"
              />
            </div>
          </div>
          
          {error && (
            <div className="text-red-400 text-sm p-2 bg-red-900/20 border border-red-500/20 rounded">
              {error}
            </div>
          )}
          
          <Button 
            onClick={handleCreateAdmin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
          >
            {isLoading ? "Creating Admin..." : "Create Admin User"}
          </Button>
          
          <p className="text-xs text-purple-200/60 text-center">
            This will create an administrator account with full system access.
          </p>
        </>
      )}
    </div>
  );
};

export default AdminUserCreator;
