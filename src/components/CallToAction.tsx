import React from "react";
import Link from "next/link";

function CallToAction() {
  return (
    <section
      className="relative flex items-center min-h-[350px] sm:min-h-[450px] md:min-h-[550px] lg:min-h-[600px] bg-center bg-cover py-12 sm:py-16 md:py-20"
      style={{
        backgroundImage: "url('/assets/img5.jpg')",
      }}
    >
      {/* Asymmetric gradient - darker on left where text is */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-900/70 via-pink-800/50 to-pink-900/20"></div>

      {/* Optional: spotlight effect on text area */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-950/40 60%, transparent 100%)"></div>

      <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 w-full">
        <div className="flex flex-col items-start justify-center text-left max-w-2xl ml-0 lg:ml-8 xl:ml-16">
          {/* Changed to text-left and items-start */}
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight text-shadow-lg">
            Ready to Order Your Perfect Cake?
          </h2>

          <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-8 sm:mb-10 md:mb-12 leading-relaxed font-medium max-w-xl">
            Browse our collection or create a custom cake designed just for you
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5">
            <Link
              href="/products"
              className="
                inline-block
                text-white
                border-b-2 border-white/70
                pb-1
                text-sm sm:text-base
                tracking-wide
                hover:border-white
                transition
              "
            >
              Explore Cakes
            </Link>

            <Link
              href="/custom-orders"
              className="
                inline-block
                text-white/80
                hover:text-white
                text-sm sm:text-base
                tracking-wide
                transition
              "
            >
              Custom Order →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;
