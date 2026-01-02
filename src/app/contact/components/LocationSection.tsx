import { MapPin } from "lucide-react";

function LocationSection() {
  return (
    <div
      className="bg-card rounded-2xl border-2 border-border px-6 py-16 sm:py-20 md:py-24 max-w-3xl mx-auto text-center shadow-lg"
      // style={{backgroundImage: 'url("assets/location.jpg")', backgroundSize: 'cover', backgroundPosition: 'center'}}
    >
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
        </div>
      </div>
      <p className="text-foreground font-semibold mb-2 text-base sm:text-lg leading-relaxed">
        Tulu Dimtu, near Shewa Supermarket, Atika Building
      </p>
      <p className="text-muted-foreground mb-4 text-sm sm:text-base">
        Addis Ababa, Ethiopia
      </p>
      <a
        href="https://maps.app.goo.gl/mK1wM7gaCb4zdMHg9"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors text-sm sm:text-base"
      >
        <MapPin className="w-4 h-4" />
        Open in Google Maps
      </a>
    </div>
  );
}
export default LocationSection;
