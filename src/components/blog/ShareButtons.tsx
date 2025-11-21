import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Facebook, Link2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareButtonsProps {
  title: string;
  description: string;
  url: string;
}

export const ShareButtons = ({ title, description, url }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&hashtags=TerrainToken,TRN,Solana`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 my-8 p-4 bg-card/40 rounded-lg border border-primary/20">
      <span className="text-sm font-semibold text-muted-foreground">Share:</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(shareUrls.twitter, '_blank')}
      >
        <Twitter className="w-4 h-4 mr-2" />
        Twitter
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(shareUrls.linkedin, '_blank')}
      >
        <Linkedin className="w-4 h-4 mr-2" />
        LinkedIn
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(shareUrls.facebook, '_blank')}
      >
        <Facebook className="w-4 h-4 mr-2" />
        Facebook
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
      >
        {copied ? <Check className="w-4 h-4 mr-2" /> : <Link2 className="w-4 h-4 mr-2" />}
        {copied ? 'Copied!' : 'Copy Link'}
      </Button>
    </div>
  );
};
