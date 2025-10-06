import { ArrowLeft, MapPin, Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import VerifiedBadge from "./VerifiedBadge";
import InterestTag from "./InterestTag";
import ActionButton from "./ActionButton";

interface ProfileViewProps {
  name: string;
  age: number;
  bio: string;
  distance: number;
  job?: string;
  company?: string;
  education?: string;
  interests: string[];
  images: string[];
  isVerified?: boolean;
  onBack?: () => void;
  onNope?: () => void;
  onLike?: () => void;
  onSuperLike?: () => void;
}

export default function ProfileView({
  name,
  age,
  bio,
  distance,
  job,
  company,
  education,
  interests,
  images,
  isVerified = false,
  onBack,
  onNope,
  onLike,
  onSuperLike
}: ProfileViewProps) {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="relative">
        <div className="h-[60vh] w-full overflow-hidden">
          <img 
            src={images[0]} 
            alt={`${name}, ${age}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 backdrop-blur-md bg-black/20"
          onClick={onBack}
          data-testid="button-back-profile"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Button>

        {isVerified && (
          <div className="absolute top-4 right-4">
            <VerifiedBadge size="md" />
          </div>
        )}
      </div>

      <div className="px-6 -mt-12 relative z-10">
        <div className="backdrop-blur-xl bg-card/90 border border-card-border rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-1" data-testid="text-profile-name">
                {name}, {age}
              </h1>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span data-testid="text-profile-distance">{distance} km de distancia</span>
              </div>
            </div>
          </div>

          {job && (
            <div className="flex items-center gap-2 text-sm mb-2">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <span data-testid="text-profile-job">{job}{company && ` en ${company}`}</span>
            </div>
          )}

          {education && (
            <div className="flex items-center gap-2 text-sm mb-4">
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
              <span data-testid="text-profile-education">{education}</span>
            </div>
          )}

          <div className="border-t border-border pt-4 mb-4">
            <h3 className="font-semibold mb-2">Sobre mí</h3>
            <p className="text-muted-foreground" data-testid="text-profile-bio">{bio}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Intereses</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, idx) => (
                <InterestTag key={idx} label={interest} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-20 left-0 right-0 flex justify-center gap-4 px-6">
        <ActionButton type="nope" onClick={onNope} />
        <ActionButton type="super" onClick={onSuperLike} />
        <ActionButton type="like" onClick={onLike} />
      </div>
    </div>
  );
}
