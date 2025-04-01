
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface InvitationCodeFormProps {
  onSuccess?: () => void;
  className?: string;
}

const InvitationCodeForm: React.FC<InvitationCodeFormProps> = ({ 
  onSuccess,
  className = ""
}) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  // Check if code was already verified
  React.useEffect(() => {
    const inviteVerified = localStorage.getItem('wizInviteVerified');
    if (inviteVerified === 'true' && onSuccess) {
      onSuccess();
    }
  }, [onSuccess]);

  // Format the code as the user types (add hyphen)
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase();
    
    // Remove any non-alphanumeric characters
    value = value.replace(/[^A-Z0-9]/g, '');
    
    // Add hyphen after 5 characters if length > 5
    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5, 10)}`;
    }
    
    setCode(value);
    
    // Reset validation state when user changes input
    if (isValid !== null) {
      setIsValid(null);
    }
  };

  const validateCode = async () => {
    // Remove hyphen for backend processing
    const cleanCode = code.replace(/-/g, '');
    
    if (cleanCode.length !== 10) {
      toast.error("Please enter a valid 10-character invitation code");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // For demo purposes, accept any code format that has 10 alphanumeric characters
      setIsValid(true);
      toast.success("Invitation code is valid! Setting up your account...");
      
      // Store code verification in localStorage
      localStorage.setItem('wizInviteVerified', 'true');
      
      // Allow a small delay for the success message to be seen
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 1500);
    } catch (error: any) {
      console.error("Error validating code:", error);
      toast.error(error.message || "An error occurred while validating the code");
      setIsValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-center">Enter Invitation Code</h2>
        <p className="text-muted-foreground text-center max-w-md mx-auto">
          Enter your exclusive invitation code to access WIZ's private beta
        </p>
      </div>

      <div className="space-y-4">
        <TextField
          label="Invitation Code"
          value={code}
          onChange={handleCodeChange}
          placeholder="XXXXX-XXXXX"
          className={`text-center uppercase tracking-wider ${
            isValid === true ? 'border-green-500 focus:border-green-500' : 
            isValid === false ? 'border-red-500 focus:border-red-500' : ''
          }`}
          maxLength={11} // 10 characters plus hyphen
          disabled={isLoading}
        />
        
        <Button 
          onClick={validateCode}
          className="w-full"
          disabled={code.length < 10 || isLoading}
        >
          {isLoading ? "Validating..." : "Activate"}
        </Button>
      </div>
    </motion.div>
  );
};

export default InvitationCodeForm;
