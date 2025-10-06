import { CheckCircle2 } from "lucide-react";

interface VerifiedBadgeProps {
  size?: "sm" | "md";
  className?: string;
}

export default function VerifiedBadge({ size = "sm", className = "" }: VerifiedBadgeProps) {
  const sizeClasses = size === "sm" ? "w-5 h-5" : "w-7 h-7";
  
  return (
    <div className={`${sizeClasses} ${className}`} data-testid="badge-verified">
      <CheckCircle2 className="w-full h-full text-chart-4 fill-chart-4/20" />
    </div>
  );
}
