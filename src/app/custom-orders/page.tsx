"use client";

import Link from "next/link";
import { ChevronLeft, Cake, Sparkles, Clock, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CustomOrdersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-2 to-primary/5">
      <div className="py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Navigation */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors font-medium group"
          >
            <div className="w-8 h-8 rounded-full bg-card border-2 border-border flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary transition-all">
              <ChevronLeft className="h-4 w-4" />
            </div>
            Back to Home
          </Link>

          {/* Main Content Card */}
          <Card className="overflow-hidden border-2 shadow-xl">
            {/* Decorative Header */}
            <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-8 sm:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
              
              <div className="relative">
                {/* Icon */}
                <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/20 flex items-center justify-center mb-6 animate-pulse">
                  <Cake className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 flex items-center justify-center gap-3 flex-wrap">
                  Custom Orders
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-pulse" />
                </h1>

                {/* Subtitle */}
                <p className="text-lg sm:text-xl text-muted-foreground font-medium">
                  Something Special is Baking...
                </p>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-8 sm:p-12 space-y-8">
              {/* Coming Soon Badge */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border-2 border-primary/20">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-primary">Coming Soon</span>
                </div>
              </div>

              {/* Description */}
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  We're working hard to bring you an amazing custom order experience! 
                  Soon you'll be able to design your dream cakes, pastries, and desserts 
                  tailored exactly to your preferences.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Our custom order system will allow you to:
                </p>
              </div>

              {/* Features List */}
              <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {[
                  {
                    icon: "🎂",
                    title: "Choose Your Design",
                    description: "Select from various cake styles, shapes, and sizes",
                  },
                  {
                    icon: "🎨",
                    title: "Customize Everything",
                    description: "Pick flavors, colors, decorations, and themes",
                  },
                  {
                    icon: "📝",
                    title: "Add Special Requests",
                    description: "Include dietary requirements and personal messages",
                  },
                  {
                    icon: "⏰",
                    title: "Schedule Delivery",
                    description: "Choose your preferred date and time for pickup/delivery",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:shadow-md transition-shadow"
                  >
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Call to Action */}
              <div className="text-center space-y-6 pt-4">
                <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20">
                  <Bell className="w-5 h-5 text-primary" />
                  <p className="text-sm font-medium text-foreground">
                    Want to be notified when custom orders launch?
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/contact">
                    <Button className="w-full sm:w-auto">
                      Contact Us
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Browse Products
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Footer Note */}
              <div className="text-center pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  For urgent custom orders, please{" "}
                  <Link href="/contact" className="text-primary hover:underline font-medium">
                    contact us directly
                  </Link>
                  {" "}and we'll do our best to accommodate your request.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
