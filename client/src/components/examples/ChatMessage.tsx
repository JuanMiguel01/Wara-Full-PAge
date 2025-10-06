import ChatMessage from '../ChatMessage';

export default function ChatMessageExample() {
  return (
    <div className="p-4 bg-background max-w-md space-y-2">
      <ChatMessage
        content="¡Hola! ¿Cómo estás?"
        isSent={false}
        timestamp={new Date(Date.now() - 5 * 60 * 1000)}
      />
      <ChatMessage
        content="¡Muy bien! Me encantó tu perfil 😊"
        isSent={true}
        timestamp={new Date(Date.now() - 2 * 60 * 1000)}
      />
      <ChatMessage
        content="¿Te gustaría tomar un café esta semana?"
        isSent={false}
        timestamp={new Date(Date.now() - 30 * 1000)}
      />
    </div>
  );
}
