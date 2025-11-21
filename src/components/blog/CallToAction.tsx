import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface CallToActionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  variant?: "primary" | "secondary";
}

export const CallToAction = ({ 
  title, 
  description, 
  buttonText, 
  buttonLink,
  variant = "primary" 
}: CallToActionProps) => {
  return (
    <GlassCard className={`p-8 my-12 text-center ${
      variant === "primary" 
        ? "bg-gradient-to-br from-primary/20 to-primary/5 border-primary/40" 
        : ""
    }`}>
      <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">
        {title}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
        {description}
      </p>
      <Button size="lg" asChild>
        <Link to={buttonLink}>
          {buttonText}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
    </GlassCard>
  );
};
