import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";

import LoginPage from "@/pages/LoginPage";
import DiscoverPage from "@/pages/DiscoverPage";
import MatchesPage from "@/pages/MatchesPage";
import MessagesPage from "@/pages/MessagesPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";

function Router() {
  const [activeTab, setActiveTab] = useState<"discover" | "matches" | "messages" | "profile" | "settings">("discover");

  // TODO: Remove mock - Replace with real authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="relative">
      {activeTab === "discover" && <DiscoverPage />}
      {activeTab === "matches" && <MatchesPage />}
      {activeTab === "messages" && <MessagesPage />}
      {activeTab === "profile" && <ProfilePage />}
      {activeTab === "settings" && <SettingsPage />}
      
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
