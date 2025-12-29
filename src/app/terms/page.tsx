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
              1. Introduction
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to Koket Bakery & Pastry. By accessing and using our
              website and services, you agree to comply with and be bound by the
              following terms and conditions. Please read these terms carefully
              before using our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              2. Services
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              Koket Bakery & Pastry provides handcrafted cakes, pastries, and
              desserts for various occasions. Our services include:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Ready-made products available for purchase</li>
              <li>Custom cake orders for special occasions</li>
              <li>Online ordering and delivery services</li>
              <li>Consultation for custom designs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              3. Orders and Payment
            </h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">3.1 Order Placement:</strong>{" "}
                All orders must be placed through our website or by contacting
                us directly. Custom orders require advance notice.
              </p>
              <p>
                <strong className="text-foreground">3.2 Payment:</strong> We
                accept various payment methods. Custom orders require an upfront
                payment to confirm the order.
              </p>
              <p>
                <strong className="text-foreground">3.3 Pricing:</strong> All
                prices are subject to change without notice. The price confirmed
                at the time of order placement will be honored.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              4. Cancellation and Refund Policy
            </h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">4.1 Cancellations:</strong>{" "}
                Orders may be cancelled within 24 hours of placement. Custom
                orders may be subject to cancellation fees.
              </p>
              <p>
                <strong className="text-foreground">4.2 Refunds:</strong>{" "}
                Refunds will be processed according to our refund policy. Custom
                orders may have different refund terms.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              5. Delivery
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Delivery times are estimates and may vary. We are not responsible
              for delays caused by circumstances beyond our control. Delivery
              charges apply and vary by location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              6. Product Quality
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We strive to maintain the highest quality standards. If you are
              not satisfied with your order, please contact us within 24 hours
              of delivery. Photos may be required for quality-related complaints.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              7. Allergies and Dietary Restrictions
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Please inform us of any allergies or dietary restrictions when
              placing your order. While we take precautions, we cannot guarantee
              that our products are completely allergen-free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              8. Intellectual Property
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on this website, including images, logos, and text, is
              the property of Koket Bakery & Pastry and is protected by
              copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              9. Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Koket Bakery & Pastry shall not be liable for any indirect,
              incidental, or consequential damages arising from the use of our
              services or products.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              10. Changes to Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. Continued
              use of our services after changes constitutes acceptance of the
              modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              11. Contact Information
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these terms, please contact us at:
            </p>
            <div className="mt-3 text-muted-foreground space-y-1">
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
