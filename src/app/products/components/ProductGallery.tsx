// ...existing code...
"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductGalleryProps {
  images?: string[];
  name?: string;
}

const FALLBACK_IMAGES = [
  "/assets/img2.png",
  "/assets/img1.png",
  "/assets/img3.jpeg",
];

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const galleryImages = useMemo(() => {
    if (images && images.length > 0) {
      return images;
    }
    return FALLBACK_IMAGES;
  }, [images]);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Main Image */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-muted to-muted/50 group">
        <img
          src={galleryImages[currentImage] || "/placeholder.svg"}
          alt={name ? `${name} image ${currentImage + 1}` : "Product image"}
          className="w-full h-[280px] sm:h-[350px] md:h-[450px] lg:h-[500px] object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Navigation Arrows - Hidden on single image */}
        {galleryImages.length > 1 && (
          <>
            <Button
              onClick={prevImage}
              aria-label="Previous image"
              variant="ghost"
              size="icon"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-2 sm:p-2.5 hover:bg-white dark:hover:bg-gray-900 shadow-lg transition-all hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
            </Button>
            <Button
              onClick={nextImage}
              aria-label="Next image"
              variant="ghost"
              size="icon"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-2 sm:p-2.5 hover:bg-white dark:hover:bg-gray-900 shadow-lg transition-all hover:scale-110 active:scale-95"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-black/70 backdrop-blur-sm text-white text-xs sm:text-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium">
            {currentImage + 1} / {galleryImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {galleryImages.length > 1 && (
        <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2">
          {galleryImages.map((image, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={() => setCurrentImage(index)}
              aria-label={`View image ${index + 1}`}
              className={`flex-shrink-0 h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 overflow-hidden rounded-lg sm:rounded-xl border-2 transition-all p-0 ${
                currentImage === index
                  ? "border-primary ring-2 ring-primary/20 scale-105"
                  : "border-border hover:border-primary/50 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={
                  name
                    ? `${name} thumbnail ${index + 1}`
                    : `Thumbnail ${index + 1}`
                }
                className="h-full w-full object-cover"
              />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
