import React from "react";
import Link from "next/link";

function Hero() {
  return (
    <section className="bg-background section-spacing-y">
      <div className="section-container flex flex-col items-center text-center">
        <h1 className="font-kaushan text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-foreground leading-tight mb-4 sm:mb-6">
          Delicious Cakes for <br /> Every Celebration
        </h1>
        <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto mt-4 sm:mt-6 md:mt-8 mb-8 sm:mb-10 md:mb-12 lg:mb-14 leading-relaxed px-4">
          From birthdays to weddings, we create custom cakes that taste as
          amazing as they look. Order online and make your special moments
          sweeter.
        </p>
        <div className="flex flex-col md:flex-row gap-3 xs:gap-4 justify-center w-full md:w-auto">
          <Link
            href="/products"
            className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-6 lg:px-8 xl:px-10 py-3 lg:py-4 text-sm xs:text-base lg:text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Explore Collection
          </Link>
          <Link
            href="/custom-cake"
            className="bg-secondary hover:bg-secondary-hover text-foreground font-semibold px-6 lg:px-8 xl:px-10 py-3 lg:py-4 text-sm xs:text-base lg:text-lg rounded-lg shadow-md hover:shadow-lg border border-border transition-all duration-300"
          >
            Custom Order
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
