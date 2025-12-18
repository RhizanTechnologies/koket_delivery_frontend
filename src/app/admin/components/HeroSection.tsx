interface HeroSectionProps {
  title: string;
  subtitle: string;
  iconSrc: string;
  iconAlt: string;
}

export default function HeroSection({
  title,
  subtitle,
  iconSrc,
  iconAlt,
}: HeroSectionProps) {
  return (
    <div className="bg-background section-spacing text-center">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-row justify-center items-center mb-4">
          <div className="pr-2">
            <img
              src={iconSrc}
              alt={iconAlt}
              className="mb-3 h-14 w-12 sm:h-16 sm:w-14"
            />
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
