import { useState } from "react";
import SwipeCard from "@/components/SwipeCard";
import ActionButton from "@/components/ActionButton";
import MatchModal from "@/components/MatchModal";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

import profile1 from '@assets/generated_images/Young_Cuban_woman_portrait_87eb5c89.png';
import profile2 from '@assets/generated_images/Young_Cuban_man_portrait_c55b3471.png';
import profile3 from '@assets/generated_images/Cuban_woman_Havana_portrait_cb4e6f84.png';
import profile4 from '@assets/generated_images/Cuban_man_garden_portrait_3aaa4a1a.png';

// TODO: Remove mock data - replace with real API calls
const mockProfiles = [
  {
    id: '1',
    name: "María",
    age: 26,
    bio: "Me encanta bailar salsa, cocinar y disfrutar de un buen mojito en la playa. Buscando alguien con quien compartir aventuras.",
    distance: 3.5,
    job: "Enfermera",
    interests: ["Salsa", "Cocina", "Playa", "Música", "Viajes"],
    imageUrl: profile1,
    isVerified: true
  },
  {
    id: '2',
    name: "Carlos",
    age: 28,
    bio: "Ingeniero de software. Me gusta la música, el béisbol y conocer gente nueva. Fan de la comida cubana tradicional.",
    distance: 5.2,
    job: "Ingeniero",
    interests: ["Tecnología", "Béisbol", "Música", "Cocina"],
    imageUrl: profile2,
    isVerified: true
  },
  {
    id: '3',
    name: "Ana",
    age: 29,
    bio: "Artista y diseñadora. Amo el arte, la cultura y las largas conversaciones sobre todo y nada.",
    distance: 2.1,
    job: "Diseñadora",
    interests: ["Arte", "Diseño", "Fotografía", "Viajes", "Café"],
    imageUrl: profile3,
    isVerified: false
  },
  {
    id: '4',
    name: "Roberto",
    age: 31,
    bio: "Chef profesional apasionado por la fusión de sabores cubanos. Me encanta viajar y descubrir nuevos lugares.",
    distance: 7.8,
    job: "Chef",
    interests: ["Cocina", "Viajes", "Vino", "Gastronomía"],
    imageUrl: profile4,
    isVerified: true
  }
];

export default function DiscoverPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<typeof mockProfiles[0] | null>(null);

  const currentProfile = mockProfiles[currentIndex];

  const handleSwipe = (direction: "left" | "right") => {
    console.log(`Swiped ${direction} on ${currentProfile?.name}`);
    
    // TODO: Remove mock - Simulate match on right swipe (33% chance)
    if (direction === "right" && Math.random() > 0.66 && currentProfile) {
      setMatchedUser(currentProfile);
      setShowMatchModal(true);
    }
    
    // Move to next profile
    if (currentIndex < mockProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back for demo
    }
  };

  const handleAction = (action: "nope" | "like" | "super") => {
    console.log(`${action} button clicked`);
    if (action === "nope") {
      handleSwipe("left");
    } else {
      handleSwipe("right");
    }
  };

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
          age={currentProfile.age}
          bio={currentProfile.bio}
          distance={currentProfile.distance}
          job={currentProfile.job}
          interests={currentProfile.interests}
          imageUrl={currentProfile.imageUrl}
          isVerified={currentProfile.isVerified}
          onSwipe={handleSwipe}
        />
      </div>

      <div className="flex justify-center gap-4 pb-24 px-6">
        <ActionButton type="nope" onClick={() => handleAction("nope")} />
        <ActionButton type="super" onClick={() => handleAction("super")} />
        <ActionButton type="like" onClick={() => handleAction("like")} />
      </div>

      {showMatchModal && matchedUser && (
        <MatchModal
          user1Name="Tú"
          user1Image={profile4}
          user2Name={matchedUser.name}
          user2Image={matchedUser.imageUrl}
          onMessage={() => {
            console.log('Navigate to messages');
            setShowMatchModal(false);
          }}
          onClose={() => setShowMatchModal(false)}
        />
      )}
    </div>
  );
}
