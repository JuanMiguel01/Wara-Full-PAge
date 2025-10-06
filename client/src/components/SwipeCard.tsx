import { MapPin, Briefcase } from "lucide-react";
import { useState } from "react";
import VerifiedBadge from "./VerifiedBadge";
import InterestTag from "./InterestTag";

interface SwipeCardProps {
  name: string;
  age: number;
  bio: string;
  distance: number;
  job?: string;
  interests: string[];
  imageUrl: string;
  isVerified?: boolean;
  onSwipe?: (direction: "left" | "right") => void;
}

export default function SwipeCard({
  name,
  age,
  bio,
  distance,
  job,
  interests,
  imageUrl,
  isVerified = false,
  onSwipe
}: SwipeCardProps) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const card = (e.target as HTMLElement).closest('.swipe-card');
    if (card) {
      const rect = card.getBoundingClientRect();
      const offset = clientX - rect.left - rect.width / 2;
      setDragOffset(offset);
    }
  };

  const handleDragEnd = () => {
    if (Math.abs(dragOffset) > 100) {
      const direction = dragOffset > 0 ? "right" : "left";
      onSwipe?.(direction);
      console.log(`Swiped ${direction} on ${name}`);
    }
    setDragOffset(0);
    setIsDragging(false);
  };

  const rotation = dragOffset / 20;
  const opacity = Math.max(0, 1 - Math.abs(dragOffset) / 300);

  return (
    <div 
      className="swipe-card relative w-full max-w-md h-[600px] cursor-grab active:cursor-grabbing"
      style={{
        transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
        opacity,
        transition: isDragging ? 'none' : 'all 0.3s ease-out'
      }}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
      data-testid="card-profile"
    >
      <div className="relative w-full h-full rounded-2xl overflow-hidden backdrop-blur-xl bg-card/50 border border-white/10">
        <img 
          src={imageUrl} 
          alt={`${name}, ${age}`}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {isVerified && (
          <div className="absolute top-4 right-4">
            <VerifiedBadge size="md" />
          </div>
        )}

        {dragOffset > 50 && (
          <div className="absolute top-8 left-8 text-6xl font-bold text-primary rotate-[-20deg]">
            ME GUSTA
          </div>
        )}

        {dragOffset < -50 && (
          <div className="absolute top-8 right-8 text-6xl font-bold text-muted-foreground rotate-[20deg]">
            NOPE
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-3xl font-bold" data-testid="text-profile-name">{name}, {age}</h2>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-white/80 mb-3">
            <div className="flex items-center gap-1" data-testid="text-distance">
              <MapPin className="w-4 h-4" />
              <span>{distance} km de distancia</span>
            </div>
            {job && (
              <div className="flex items-center gap-1" data-testid="text-job">
                <Briefcase className="w-4 h-4" />
                <span>{job}</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-white/90 mb-3 line-clamp-2" data-testid="text-bio">{bio}</p>
          
          <div className="flex flex-wrap gap-2">
            {interests.slice(0, 3).map((interest, idx) => (
              <InterestTag key={idx} label={interest} />
            ))}
            {interests.length > 3 && (
              <span className="text-sm text-white/60">+{interests.length - 3} más</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
