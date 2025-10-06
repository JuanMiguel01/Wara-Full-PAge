import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MatchesPage() {
  const { currentUser } = useAuth();
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  const { data: matches, isLoading } = useQuery({
    queryKey: ['/api/matches'],
    queryFn: () => api.getMatches(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-6">
        <h1 className="text-3xl font-extrabold mb-2">
          <span className="bg-gradient-to-r from-primary to-brand-gold bg-clip-text text-transparent">
            Matches
          </span>
        </h1>
        <p className="text-muted-foreground mb-6">
          Tienes {matches?.length || 0} matches
        </p>

        {matches && matches.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {matches.map((match: any) => {
              const otherUser = match.otherUser;
              const photoUrl = otherUser?.photos?.[0]?.url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330";
              
              const calculateAge = (birthdate: Date) => {
                const today = new Date();
                const birth = new Date(birthdate);
                let age = today.getFullYear() - birth.getFullYear();
                const monthDiff = today.getMonth() - birth.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                  age--;
                }
                return age;
              };

              const age = otherUser ? calculateAge(otherUser.birthdate) : 0;

              return (
                <div
                  key={match.id}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden backdrop-blur-xl bg-card/90 border border-card-border hover-elevate active-elevate-2 cursor-pointer"
                  onClick={() => setSelectedMatchId(match.id)}
                  data-testid={`card-match-${match.id}`}
                >
                  <img 
                    src={photoUrl}
                    alt={otherUser?.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {otherUser?.name}, {age}
                      </h3>
                      {otherUser?.isVerified && (
                        <Badge variant="secondary" className="bg-blue-500/80 text-white border-0">
                          ✓
                        </Badge>
                      )}
                    </div>
                    
                    {otherUser?.jobTitle && (
                      <p className="text-sm text-white/90 mb-2">
                        {otherUser.jobTitle}
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-white" />
                      <span className="text-sm text-white">
                        Enviar mensaje
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No tienes matches todavía</h3>
            <p className="text-muted-foreground">
              Empieza a deslizar para encontrar tu chispa
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
