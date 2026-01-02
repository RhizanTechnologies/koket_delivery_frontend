import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Koket Bakery & Pastry",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background-2 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: December 29, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-card rounded-lg shadow-md p-6 sm:p-8 space-y-6 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              1. Information We Collect
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect personal information you provide (name, email, phone, address, payment details). We use cookies to enhance your browsing experience and analyze website traffic.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              2. How We Use Your Information
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Your information is used to process orders, communicate with you, improve our services, and send promotional materials with your consent. We do not sell your personal information. We implement security measures to protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              3. Contact Us
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You have the right to access, correct, or delete your information. If you have questions about our privacy practices, contact us:
            </p>
            <div className="text-muted-foreground space-y-1">
              <p>Email: koketbakeryandpastry@gmail.com</p>
              <p>Phone: +251 911 529 898</p>
              <p>
                Address: Tulu Dimtu, near Shewa Supermarket, Atika Building,
                Addis Ababa, Ethiopia
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
