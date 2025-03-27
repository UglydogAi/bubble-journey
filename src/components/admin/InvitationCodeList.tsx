
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Copy, Download, RefreshCw, Search } from "lucide-react";

// Define the InvitationCode type to match the table structure
interface InvitationCode {
  id: string;
  code: string;
  is_used: boolean;
  created_at: string;
  sent_to_email: string | null;
  used_by_user_id: string | null;
  used_at: string | null;
  notes: string | null;
}

interface InvitationCodeListProps {
  className?: string;
}

const InvitationCodeList: React.FC<InvitationCodeListProps> = ({ 
  className = "" 
}) => {
  const [codes, setCodes] = useState<InvitationCode[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<"all" | "used" | "unused">("unused");
  
  const fetchCodes = async () => {
    setIsLoading(true);
    
    try {
      let query = supabase
        .from('invitation_codes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (filter === "used") {
        query = query.eq('is_used', true);
      } else if (filter === "unused") {
        query = query.eq('is_used', false);
      }
      
      if (searchTerm) {
        query = query.ilike('code', `%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setCodes(data as InvitationCode[]);
    } catch (error: any) {
      console.error("Error fetching invitation codes:", error);
      toast.error("Failed to load invitation codes");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCodes();
  }, [filter]);
  
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };
  
  const exportCodes = () => {
    const unusedCodes = codes.filter(code => !code.is_used);
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Code,Created At,Notes\n"
      + unusedCodes.map(code => 
          `${code.code},${new Date(code.created_at).toLocaleDateString()},${code.notes || ""}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `invitation-codes-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exported ${unusedCodes.length} unused codes`);
  };
  
  return (
    <div className={`rounded-xl border p-4 space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Invitation Codes</h2>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={exportCodes}
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchCodes}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "unused" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("unused")}
          >
            Unused
          </Button>
          <Button
            variant={filter === "used" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("used")}
          >
            Used
          </Button>
        </div>
        
        <Button
          size="sm"
          onClick={() => {
            fetchCodes();
          }}
          disabled={isLoading}
        >
          Search
        </Button>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Code</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Created</th>
                <th className="px-4 py-3 text-left font-medium">Notes</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-center">
                    Loading...
                  </td>
                </tr>
              ) : codes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-center">
                    No invitation codes found
                  </td>
                </tr>
              ) : (
                codes.map((code) => (
                  <tr key={code.id} className={code.is_used ? "bg-muted/20" : ""}>
                    <td className="px-4 py-3 font-mono">{code.code}</td>
                    <td className="px-4 py-3">
                      <span 
                        className={`inline-block px-2 py-1 rounded-full text-xs ${
                          code.is_used 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        }`}
                      >
                        {code.is_used ? 'Used' : 'Available'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(code.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 max-w-[200px] truncate">
                      {code.notes || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(code.code)}
                        disabled={code.is_used}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Showing up to 100 invitation codes. Use the search to find specific codes.
      </p>
    </div>
  );
};

export default InvitationCodeList;
