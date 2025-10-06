import ChatInterface from '../ChatInterface';
import profile3 from '@assets/generated_images/Cuban_woman_Havana_portrait_cb4e6f84.png';

export default function ChatInterfaceExample() {
  const mockMessages = [
    {
      id: '1',
      content: '¡Hola! Vi que también te gusta la música cubana 🎵',
      isSent: false,
      timestamp: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: '2',
      content: '¡Sí! Me encanta. ¿Cuál es tu artista favorito?',
      isSent: true,
      timestamp: new Date(Date.now() - 25 * 60 * 1000)
    },
    {
      id: '3',
      content: 'Buena Vista Social Club siempre. ¿Y tú?',
      isSent: false,
      timestamp: new Date(Date.now() - 20 * 60 * 1000)
    }
  ];

  return (
    <ChatInterface
      matchName="Ana"
      matchAge={29}
      matchImage={profile3}
      isVerified={true}
      initialMessages={mockMessages}
      onBack={() => console.log('Back clicked')}
    />
  );
}
