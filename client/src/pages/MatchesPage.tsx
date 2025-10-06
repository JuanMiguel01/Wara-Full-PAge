import MatchCard from "@/components/MatchCard";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import profile1 from '@assets/generated_images/Young_Cuban_woman_portrait_87eb5c89.png';
import profile2 from '@assets/generated_images/Young_Cuban_man_portrait_c55b3471.png';
import profile3 from '@assets/generated_images/Cuban_woman_Havana_portrait_cb4e6f84.png';
import profile4 from '@assets/generated_images/Cuban_man_garden_portrait_3aaa4a1a.png';

// TODO: Remove mock data
const mockMatches = [
  {
    id: '1',
    name: "María",
    age: 26,
    imageUrl: profile1,
    isVerified: true,
    hasUnread: true
  },
  {
    id: '2',
    name: "Carlos",
    age: 28,
    imageUrl: profile2,
    isVerified: true,
    hasUnread: false
  },
  {
    id: '3',
    name: "Ana",
    age: 29,
    imageUrl: profile3,
    isVerified: false,
    hasUnread: true
  },
  {
    id: '4',
    name: "Roberto",
    age: 31,
    imageUrl: profile4,
    isVerified: true,
    hasUnread: false
  },
  {
    id: '5',
    name: "Laura",
    age: 27,
    imageUrl: profile1,
    isVerified: false,
    hasUnread: false
  }
];

export default function MatchesPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6" data-testid="text-matches-title">
          Tus Matches
        </h1>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar matches..."
            className="pl-10"
            data-testid="input-search-matches"
          />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
          {mockMatches.map((match) => (
            <MatchCard
              key={match.id}
              name={match.name}
              age={match.age}
              imageUrl={match.imageUrl}
              isVerified={match.isVerified}
              hasUnread={match.hasUnread}
              onClick={() => console.log(`Clicked on ${match.name}`)}
            />
          ))}
        </div>

        {mockMatches.length === 0 && (
          <div className="text-center py-16">
            <p className="text-2xl font-bold mb-2">No tienes matches todavía</p>
            <p className="text-muted-foreground">
              Sigue deslizando para encontrar tu chispa
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
