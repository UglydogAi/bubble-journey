
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Bell, 
  User, 
  Calendar, 
  CheckCheck,
  UserPlus,
  ShieldAlert,
  KeyRound
} from "lucide-react";

interface Notification {
  id: string;
  type: 'invite' | 'security' | 'system';
  title: string;
  description: string;
  time: string;
  read: boolean;
  icon: React.ReactNode;
}

interface AdminNotificationsPanelProps {
  onClose: () => void;
}

const AdminNotificationsPanel: React.FC<AdminNotificationsPanelProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'invite',
      title: 'New User Registered',
      description: 'john.doe@example.com used invitation code WIZ-123-456',
      time: '2 minutes ago',
      read: false,
      icon: <UserPlus className="h-5 w-5 text-green-400" />
    },
    {
      id: '2',
      type: 'security',
      title: 'Admin Login Alert',
      description: 'New admin login from unknown device',
      time: '1 hour ago',
      read: false,
      icon: <ShieldAlert className="h-5 w-5 text-amber-400" />
    },
    {
      id: '3',
      type: 'invite',
      title: 'New User Registered',
      description: 'anna.smith@example.com used invitation code WIZ-789-012',
      time: '3 hours ago',
      read: true,
      icon: <UserPlus className="h-5 w-5 text-green-400" />
    },
    {
      id: '4',
      type: 'system',
      title: 'API Key Generated',
      description: 'New API key generated for admin access',
      time: '1 day ago',
      read: true,
      icon: <KeyRound className="h-5 w-5 text-blue-400" />
    }
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({
        ...notification,
        read: true
      }))
    );
    toast.success("All notifications marked as read");
  };
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  useEffect(() => {
    // Simulate receiving a new notification after 5 seconds
    const timer = setTimeout(() => {
      const newNotification = {
        id: Date.now().toString(),
        type: 'invite' as const,
        title: 'New User Registered',
        description: 'alex.jones@example.com used invitation code WIZ-456-789',
        time: 'Just now',
        read: false,
        icon: <UserPlus className="h-5 w-5 text-green-400" />
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      toast.success("New user registered", {
        description: "alex.jones@example.com joined using an invitation code",
        icon: <UserPlus className="h-4 w-4 text-green-500" />
      });
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Card className="bg-[#1E293B]/70 border-purple-500/20 shadow-lg w-full max-h-[80vh] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-400" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-purple-500 text-white text-xs">
                {unreadCount} new
              </Badge>
            )}
          </CardTitle>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="text-gray-400 hover:text-white"
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="overflow-y-auto flex-grow">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No notifications yet
          </div>
        ) : (
          <div className="space-y-1">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => markAsRead(notification.id)}
              >
                <div className={`p-3 rounded-lg transition-colors ${notification.read ? 'bg-transparent' : 'bg-purple-900/20'} hover:bg-[#121927]/50 cursor-pointer`}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#121927]/70 flex items-center justify-center shrink-0 mt-1">
                      {notification.icon}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h4 className={`font-medium ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{notification.description}</p>
                    </div>
                    
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0 mt-2"></div>
                    )}
                  </div>
                </div>
                {index < notifications.length - 1 && <Separator className="bg-gray-800/50" />}
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminNotificationsPanel;
