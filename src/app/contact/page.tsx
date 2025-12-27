import { Phone, Mail, MapPin, Clock } from "lucide-react";
import {
  LocationSection,
  ContactForm,
  ContactMethodCard,
  BookingHoursSidebar,
} from "./components";
import { Header, PageHeader } from "@/components";
import MethodCards from "./components/MethodCards";

export default function ContactPage() {
  return (
    <div className="bg-background-2  ">
      <PageHeader
        title="Get in Touch"
        subtitle="Have a question about cakes our cakes or want to discuss a custom order? We’d love to hear from you!"
      />
      <div className=" ">
        <div className="">
          {/* Main Content */}
          <div className=" space-y-8 ">
            {/* Header */}

            {/* Contact Method Cards */}
            <MethodCards />
            {/* Contact Form */}

            <ContactForm />

            {/* Location Section */}
            <div className="bg-background-2 section-spacing">
              <div className="mb-8">
                <Header text=" Find Our Bakery" />
              </div>

              <LocationSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
