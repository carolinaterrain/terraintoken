import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Upload, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import confetti from "canvas-confetti";

const GOBLIN_IMAGES = [
  "🌱", "⛏️", "💎", "🌍", "⚡"
];

const SubmitMeme = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [xHandle, setXHandle] = useState("");
  const [caption, setCaption] = useState("");
  const [xPostUrl, setXPostUrl] = useState("");
  const [email, setEmail] = useState("");
  const [captchaClicks, setCaptchaClicks] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"]
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  });

  const handleCaptchaClick = (index: number) => {
    const mudGoblinIndex = 1; // ⛏️ is the muddy goblin
    
    if (captchaClicks.length === 0 && index !== mudGoblinIndex) {
      toast({
        title: "Wrong goblin!",
        description: "Look for the muddy one! ⛏️",
        variant: "destructive"
      });
      return;
    }
    
    const newClicks = [...captchaClicks, index];
    setCaptchaClicks(newClicks);
    
    if (newClicks.length === 3 && newClicks.every(i => i === mudGoblinIndex)) {
      toast({
        title: "✅ CAPTCHA Passed!",
        description: "The goblins approve! You may proceed.",
      });
    } else if (newClicks.length === 3) {
      toast({
        title: "❌ CAPTCHA Failed!",
        description: "Click the same muddy goblin 3 times!",
        variant: "destructive"
      });
      setCaptchaClicks([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile) {
      toast({
        title: "No image selected!",
        description: "Please upload a meme image.",
        variant: "destructive"
      });
      return;
    }
    
    if (captchaClicks.length !== 3 || !captchaClicks.every(i => i === 1)) {
      toast({
        title: "Complete the CAPTCHA!",
        description: "Click the muddy goblin (⛏️) exactly 3 times.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload image to Supabase Storage
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("meme-submissions")
        .upload(fileName, imageFile);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("meme-submissions")
        .getPublicUrl(fileName);
      
      // Save submission to database
      const { error: insertError } = await supabase
        .from("meme_submissions")
        .insert({
          image_url: publicUrl,
          x_handle: xHandle || null,
          caption: caption || null,
          x_post_url: xPostUrl || null,
          email: email || null,
          status: "pending"
        });
      
      if (insertError) throw insertError;
      
      // Success!
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#34d399", "#6ee7b7"]
      });
      
      toast({
        title: "🎉 Meme Buried Successfully!",
        description: "The goblins are judging... Check the live feed!",
      });
      
      setTimeout(() => {
        navigate("/#meme-feed");
      }, 2000);
      
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const captchaPassed = captchaClicks.length === 3 && captchaClicks.every(i => i === 1);

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            🌱 BURY YOUR MEME IN THE SACRED GROUNDS
          </h1>
          <p className="text-lg text-muted-foreground">
            Submit your best TRN meme and join the erosion revolution!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Meme Image *
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-primary/30 hover:border-primary/50"
              }`}
            >
              <input {...getInputProps()} />
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageFile(null);
                      setImagePreview("");
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <p className="text-foreground font-medium mb-1">
                    {isDragActive ? "Drop it here!" : "Click or drag to upload"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Max 10MB • JPG, PNG, GIF, WEBP
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                X Handle
              </label>
              <Input
                value={xHandle}
                onChange={(e) => setXHandle(e.target.value)}
                placeholder="@yourhandle"
                className="bg-background border-primary/20"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email (optional)
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-background border-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              X Post URL (optional)
            </label>
            <Input
              value={xPostUrl}
              onChange={(e) => setXPostUrl(e.target.value)}
              placeholder="https://x.com/..."
              className="bg-background border-primary/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Caption (optional)
            </label>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Tell us about your meme..."
              className="bg-background border-primary/20"
              rows={3}
            />
          </div>

          {/* Goblin CAPTCHA */}
          <div className="bg-card border-2 border-primary/30 rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4 text-center">
              🔒 Goblin CAPTCHA
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Click the muddy goblin (⛏️) exactly 3 times
            </p>
            <div className="flex justify-center gap-4 mb-4">
              {GOBLIN_IMAGES.map((goblin, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleCaptchaClick(index)}
                  className={`text-5xl p-4 rounded-lg transition-all ${
                    captchaClicks.includes(index)
                      ? "bg-primary/20 scale-110"
                      : "bg-background hover:bg-muted"
                  }`}
                >
                  {goblin}
                </button>
              ))}
            </div>
            <div className="text-center">
              {captchaPassed && (
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">CAPTCHA Verified!</span>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isSubmitting || !captchaPassed}
          >
            {isSubmitting ? "Burying your meme..." : "🌱 Bury My Meme!"}
          </Button>
        </form>

        <div className="text-center mt-8">
          <a href="/" className="text-primary hover:underline">
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
};

export default SubmitMeme;
