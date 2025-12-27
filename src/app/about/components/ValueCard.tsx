import type { LucideIcon } from "lucide-react";

interface ValueCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
}

function ValueCard({
  icon: Icon,
  title,
  description,
  iconColor = "text-primary",
}: ValueCardProps) {
  return (
    <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-border text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className={`w-7 h-7 ${iconColor}`} />
        </div>
      </div>
      <h3 className="font-semibold text-xl text-foreground mb-3">{title}</h3>
      <p className="text-base text-muted-foreground leading-relaxed text-balance">
        {description}
      </p>
    </div>
  );
}
export default ValueCard;
