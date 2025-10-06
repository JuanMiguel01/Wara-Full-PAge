import { X, Heart, Zap } from "lucide-react";

interface ActionButtonProps {
  type: "nope" | "like" | "super";
  onClick?: () => void;
}

export default function ActionButton({ type, onClick }: ActionButtonProps) {
  const config = {
    nope: {
      icon: X,
      className: "w-16 h-16 bg-muted/50 border-2 border-muted text-muted-foreground hover-elevate active-elevate-2",
      testId: "button-nope"
    },
    like: {
      icon: Heart,
      className: "w-16 h-16 bg-primary/10 border-2 border-primary text-primary hover-elevate active-elevate-2",
      testId: "button-like"
    },
    super: {
      icon: Zap,
      className: "w-18 h-18 bg-gradient-to-r from-primary to-brand-gold border-2 border-primary text-white hover-elevate active-elevate-2",
      testId: "button-super-chispa"
    }
  };

  const { icon: Icon, className, testId } = config[type];

  return (
    <button
      onClick={onClick}
      className={`${className} backdrop-blur-xl rounded-full flex items-center justify-center transition-all`}
      data-testid={testId}
    >
      <Icon className={type === "super" ? "w-9 h-9" : "w-8 h-8"} />
    </button>
  );
}
