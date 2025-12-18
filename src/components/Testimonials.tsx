// ...existing code...
import React from "react";
import Header from "./Header";

const testimonials = [
  {
    name: "Michael Chen",
    review:
      "Ordered a custom birthday cake for my daughter and it exceeded all expectations. The attention to detail was incredible!",
    rating: 5,
  },
  {
    name: "Aisha Rahman",
    review:
      "Beautiful cake and amazing service — exactly what we wanted for the celebration. Highly recommend!",
    rating: 5,
  },
  {
    name: "Daniel Kim",
    review:
      "Flavors were spot on and the design was flawless. Will order again for sure.",
    rating: 5,
  },
  // {
  //   name: "Sofia Martinez",
  //   review:
  //     "Great customer support and timely delivery. The cake arrived fresh and delicious!",
  //   rating: 5,
  // },
];

function Testimonials() {
  return (
    <section className="bg-background section-spacing-y">
      <div className="section-container">
        <div className="text-center mb-10 sm:mb-12 md:mb-14 lg:mb-16">
          <Header text="What Our Customers Say" />
          <p className="mt-3 xs:mt-4 text-muted-foreground text-sm xs:text-base md:text-lg max-w-2xl mx-auto">
            Real reviews from our satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl shadow-lg hover:shadow-xl border-2 border-border hover:border-primary/50 p-6 sm:p-7 flex flex-col transition-all duration-300 group"
            >
              <div className="flex mb-3 sm:mb-4">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <span
                    key={idx}
                    className="text-yellow-400 text-lg sm:text-xl mr-1"
                  >
                    &#9733;
                  </span>
                ))}
              </div>

              <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-5 flex-1 overflow-hidden line-clamp-4 leading-relaxed">
                &ldquo;{t.review}&rdquo;
              </p>

              <div className="pt-3 sm:pt-4 border-t border-border">
                <span className="font-bold text-card-foreground group-hover:text-primary transition-colors duration-300 text-sm sm:text-base">
                  {t.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
// ...existing code...
