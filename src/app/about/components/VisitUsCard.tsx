function VisitUsCard() {
  return (
    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 max-w-lg mx-auto">
      <div className="space-y-6 text-center">
        <div>
          <h3 className="font-semibold text-foreground mb-2 text-xl">
            Address:
          </h3>
          <p className="text-muted-foreground text-base">123 Bakery Street</p>
          <p className="text-muted-foreground text-base">
            Sweet City, SC 12345
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-2 text-xl">Phone:</h3>
          <p className="text-muted-foreground text-base">(251) 123-4567</p>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-2 text-xl">Email:</h3>
          <p className="text-muted-foreground text-base">
            hello@sweetdelights.com
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-2 text-xl">Hours:</h3>
          <p className="text-muted-foreground text-base">
            Monday - Saturday: 9:00 AM - 6:00 PM
          </p>
          <p className="text-muted-foreground text-base">
            Sunday: 10:00 AM - 4:00 PM
          </p>
        </div>
      </div>
    </div>
  );
}

export default VisitUsCard;
