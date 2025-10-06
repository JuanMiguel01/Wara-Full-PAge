import SwipeCard from '../SwipeCard';
import profile1 from '@assets/generated_images/Young_Cuban_woman_portrait_87eb5c89.png';

export default function SwipeCardExample() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <SwipeCard
        name="María"
        age={26}
        bio="Me encanta bailar salsa, cocinar y disfrutar de un buen mojito en la playa. Buscando alguien con quien compartir aventuras."
        distance={3.5}
        job="Enfermera"
        interests={["Salsa", "Cocina", "Playa", "Música", "Viajes"]}
        imageUrl={profile1}
        isVerified={true}
        onSwipe={(dir) => console.log('Swiped', dir)}
      />
    </div>
  );
}
