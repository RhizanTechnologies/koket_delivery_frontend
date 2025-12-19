import { LucideIcon } from "lucide-react";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  iconSrc?: string;
  iconAlt?: string;
  Icon?: LucideIcon;
}

export default function HeroSection({
  title,
  subtitle,
  iconSrc,
  iconAlt,
  Icon,
}: HeroSectionProps) {
  return (
    <div className="bg-background section-spacing text-center">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-row justify-center items-center mb-4">
          <div className="pr-2">
            {Icon ? (
              <Icon className="h-12 w-12 sm:h-14 sm:w-14 text-primary mb-3" />
            ) : iconSrc ? (
              <img
                src={iconSrc}
                alt={iconAlt || "icon"}
                className="mb-3 h-14 w-12 sm:h-16 sm:w-14"
              />
            ) : null}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-kaushan italic mb-3 text-foreground pl-2">
            {title}
          </h1>
        </div>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-balance -mt-6">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
