import { Button } from "@/components/ui/button";
import { Twitter, Facebook, Linkedin, Link2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SocialShareButtonsProps {
  title: string;
  description: string;
  url?: string;
  hashtags?: string[];
  via?: string;
}

export const SocialShareButtons = ({ 
  title, 
  description, 
  url = typeof window !== 'undefined' ? window.location.href : '',
  hashtags = ['TerrainToken', 'TRN', 'TerrainScape'],
  via = 'carolinaterrain'
}: SocialShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title + '\n\n' + description)}&url=${encodeURIComponent(url)}&hashtags=${hashtags.join(',')}&via=${via}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const openShareWindow = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm font-semibold text-muted-foreground">Share:</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => openShareWindow(shareUrls.twitter)}
        className="gap-2"
      >
        <Twitter className="w-4 h-4" />
        Twitter
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => openShareWindow(shareUrls.facebook)}
        className="gap-2"
      >
        <Facebook className="w-4 h-4" />
        Facebook
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => openShareWindow(shareUrls.linkedin)}
        className="gap-2"
      >
        <Linkedin className="w-4 h-4" />
        LinkedIn
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        className="gap-2"
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
        {copied ? 'Copied!' : 'Copy Link'}
      </Button>
    </div>
  );
};
