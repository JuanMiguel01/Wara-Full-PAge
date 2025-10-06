import InterestTag from '../InterestTag';

export default function InterestTagExample() {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-background">
      <InterestTag label="Música" />
      <InterestTag label="Béisbol" />
      <InterestTag label="Cocina" />
      <InterestTag label="Viajes" />
    </div>
  );
}
