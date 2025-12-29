"use client";

import Link from "next/link";
import React from "react";
import { Eye, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProductCardProps {
  image: string;
  name: string;
  description: string;
  price: string;
  category?: string;
  productId: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  name,
  description,
  price,
  category,
  productId,
}) => {
  return (
    <Link href={`/products/${productId}`} className="block w-full h-full">
      <motion.div
        className="w-full h-full group cursor-pointer"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-card to-card/80 shadow-md hover:shadow-2xl border border-border/50 hover:border-primary/40 transition-all duration-300 flex flex-col h-full">
          {/* Image container with overlay effect */}
          <div className="relative overflow-hidden aspect-square sm:aspect-[4/3] bg-gradient-to-br from-primary/5 to-secondary/5">
            {/* Decorative blur circle - hidden on mobile for performance */}
            <div className="hidden sm:block absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>

            <Image
              src={image || "/placeholder-product.jpg"} 
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
            />

            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Category badge - top right */}
            {category && (
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg">
                <span className="text-[10px] sm:text-xs font-semibold text-primary line-clamp-1">
                  {category}
                </span>
              </div>
            )}

            {/* Quick view button - center on hover (hidden on mobile) */}
            <div className="hidden sm:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-3 rounded-full shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                <Eye className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className="p-3 sm:p-4 md:p-5 lg:p-6 flex-1 flex flex-col">
            <h3 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-1.5 sm:mb-2 line-clamp-1 text-card-foreground group-hover:text-primary transition-colors duration-300">
              {name}
            </h3>

            <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed flex-1">
              {description}
            </p>

            {/* Price and CTA */}
            <div className="flex items-center justify-between gap-2 sm:gap-3 mt-auto pt-2 sm:pt-3 border-t border-border/50">
              <span className="text-primary font-bold text-lg sm:text-xl lg:text-2xl">
                {price}
              </span>

              <div className="flex items-center gap-1 sm:gap-1.5 text-primary font-semibold text-xs sm:text-sm group-hover:gap-2 sm:group-hover:gap-2.5 transition-all duration-300">
                <span className="inline">View</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* Corner accent - hidden on mobile */}
          <div className="hidden sm:block absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
