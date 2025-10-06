interface InterestTagProps {
  label: string;
}

export default function InterestTag({ label }: InterestTagProps) {
  return (
    <span 
      className="inline-flex items-center px-3 py-1 rounded-full text-sm backdrop-blur-xl bg-white/10 border border-white/10 text-white"
      data-testid={`tag-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {label}
    </span>
  );
}
