
import React from "react";
import { UserRound, Settings, CreditCard, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  return (
    <div className="w-64 fixed left-0 top-16 bottom-0 bg-sidebar-background/50 backdrop-blur-xl border-r border-sidebar-border z-50">
      <div className="flex items-center gap-3 m-4 p-3 rounded-lg bg-sidebar-accent border border-sidebar-border">
        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-sidebar-ring/30">
          <img 
            src="/lovable-uploads/ce8e10ec-31c6-4d22-8be9-25e4d50d8206.png"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-semibold text-sidebar-foreground">Legend</p>
          <p className="text-sm text-sidebar-foreground/70">Premium Member</p>
        </div>
      </div>

      <nav className="space-y-2 p-4">
        {["Profile", "Settings", "Purchase", "Community"].map((item, index) => (
          <Button
            key={item}
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors duration-300"
          >
            {[<UserRound />, <Settings />, <CreditCard />, <Users />][index]}
            {item}
          </Button>
        ))}
      </nav>
    </div>
  );
}
