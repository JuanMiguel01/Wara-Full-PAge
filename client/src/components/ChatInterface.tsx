import { useState } from "react";
import { ArrowLeft, Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatMessage from "./ChatMessage";
import VerifiedBadge from "./VerifiedBadge";

interface Message {
  id: string;
  content: string;
  isSent: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  matchName: string;
  matchAge: number;
  matchImage: string;
  isVerified?: boolean;
  initialMessages?: Message[];
  onBack?: () => void;
}

export default function ChatInterface({
  matchName,
  matchAge,
  matchImage,
  isVerified = false,
  initialMessages = [],
  onBack
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      isSent: true,
      timestamp: new Date()
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
    console.log('Message sent:', newMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="backdrop-blur-xl bg-card/80 border-b border-card-border p-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img src={matchImage} alt={matchName} className="w-full h-full object-cover" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold" data-testid="text-chat-name">
              {matchName}, {matchAge}
            </h2>
            {isVerified && <VerifiedBadge size="sm" />}
          </div>
          <p className="text-sm text-muted-foreground">En línea</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            isSent={message.isSent}
            timestamp={message.timestamp}
          />
        ))}
      </div>

      <div className="backdrop-blur-xl bg-card/80 border-t border-card-border p-4">
        <div className="flex gap-2 items-center">
          <Button variant="ghost" size="icon" data-testid="button-emoji">
            <Smile className="w-5 h-5" />
          </Button>
          
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            className="flex-1"
            data-testid="input-message"
          />
          
          <Button
            onClick={handleSend}
            size="icon"
            disabled={!newMessage.trim()}
            data-testid="button-send"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
