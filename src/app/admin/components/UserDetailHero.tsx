import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Customer } from "../../types/customer";

interface UserDetailHeroProps {
  user: Customer;
}

export default function UserDetailHero({ user }: UserDetailHeroProps) {
  return (
    <div className="bg-background-2 section-spacing">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center">
          <div className="pr-2">
            <img
              src="../../../../assets/User.png"
              alt="user png"
              className="h-14 w-12 sm:h-16 sm:w-14"
            />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-kaushan italic text-foreground">
              User Details
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Detailed information about {user.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
