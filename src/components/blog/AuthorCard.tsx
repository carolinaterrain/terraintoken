import { GlassCard } from "@/components/ui/glass-card";
import { Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthorCardProps {
  name: string;
  title: string;
  bio: string;
  image: string;
  linkedin?: string;
  twitter?: string;
}

export const AuthorCard = ({ name, title, bio, image, linkedin, twitter }: AuthorCardProps) => {
  return (
    <GlassCard className="p-6 my-8">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": name,
          "jobTitle": title,
          "description": bio,
          "image": image,
          "url": "https://terraintoken.com/team"
        })}
      </script>
      
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <img 
          src={image} 
          alt={`${name} - ${title}`}
          className="w-24 h-24 rounded-full object-cover border-2 border-primary/20"
        />
        <div className="flex-1">
          <h3 className="font-display text-xl font-bold mb-1">{name}</h3>
          <p className="text-primary text-sm font-semibold mb-3">{title}</p>
          <p className="text-muted-foreground text-sm mb-4">{bio}</p>
          <div className="flex gap-3">
            {linkedin && (
              <Button variant="outline" size="sm" asChild>
                <a href={linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </a>
              </Button>
            )}
            {twitter && (
              <Button variant="outline" size="sm" asChild>
                <a href={twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
