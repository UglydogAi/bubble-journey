
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InvitationCodeGeneratorProps {
  className?: string;
}

const InvitationCodeGenerator: React.FC<InvitationCodeGeneratorProps> = ({ 
  className = "" 
}) => {
  const [count, setCount] = useState<number>(100);
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handleGenerate = async () => {
    if (count <= 0 || count > 1000) {
      toast.error("Please enter a count between 1 and 1000");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Using supabase.rpc with proper type safety
      const { data, error } = await supabase.rpc('generate_invitation_codes', { 
        p_count: count,
        p_notes: notes || null
      } as any); // Using 'as any' to bypass type checking for custom RPC function
      
      if (error) throw error;
      
      toast.success(`Successfully generated ${data} invitation codes`);
    } catch (error: any) {
      console.error("Error generating codes:", error);
      toast.error(error.message || "Failed to generate invitation codes");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={`rounded-xl border p-4 space-y-4 ${className}`}>
      <h2 className="text-xl font-semibold">Generate Invitation Codes</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">
            Number of Codes
          </label>
          <Input
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 0)}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">
            Batch Notes (Optional)
          </label>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Wave 1, VIP Users"
          />
        </div>
      </div>
      
      <Button 
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Generating..." : "Generate Codes"}
      </Button>
      
      <p className="text-xs text-muted-foreground text-center">
        This will generate {count} unique invitation codes with format XXXXX-XXXXX
      </p>
    </div>
  );
};

export default InvitationCodeGenerator;
