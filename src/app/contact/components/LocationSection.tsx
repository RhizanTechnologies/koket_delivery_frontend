import { MapPin } from "lucide-react";

function LocationSection() {
  return (
    <div
      className="bg-card rounded-lg px-4 py-32 max-w-4xl mx-auto text-center"
      // style={{backgroundImage: 'url("assets/location.jpg")', backgroundSize: 'cover', backgroundPosition: 'center'}}
    >
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center">
          <MapPin className="w-8 h-8 text-muted-foreground" />
        </div>
      </div>
      <p className="text-foreground font-medium mb-1">
        123 Bakery Street, Sweet City, SC 12345
      </p>
      <a
        href="https://maps.app.goo.gl/mK1wM7gaCb4zdMHg9"
        target="_blank"
        rel="noopener noreferrer"
        className="text-pink-500 hover:text-pink-600 text-sm"
      >
        Open in Google Maps
      </a>
    </div>
  );
}
export default LocationSection;
