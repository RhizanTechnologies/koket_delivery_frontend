import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions for using Koket Bakery & Pastry services",
};

export default function TermsPage() {
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
            Terms and Conditions
          </h1>
          <p className="text-muted-foreground">
            Last updated: December 29, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-card rounded-lg shadow-md p-6 sm:p-8 space-y-6 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              1. Orders and Payment
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By placing an order with Koket Bakery & Pastry, you agree to provide accurate information and make payment as required. Orders require upfront payment and advance notice. All prices are subject to change, but the confirmed price at checkout will be honored.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              2. Quality
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We strive to maintain the highest quality standards for all our products. If you're not satisfied with your order, please contact us. Please inform us of any allergies or dietary restrictions when ordering.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              3. Contact Us
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              If you have any questions about these terms, please contact us:
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
