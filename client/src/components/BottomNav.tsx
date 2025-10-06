import { Flame, Users, MessageCircle, User, Settings } from "lucide-react";

interface BottomNavProps {
  activeTab: "discover" | "matches" | "messages" | "profile" | "settings";
  onTabChange: (tab: "discover" | "matches" | "messages" | "profile" | "settings") => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "discover" as const, icon: Flame, label: "Descubrir", testId: "nav-discover" },
    { id: "matches" as const, icon: Users, label: "Matches", testId: "nav-matches" },
    { id: "messages" as const, icon: MessageCircle, label: "Mensajes", testId: "nav-messages" },
    { id: "profile" as const, icon: User, label: "Perfil", testId: "nav-profile" },
    { id: "settings" as const, icon: Settings, label: "Ajustes", testId: "nav-settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-card/90 border-t border-card-border">
      <div className="flex justify-around items-center h-16 max-w-2xl mx-auto">
        {tabs.map(({ id, icon: Icon, label, testId }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors ${
              activeTab === id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            data-testid={testId}
          >
            <Icon className={`w-6 h-6 ${activeTab === id ? 'fill-primary/20' : ''}`} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
