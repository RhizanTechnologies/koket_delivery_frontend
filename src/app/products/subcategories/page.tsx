"use client";

import Image from "next/image";
import { Forward, Link2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface WorkCard {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

const works: WorkCard[] = [
  {
    id: 1,
    title: "Web Design",
    description:
      "Short description for the ones who look for something new. Awesome!",
    imageUrl: "/assets/placeholder-product.jpg",
  },
  {
    id: 2,
    title: "Web Design",
    description:
      "Short description for the ones who look for something new. Awesome!",
    imageUrl: "/assets/placeholder-product.jpg",
  },
  {
    id: 3,
    title: "Web Design",
    description:
      "Short description for the ones who look for something new. Awesome!",
    imageUrl: "/assets/placeholder-product.jpg",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="bg-background2 pt-20 pb-40 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 flex flex-col items-center justify-center">
          <h2 className="text-3xl w-fit md:text-4xl bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text font-bold mb-4">
            Recent Works
          </h2>
          <p className="text-gray-700  text-lg dark:text-muted max-w-lg">
            Presenting our newest digital breakthroughs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {works.map((work, index) => (
            <div key={index} className="group relative pb-20">
              {/* Image Container */}
              <div className="relative rounded-xl overflow-hidden">
                <div className="aspect-[3.2/3] relative">
                  <Image
                    src={work.imageUrl || "/assets/placeholder-product.jpg"}
                    alt={work.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-gradient-to-b from-secondary/0 to-secondary/60 transition-all duration-500 ease-in-out group-hover:opacity-100">
                    <div className="flex gap-4 transform translate-y-4 transition-transform duration-500 ease-in-out group-hover:translate-y-0">
                      <Link
                        href={"/"}
                        className="p-5 rounded-full bg-secondary/60 hover:bg-secondary/80 transition-colors duration-300"
                      >
                        <Link2 className="w-5 h-5 text-white" />
                      </Link>
                      <Link
                        href={"/"}
                        className="p-5 rounded-full bg-secondary/60 hover:bg-secondary/80 transition-colors duration-300"
                      >
                        <Forward className="w-5 h-5 text-white" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-6 right-6 px-4 py-6 rounded-xl bg-background2 border shadow-xl text-foreground transition-all duration-500 ease-in-out transform group-hover:translate-y-2">
                <h3 className="text-xl font-semibold mb-2">{work.title}</h3>
                <p className="text-gray-600   dark:text-muted text-md">
                  {work.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
