import Link from "next/link";

function VisitUsCard() {
  return (
    <div className="bg-card rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border-2 border-border max-w-2xl mx-auto">
      <div className="space-y-6 text-center">
        {/* Address */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 text-xl">
            Address
          </h3>
          <p className="text-muted-foreground text-base leading-relaxed">
            Tulu Dimtu, near Shewa Supermarket
          </p>
          <p className="text-muted-foreground text-base leading-relaxed">
            Atika Building, Addis Ababa
          </p>
        </div>

        {/* Phone */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 text-xl">Phone</h3>
          <div className="space-y-1">
            <Link 
              href="tel:+251911529898"
              className="block text-muted-foreground hover:text-primary transition-colors text-base"
            >
              09 11 52 98 98
            </Link>
            <Link 
              href="tel:+251916911591"
              className="block text-muted-foreground hover:text-primary transition-colors text-base"
            >
              09 16 91 15 91
            </Link>
            <Link 
              href="tel:+251912700250"
              className="block text-muted-foreground hover:text-primary transition-colors text-base"
            >
              09 12 70 02 50
            </Link>
          </div>
        </div>

        {/* Email */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 text-xl">Email</h3>
          <Link
            href="mailto:koketbakeryandpastry@gmail.com"
            className="text-muted-foreground hover:text-primary transition-colors text-base break-all"
          >
            koketbakeryandpastry@gmail.com
          </Link>
        </div>

        {/* Business Hours */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 text-xl">
            Business Hours
          </h3>
          <p className="text-muted-foreground text-base leading-relaxed">Monday – Sunday</p>
          <p className="text-muted-foreground text-base leading-relaxed">
            12:00 LT (Morning) – 3:30 LT (Evening)
          </p>
        </div>
      </div>
    </div>
  );
}

export default VisitUsCard;
