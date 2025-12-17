import React from "react";
import ContactMethodCard from "./ContactMethodCard";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

function MethodCards() {
  return (
    <div className="bg-background-2 section-spacing">
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4 ">
        <ContactMethodCard
          icon={Phone}
          label="Call"
          text1="+251912700250"
          text2="test"
          iconColor="text-green-400"
        />
        <ContactMethodCard
          icon={Mail}
          label="Email Us"
          text1="hello@sweetdelights.com"
          text2="We reply within 24 hours"
          iconColor="text-blue-400"
        />
        <ContactMethodCard
          icon={MapPin}
          label="Location"
          text1="Tulu Dimtu, Addis Ababa"
          text2="We reply within 24 hours"
          iconColor="text-orange-400"
        />
        <ContactMethodCard
          icon={MessageCircle}
          label="Telegram"
          text1="@hamzisho"
          text2="We reply within 24 hours"
          iconColor="text-blue-400"
        />
      </div>
    </div>
  );
}

export default MethodCards;
