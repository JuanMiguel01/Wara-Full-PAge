import ProfileView from '../ProfileView';
import profile2 from '@assets/generated_images/Young_Cuban_man_portrait_c55b3471.png';

export default function ProfileViewExample() {
  return (
    <ProfileView
      name="Carlos"
      age={28}
      bio="Ingeniero de software apasionado por la tecnología y la música. Me encanta tocar guitarra, hacer senderismo los fines de semana y probar nuevos restaurantes. Busco alguien con quien compartir aventuras y crear buenos recuerdos."
      distance={5.2}
      job="Ingeniero de Software"
      company="Tech Startup"
      education="Universidad de La Habana"
      interests={["Música", "Tecnología", "Senderismo", "Cocina", "Viajes", "Guitarra"]}
      images={[profile2]}
      isVerified={true}
      onBack={() => console.log('Back clicked')}
      onNope={() => console.log('Nope clicked')}
      onLike={() => console.log('Like clicked')}
      onSuperLike={() => console.log('Super like clicked')}
    />
  );
}
