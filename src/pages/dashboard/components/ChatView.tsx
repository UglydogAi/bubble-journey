
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Phone, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
}

export function ChatView() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Message[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    // Load profile image if exists
    const savedImage = localStorage.getItem('wizProfileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
    
    // Retrieve past conversations from localStorage
    const loadConversations = () => {
      const storedConversations = localStorage.getItem('wizChatHistory');
      if (storedConversations) {
        try {
          const parsedConversations = JSON.parse(storedConversations);
          setConversations(parsedConversations);
        } catch (error) {
          console.error("Error parsing chat history:", error);
        }
      }
    };
    
    loadConversations();
    
    // Listen for changes to chat history
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wizChatHistory') {
        loadConversations();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const startNewCall = () => {
    navigate('/call/chat');
  };

  // Group messages by date
  const groupedConversations: Record<string, Message[]> = {};
  conversations.forEach(message => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!groupedConversations[date]) {
      groupedConversations[date] = [];
    }
    groupedConversations[date].push(message);
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Chat History</h2>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white"
          onClick={startNewCall}
        >
          <Phone className="mr-2 h-4 w-4" />
          Call Wiz
        </Button>
      </div>

      {Object.keys(groupedConversations).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedConversations).map(([date, messages], dateIndex) => (
            <div key={date} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/30" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-3 text-sm text-muted-foreground">
                    {date}
                  </span>
                </div>
              </div>

              {messages.map((message, messageIndex) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: messageIndex * 0.1 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-3`}
                >
                  <div className={`flex gap-3 max-w-[75%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className="h-8 w-8">
                      {message.isUser ? (
                        profileImage ? (
                          <AvatarImage src={profileImage} alt="You" />
                        ) : (
                          <AvatarFallback>You</AvatarFallback>
                        )
                      ) : (
                        <AvatarImage 
                          src="/lovable-uploads/db35f051-e13b-4656-92f1-843b07d7584b.png"
                          alt="Wiz"
                        />
                      )}
                    </Avatar>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.isUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-medium">No conversations yet</h3>
              <p className="text-muted-foreground mt-1">
                Start your first conversation with Wiz
              </p>
            </div>
            <Button 
              className="mt-2 bg-gradient-to-r from-purple-600 to-indigo-600"
              onClick={startNewCall}
            >
              Start a Call
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
