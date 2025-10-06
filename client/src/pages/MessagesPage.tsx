import { useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";

import profile1 from '@assets/generated_images/Young_Cuban_woman_portrait_87eb5c89.png';
import profile3 from '@assets/generated_images/Cuban_woman_Havana_portrait_cb4e6f84.png';

// TODO: Remove mock data
const mockConversations = [
  {
    id: '1',
    name: "María",
    age: 26,
    imageUrl: profile1,
    isVerified: true,
    lastMessage: "¿Nos vemos este fin de semana?",
    timestamp: "Hace 10 min",
    unread: 2
  },
  {
    id: '2',
    name: "Ana",
    age: 29,
    imageUrl: profile3,
    isVerified: false,
    lastMessage: "¡Me encantaría conocerte!",
    timestamp: "Hace 2 horas",
    unread: 0
  }
];

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  if (selectedChat) {
    const conversation = mockConversations.find(c => c.id === selectedChat);
    if (conversation) {
      // TODO: Remove mock messages
      const mockMessages = [
        {
          id: '1',
          content: '¡Hola! ¿Cómo estás?',
          isSent: false,
          timestamp: new Date(Date.now() - 30 * 60 * 1000)
        },
        {
          id: '2',
          content: '¡Muy bien! Me gustó mucho tu perfil 😊',
          isSent: true,
          timestamp: new Date(Date.now() - 25 * 60 * 1000)
        }
      ];

      return (
        <ChatInterface
          matchName={conversation.name}
          matchAge={conversation.age}
          matchImage={conversation.imageUrl}
          isVerified={conversation.isVerified}
          initialMessages={mockMessages}
          onBack={() => setSelectedChat(null)}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6" data-testid="text-messages-title">
          Mensajes
        </h1>

        <div className="space-y-2">
          {mockConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedChat(conv.id)}
              className="w-full flex items-center gap-4 p-4 rounded-xl backdrop-blur-xl bg-card/50 border border-card-border hover-elevate"
              data-testid={`conversation-${conv.id}`}
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img src={conv.imageUrl} alt={conv.name} className="w-full h-full object-cover" />
                </div>
                {conv.unread > 0 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{conv.unread}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{conv.name}, {conv.age}</h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {conv.lastMessage}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
              </div>
            </button>
          ))}

          {mockConversations.length === 0 && (
            <div className="text-center py-16">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-2xl font-bold mb-2">No hay mensajes</p>
              <p className="text-muted-foreground">
                Cuando hagas match, podrás empezar a chatear aquí
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
