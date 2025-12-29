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
              1. Introduction
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              At Koket Bakery & Pastry, we are committed to protecting your
              privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you visit our
              website or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              2. Information We Collect
            </h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">
                  2.1 Personal Information:
                </strong>{" "}
                We collect information that you provide directly to us,
                including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name and contact information (email, phone number)</li>
                <li>Delivery address</li>
                <li>Payment information</li>
                <li>Order history and preferences</li>
                <li>Account credentials (username and password)</li>
              </ul>
              <p>
                <strong className="text-foreground">
                  2.2 Automatically Collected Information:
                </strong>{" "}
                When you visit our website, we may automatically collect:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>IP address and device information</li>
                <li>Browser type and operating system</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              3. How We Use Your Information
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders and inquiries</li>
              <li>Improve our products and services</li>
              <li>Send promotional materials (with your consent)</li>
              <li>Detect and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              4. Information Sharing and Disclosure
            </h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                We do not sell or rent your personal information to third
                parties. We may share your information with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Service providers who assist in our operations (payment
                  processors, delivery services)
                </li>
                <li>
                  Legal authorities when required by law or to protect our
                  rights
                </li>
                <li>
                  Business partners with your explicit consent
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              5. Data Security
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access,
              alteration, disclosure, or destruction. However, no method of
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              6. Cookies and Tracking Technologies
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to enhance your
              browsing experience, analyze website traffic, and personalize
              content. You can control cookie preferences through your browser
              settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              7. Your Rights
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              8. Children's Privacy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our services are not intended for children under 13 years of age.
              We do not knowingly collect personal information from children
              under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              9. Data Retention
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal information for as long as necessary to
              fulfill the purposes outlined in this Privacy Policy, unless a
              longer retention period is required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              10. Changes to Privacy Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary">
              11. Contact Us
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us at:
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
