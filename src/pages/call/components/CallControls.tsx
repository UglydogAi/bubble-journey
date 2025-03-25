
import React from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare } from "lucide-react";

interface CallControlsProps {
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  isVideoOn: boolean;
  setIsVideoOn: (videoOn: boolean) => void;
  onEndCall: () => void;
  toggleChat: () => void;
}

const CallControls: React.FC<CallControlsProps> = ({
  isMuted,
  setIsMuted,
  isVideoOn,
  setIsVideoOn,
  onEndCall,
  toggleChat
}) => {
  return (
    <div className="flex space-x-4">
      {/* Mute button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="w-12 h-12 rounded-full bg-[#1E293B] hover:bg-[#2D3748] flex items-center justify-center transition-colors"
      >
        {isMuted ? (
          <MicOff className="w-5 h-5 text-red-400" />
        ) : (
          <Mic className="w-5 h-5 text-white" />
        )}
      </button>
      
      {/* Video button */}
      <button
        onClick={() => setIsVideoOn(!isVideoOn)}
        className="w-12 h-12 rounded-full bg-[#1E293B] hover:bg-[#2D3748] flex items-center justify-center transition-colors"
      >
        {isVideoOn ? (
          <Video className="w-5 h-5 text-white" />
        ) : (
          <VideoOff className="w-5 h-5 text-red-400" />
        )}
      </button>
      
      {/* End call button */}
      <button
        onClick={onEndCall}
        className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
      >
        <PhoneOff className="w-5 h-5 text-white" />
      </button>
      
      {/* Toggle chat */}
      <button
        onClick={toggleChat}
        className="w-12 h-12 rounded-full bg-[#1E293B] hover:bg-[#2D3748] flex items-center justify-center transition-colors"
      >
        <MessageSquare className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};

export default CallControls;
