import MatchCard from '../MatchCard';
import profile2 from '@assets/generated_images/Young_Cuban_man_portrait_c55b3471.png';

export default function MatchCardExample() {
  return (
    <div className="flex gap-4 p-8 bg-background">
      <MatchCard
        name="Carlos"
        age={28}
        imageUrl={profile2}
        isVerified={true}
        hasUnread={true}
        onClick={() => console.log('Match clicked')}
      />
      <MatchCard
        name="Carlos"
        age={28}
        imageUrl={profile2}
        isVerified={false}
        hasUnread={false}
        onClick={() => console.log('Match clicked')}
      />
    </div>
  );
}
