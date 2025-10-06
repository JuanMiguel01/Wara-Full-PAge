import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import SwipeCard from "@/components/SwipeCard";
import ActionButton from "@/components/ActionButton";
import MatchModal from "@/components/MatchModal";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function DiscoverPage() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<any | null>(null);

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['/api/discovery'],
    queryFn: () => api.getDiscoveryProfiles(20),
  });

  const swipeMutation = useMutation({
    mutationFn: (data: { swipedId: string; direction: 'left' | 'right' }) =>
      api.createSwipe(data),
    onSuccess: (data) => {
      if (data.isMatch && data.match) {
        setMatchedProfile(profiles?.[currentIndex]);
        setShowMatchModal(true);
      }
      queryClient.invalidateQueries({ queryKey: ['/api/discovery'] });
      queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo procesar el swipe",
        variant: "destructive",
      });
    },
  });

  const currentProfile = profiles?.[currentIndex];

  const handleSwipe = async (direction: "left" | "right") => {
    if (!currentProfile) return;

    await swipeMutation.mutateAsync({
      swipedId: currentProfile.id,
      direction,
    });
    
    if (currentIndex < (profiles?.length || 0) - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleAction = (action: "nope" | "like" | "super") => {
    if (action === "nope") {
      handleSwipe("left");
    } else {
      handleSwipe("right");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Buscando perfiles...</p>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-2xl font-bold mb-2">No hay más perfiles</p>
          <p className="text-muted-foreground">Vuelve más tarde para ver nuevas chispas</p>
        </div>
      </div>
    );
  }

  // Calculate age from birthdate
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

  const age = calculateAge(currentProfile.birthdate);
  const photoUrl = currentProfile.photos?.[0]?.url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <img 
            src="https://yt3.googleusercontent.com/-xjgZXaiuPVZ22Sq8qd05QDgLmVmcvUJjMH71G1ZLG1Y3_fvmQLkh_E0bRAPGDGT7ppb2CmsMkc=s120-c-k-c0x00ffffff-no-rj" 
            alt="Chispa Cubana"
            className="w-10 h-10 rounded-lg"
          />
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-brand-gold bg-clip-text text-transparent">
              Chispa Cubana
            </h1>
          </div>
        </div>
        <Button variant="ghost" size="icon" data-testid="button-filters">
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <SwipeCard
          key={currentProfile.id}
          name={currentProfile.name}
          age={age}
          bio={currentProfile.bio || ""}
          distance={currentProfile.distance}
          job={currentProfile.jobTitle || ""}
          interests={currentProfile.interests?.map((i: any) => i.name) || []}
          imageUrl={photoUrl}
          isVerified={currentProfile.isVerified || false}
          onSwipe={handleSwipe}
        />
      </div>

      <div className="flex justify-center gap-4 pb-24 px-6">
        <ActionButton 
          type="nope" 
          onClick={() => !swipeMutation.isPending && handleAction("nope")}
        />
        <ActionButton 
          type="super" 
          onClick={() => !swipeMutation.isPending && handleAction("super")}
        />
        <ActionButton 
          type="like" 
          onClick={() => !swipeMutation.isPending && handleAction("like")}
        />
      </div>

      {showMatchModal && matchedProfile && (
        <MatchModal
          user1Name={currentUser?.name || "Tú"}
          user1Image={currentUser?.photos?.[0]?.url || ""}
          user2Name={matchedProfile.name}
          user2Image={matchedProfile.photos?.[0]?.url || ""}
          onMessage={() => {
            setShowMatchModal(false);
          }}
          onClose={() => setShowMatchModal(false)}
        />
      )}
    </div>
  );
}
