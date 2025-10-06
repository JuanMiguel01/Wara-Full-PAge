import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface ChatMessageProps {
  content: string;
  isSent: boolean;
  timestamp: Date;
}

export default function ChatMessage({ content, isSent, timestamp }: ChatMessageProps) {
  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className="flex flex-col max-w-[75%]">
        <div
          className={`px-4 py-3 rounded-2xl ${
            isSent
              ? 'bg-gradient-to-r from-primary to-brand-gold text-white'
              : 'bg-card border border-card-border text-foreground'
          }`}
          data-testid={isSent ? 'message-sent' : 'message-received'}
        >
          <p className="text-sm">{content}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1 px-2">
          {formatDistanceToNow(timestamp, { addSuffix: true, locale: es })}
        </span>
      </div>
    </div>
  );
}
