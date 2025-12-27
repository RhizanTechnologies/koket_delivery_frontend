import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ContactMethodCardProps {
  icon: LucideIcon;
  label: string;
  text1: string;
  text2: string;
  iconColor?: string;
  link?: string;
}
function ContactMethodCard({
  icon: Icon,
  label,
  text1,
  text2,
  iconColor = "text-primary",
  link,
}: ContactMethodCardProps) {
  const CardContent = (
    <>
      <div className="flex items-center justify-center mb-3">
        <span className="bg-primary/10 rounded-full p-4 flex items-center justify-center">
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </span>
      </div>
      <div className="flex flex-col items-center justify-center ">
        <p className="text-lg font-bold text-black mb-1">{label}</p>
        <p className="text-gray-700 text-sm">{text1}</p>
        <p className="text-gray-700 text-sm">{text2}</p>
      </div>
    </>
  );

  if (link) {
    const isExternalLink = link.startsWith('http');
    return (
      <a 
        href={link} 
        {...(isExternalLink && { target: "_blank", rel: "noopener noreferrer" })}
      >
        <Card className="flex flex-col items-center justify-center p-2 lg:p-6 hover:shadow-lg transition-shadow cursor-pointer rounded-xl gap-0">
          {CardContent}
        </Card>
      </a>
    );
  }

  return (
    <Card className="flex flex-col items-center justify-center p-2 lg:p-6 hover:shadow-lg transition-shadow cursor-pointer rounded-xl gap-0">
      {CardContent}
    </Card>
  );
}

export default ContactMethodCard;
