import { Cake, Heart, Users, Sparkles } from "lucide-react";
import { ValueCard, VisitUsCard } from "./components";
import { Header, PageHeader } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'About Us - Our Story & Values',
  description: 'Learn about Koket Bakery & Pastry - our story, values, and commitment to creating beautiful, delicious cakes that bring joy to every celebration since 2020.',
  openGraph: {
    title: 'About Koket Bakery & Pastry',
    description: 'Discover our passion for handcrafted desserts and our commitment to quality ingredients and exceptional service.',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background-2">
      <div className="">
        <div className="mb-8 sm:mb-10 md:mb-12">
          <PageHeader
            title="About Koket Bakery & Pastry"
            subtitle="Creating sweet memories with passion and dedication since 2020"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Our Story Section */}
          <div className="mb-16 sm:mb-20">
            <div className="mb-8 sm:mb-10">
              <Header text="Our Story" />
            </div>
            <div className="bg-card border-2 border-border rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg">
              <div className="space-y-5 text-muted-foreground leading-relaxed text-base sm:text-lg">
                <p className="flex flex-col xl:flex-row xl:items-start items-center gap-3">
                  <svg
                    className="w-6 h-6 text-primary flex-shrink-0 mt-1 "
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                  <span>
                    Koket Bakery & Pastry was born from a passion for creating
                    beautiful, delicious cakes that bring joy to every
                    celebration. What started as a small home bakery has grown
                    into a beloved local cake shop, serving our community with
                    handcrafted desserts made with the finest ingredients.
                  </span>
                </p>
                <p className="flex flex-col xl:flex-row xl:items-start items-center gap-3">
                  <svg
                    className="w-6 h-6 text-primary flex-shrink-0 mt-1 "
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>
                    Our team of skilled bakers and decorators work tirelessly to
                    ensure every cake is not just a dessert, but a work of art.
                    From classic birthday cakes to elaborate wedding creations,
                    we pour our hearts into every order.
                  </span>
                </p>
                <p className="flex flex-col xl:flex-row xl:items-start items-center gap-3">
                  <svg
                    className="w-6 h-6 text-primary flex-shrink-0 mt-1 "
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>
                    We believe that every celebration deserves a special cake,
                    and we're honored to be part of your most memorable moments.
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Our Values Section */}
          <div className="mb-16 sm:mb-20">
            <div className="mb-8 sm:mb-10">
              <Header text="Our Values" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <ValueCard
                icon={Cake}
                title="Quality"
                description="We use only the finest ingredients to create cakes that taste as amazing as they look."
                iconColor="text-pink-400"
              />
              <ValueCard
                icon={Heart}
                title="Passion"
                description="Every cake is crafted with love and dedication to make your celebration truly special."
                iconColor="text-primary"
              />
              <ValueCard
                icon={Users}
                title="Community"
                description="We're proud to serve our local community and be part of your special moments."
                iconColor="text-blue-500"
              />
              <ValueCard
                icon={Sparkles}
                title="Creativity"
                description="We bring your vision to life with custom designs for any occasion."
                iconColor="text-pink-400"
              />
            </div>
          </div>

          {/* Visit Us Section */}
          <div className="pb-16 sm:pb-20">
            <div className="mb-8 sm:mb-10">
              <Header text="Visit Us" />
            </div>
            <VisitUsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
