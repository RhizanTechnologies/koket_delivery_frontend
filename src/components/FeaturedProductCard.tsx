"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FeaturedProductCardProps {
  images: string[];
  name: string;
  description: string;
  price: string;
  category: string;
  productId: string;
}

export default function FeaturedProductCard({
  images,
  name,
  description,
  price,
  category,
  productId,
}: FeaturedProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const displayImages = images.length > 0 ? images : ["/assets/placeholder-product.jpg"];
  return (
    <Link href={`/products/${productId}`}>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="group relative h-full bg-gradient-to-br from-card to-card/80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-border/50 hover:border-primary/30 transition-all duration-300"
      >
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
          {/* Decorative circle */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>

          <Image
            src={displayImages[currentImageIndex]}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Image Navigation Arrows - appears on hover */}
          {displayImages.length > 1 && (
            <>
              {/* Left Arrow */}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? displayImages.length - 1 : prev - 1
                  );
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </Button>

              {/* Right Arrow */}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImageIndex((prev) =>
                    prev === displayImages.length - 1 ? 0 : prev + 1
                  );
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </Button>

              {/* Image indicators (small dots) */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                {displayImages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      currentImageIndex === index
                        ? "bg-white w-4"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-3">
          {/* Title */}
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
            {name}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

          {/* Price and Category Row */}
          <div className="flex items-center justify-between pt-2">
            {/* Price */}
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Price</span>
              <span className="text-2xl font-bold text-primary">{price}</span>
            </div>

            {/* Category Badge */}
            <div className="flex items-center gap-1.5 bg-primary/10 dark:bg-primary/20 px-3 py-2 rounded-full">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-xs font-semibold text-primary">
                {category}
              </span>
            </div>
          </div>
        </div>

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </motion.div>
    </Link>
  );
}
