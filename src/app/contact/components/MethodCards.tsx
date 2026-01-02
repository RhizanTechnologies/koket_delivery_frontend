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
  text1="+251911529898"
  text2="Available during business hours"
  iconColor="text-green-400"
  link="tel:+251911529898"
/>

<ContactMethodCard
  icon={Mail}
  label="Email Us"
  text1="koketbakeryandpastry@gmail.com"
  text2="We respond within 24 hours"
  iconColor="text-blue-400"
  link="mailto:koketbakeryandpastry@gmail.com"
/>

<ContactMethodCard
  icon={MapPin}
  label="Location"
  text1="Tulu Dimtu, Addis Ababa"
  text2="Visit us at our main branch"
  iconColor="text-orange-400"
/>

<ContactMethodCard
  icon={MessageCircle}
  label="Telegram"
  text1="@koketbakery"
  text2="Quick support via Telegram"
  iconColor="text-blue-400"
  link="https://t.me/koketbakery"
/>

      </div>
    </div>
  );
}

export default MethodCards;
