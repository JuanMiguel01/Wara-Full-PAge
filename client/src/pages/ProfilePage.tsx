import { Settings, Edit, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import VerifiedBadge from "@/components/VerifiedBadge";
import InterestTag from "@/components/InterestTag";

import profile4 from '@assets/generated_images/Cuban_man_garden_portrait_3aaa4a1a.png';

// TODO: Remove mock data - replace with real user data
const mockUserProfile = {
  name: "Roberto",
  age: 31,
  bio: "Chef profesional apasionado por la fusión de sabores cubanos. Me encanta viajar y descubrir nuevos lugares.",
  job: "Chef",
  company: "La Cocina Cubana",
  location: "Miami, FL",
  interests: ["Cocina", "Viajes", "Vino", "Gastronomía", "Música", "Arte"],
  imageUrl: profile4,
  isVerified: true,
  photos: [profile4]
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative">
        <div className="h-80 w-full overflow-hidden">
          <img 
            src={mockUserProfile.imageUrl} 
            alt={mockUserProfile.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="absolute top-4 right-4 flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="backdrop-blur-md bg-black/20"
            data-testid="button-settings"
          >
            <Settings className="w-5 h-5 text-white" />
          </Button>
        </div>

        <div className="absolute bottom-4 left-6">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-4xl font-bold text-white" data-testid="text-user-name">
              {mockUserProfile.name}, {mockUserProfile.age}
            </h1>
            {mockUserProfile.isVerified && <VerifiedBadge size="md" />}
          </div>
          <p className="text-white/90" data-testid="text-user-location">{mockUserProfile.location}</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Button 
          className="w-full" 
          variant="outline"
          data-testid="button-edit-profile"
        >
          <Edit className="w-4 h-4 mr-2" />
          Editar Perfil
        </Button>

        <div className="backdrop-blur-xl bg-card/50 border border-card-border rounded-xl p-6">
          <h2 className="font-bold text-lg mb-2">Sobre mí</h2>
          <p className="text-muted-foreground mb-4" data-testid="text-user-bio">
            {mockUserProfile.bio}
          </p>

          <div className="space-y-3">
            <div>
              <span className="font-semibold">Trabajo: </span>
              <span className="text-muted-foreground" data-testid="text-user-job">
                {mockUserProfile.job} en {mockUserProfile.company}
              </span>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-card/50 border border-card-border rounded-xl p-6">
          <h2 className="font-bold text-lg mb-4">Mis Intereses</h2>
          <div className="flex flex-wrap gap-2">
            {mockUserProfile.interests.map((interest, idx) => (
              <InterestTag key={idx} label={interest} />
            ))}
          </div>
        </div>

        <div className="backdrop-blur-xl bg-card/50 border border-card-border rounded-xl p-6">
          <h2 className="font-bold text-lg mb-4">Estadísticas</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">42</p>
              <p className="text-sm text-muted-foreground">Matches</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-brand-gold">156</p>
              <p className="text-sm text-muted-foreground">Likes dados</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-chart-3">89</p>
              <p className="text-sm text-muted-foreground">Te gustan</p>
            </div>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full text-destructive border-destructive hover:bg-destructive/10"
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
