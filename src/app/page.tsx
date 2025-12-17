import {
  Hero,
  CategorySection,
  FeaturedSection,
  Testimonials,
  OurValues,
  CallToAction,
} from "@/components";

export default function Home() {
  return (
    <main className="bg-white">
      <Hero />
      <CategorySection />
      <FeaturedSection />
      <OurValues />
      <Testimonials />
      <CallToAction />
    </main>
  );
}
