"use client";

import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { motion, Variants } from "framer-motion"; // ✅ import motion
import Header from "./Header";
import Link from "next/link";

const categories = [
  {
    name: "Cakes",
    image: "/assets/img1.png",
    tagline: "Sweeten every moment!",
    description: "Custom designs for your special occasions",
  },
  {
    name: "Cookies",
    image: "/assets/img2.png",
    tagline: "One bite, endless smiles!",
    description: "Custom designs for your special occasions",
  },
  {
    name: "Breads",
    image: "/assets/img3.jpeg",
    tagline: "Warm, fresh, and made with love!",
    description: "Artisan breads crafted to perfection",
  },
];

// ✅ Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: ["easeInOut"],
    },
  },
};

function CategorySection() {
  return (
    <section className="bg-background/50 section-spacing-y">
      <div className="section-container">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-14 lg:mb-16"
        >
          <Header text="Explore Our Delicious Categories" />
          <p className="mt-3 xs:mt-4 text-muted-foreground text-sm xs:text-base md:text-lg max-w-2xl mx-auto">
            Discover our handcrafted selection of baked goods, made fresh daily
            with love
          </p>
        </motion.div>

        {/* Category grid - 3 cards only */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8 lg:gap-10"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="group cursor-pointer w-full max-w-md mx-auto sm:max-w-none"
            >
              <Card className="relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-300 h-full bg-card hover:shadow-xl p-0">
                {/* Image container with overlay */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index === 0}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300" />

                  {/* Category name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 xss:p-4 xs:p-5 sm:p-2 md:p-6">
                    <h3 className="text-xl xss:text-2xl sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 xss:mb-2">
                      {category.name}
                    </h3>
                    <p className="text-white/90 text-xs xss:text-sm font-medium line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Tagline section */}
                <CardContent className="p-4 xss:p-5 sm:py-0 md:py-1 sm:px-2  lg:p-6">
                  <div className="flex items-center gap-2 xss:gap-3">
                    <div className="h-0.5 xss:h-1 flex-1 bg-primary/20 rounded-full" />
                    <div className="w-1.5 h-1.5 xss:w-2 xss:h-2 bg-primary rounded-full" />
                    <div className="h-0.5 xss:h-1 flex-1 bg-primary/20 rounded-full" />
                  </div>
                  <p className="text-center text-xs xss:text-sm md:text-base text-muted-foreground mt-3 xss:mt-4 leading-relaxed px-1 xss:px-0 ">
                    {category.tagline}
                  </p>
                </CardContent>

                {/* Hover effect indicator */}
                <div className="absolute top-3 right-3 xss:top-4 xss:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link href="/products">
                    <div className="bg-primary text-primary-foreground rounded-full p-1.5 xss:p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 xss:h-5 xss:w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default CategorySection;
