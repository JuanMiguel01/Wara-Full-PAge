import { Heart, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MatchModalProps {
  user1Name: string;
  user1Image: string;
  user2Name: string;
  user2Image: string;
  onMessage?: () => void;
  onClose?: () => void;
}

export default function MatchModal({
  user1Name,
  user1Image,
  user2Name,
  user2Image,
  onMessage,
  onClose
}: MatchModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-md w-full backdrop-blur-xl bg-card/90 border border-white/10 rounded-2xl p-8 text-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={onClose}
          data-testid="button-close-match"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="mb-6">
          <h1 
            className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-primary to-brand-gold bg-clip-text text-transparent"
            data-testid="text-match-title"
          >
            ¡Es un Match!
          </h1>
          <p className="text-muted-foreground">
            A {user1Name} y {user2Name} les gustaron mutuamente
          </p>
        </div>

        <div className="flex justify-center items-center gap-4 mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
              <img src={user1Image} alt={user1Name} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-brand-gold flex items-center justify-center">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
          </div>

          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
              <img src={user2Image} alt={user2Name} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onMessage}
            className="w-full bg-gradient-to-r from-primary to-brand-gold hover:opacity-90"
            size="lg"
            data-testid="button-send-message"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Enviar Mensaje
          </Button>
          
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
            data-testid="button-keep-swiping"
          >
            Seguir Deslizando
          </Button>
        </div>
      </div>
    </div>
  );
}
