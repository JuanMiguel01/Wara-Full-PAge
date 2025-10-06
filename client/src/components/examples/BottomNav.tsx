import { useState } from 'react';
import BottomNav from '../BottomNav';

export default function BottomNavExample() {
  const [activeTab, setActiveTab] = useState<"discover" | "matches" | "messages" | "profile" | "settings">("discover");

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">Tab activo: {activeTab}</h2>
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
