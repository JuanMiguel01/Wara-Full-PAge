import { MessageCircle } from "lucide-react";
import VerifiedBadge from "./VerifiedBadge";

interface MatchCardProps {
  name: string;
  age: number;
  imageUrl: string;
  isVerified?: boolean;
  hasUnread?: boolean;
  onClick?: () => void;
}

export default function MatchCard({ 
  name, 
  age, 
  imageUrl, 
  isVerified = false,
  hasUnread = false,
  onClick 
}: MatchCardProps) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center gap-2 group"
      data-testid={`card-match-${name.toLowerCase()}`}
    >
      <div className="relative">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/50 group-hover:border-primary transition-colors">
          <img 
            src={imageUrl} 
            alt={`${name}, ${age}`}
            className="w-full h-full object-cover"
          />
        </div>
        
        {isVerified && (
          <div className="absolute -top-1 -right-1">
            <VerifiedBadge size="sm" />
          </div>
        )}
        
        {hasUnread && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <MessageCircle className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      
      <span className="text-sm font-semibold text-foreground" data-testid="text-match-name">
        {name}, {age}
      </span>
    </button>
  );
}
