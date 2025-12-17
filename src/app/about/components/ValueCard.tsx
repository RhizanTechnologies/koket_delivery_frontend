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
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border text-center hover:shadow-md transition-shadow">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
      <h3 className="font-semibold text-xl text-foreground mb-2">{title}</h3>
      <p className="text-base text-muted-foreground text-balance">
        {description}
      </p>
    </div>
  );
}
export default ValueCard;
