import VerifiedBadge from '../VerifiedBadge';

export default function VerifiedBadgeExample() {
  return (
    <div className="flex gap-4 items-center p-4 bg-background">
      <VerifiedBadge size="sm" />
      <VerifiedBadge size="md" />
    </div>
  );
}
