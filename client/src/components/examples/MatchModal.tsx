import MatchModal from '../MatchModal';
import profile1 from '@assets/generated_images/Young_Cuban_woman_portrait_87eb5c89.png';
import profile4 from '@assets/generated_images/Cuban_man_garden_portrait_3aaa4a1a.png';

export default function MatchModalExample() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <MatchModal
        user1Name="María"
        user1Image={profile1}
        user2Name="Roberto"
        user2Image={profile4}
        onMessage={() => console.log('Send message clicked')}
        onClose={() => console.log('Close clicked')}
      />
    </div>
  );
}
