import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Upload, X, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glass-card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().trim().max(200, "Title must be less than 200 characters").optional(),
  category: z.enum(['drainage', 'erosion', 'grading', 'retaining-wall', 'other'], {
    errorMap: () => ({ message: "Please select a valid category" })
  }),
  location: z.string().trim().max(200, "Location must be less than 200 characters").optional(),
  description: z.string().trim().max(2000, "Description must be less than 2000 characters").optional(),
  walletAddress: z.string().trim().max(100, "Wallet address must be less than 100 characters").optional()
    .refine((val) => !val || /^[A-Za-z0-9]+$/.test(val), "Invalid wallet address format"),
});

const UploadProject = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [dataConsent, setDataConsent] = useState(false);
  const [expectedTRN, setExpectedTRN] = useState(10);
  const [earnedTRN, setEarnedTRN] = useState(0);
  const [goblinMessage, setGoblinMessage] = useState("");
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [uploadedMediaId, setUploadedMediaId] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxSize: 10485760, // 10MB
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  });

  // Calculate expected TRN reward
  useEffect(() => {
    let reward = 10; // Base upload
    if (dataConsent) reward += 50;
    if (walletAddress) reward += 5;
    if (category === 'erosion' || category === 'drainage') reward += 10;
    setExpectedTRN(reward);
  }, [dataConsent, walletAddress, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile || !category) {
      toast({
        title: "Missing Information",
        description: "Please upload an image and select a category.",
        variant: "destructive",
      });
      return;
    }

    // Validate inputs
    try {
      projectSchema.parse({
        title,
        category,
        location,
        description,
        walletAddress
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    // Validate file type and size
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PNG, JPG, or WebP image.",
        variant: "destructive",
      });
      return;
    }

    if (imageFile.size > 10485760) {
      toast({
        title: "File Too Large",
        description: "Image must be less than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check rate limit first
      const { data: rateLimitData, error: rateLimitError } = await supabase.functions.invoke('upload-project-media', {
        body: {}
      });

      if (rateLimitError || !rateLimitData?.success) {
        toast({
          title: "Rate Limit Exceeded",
          description: "You've uploaded too many projects recently. Please try again later.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Upload image to Supabase Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('carolina-terrain-projects')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('carolina-terrain-projects')
        .getPublicUrl(fileName);

      // Insert into database
      const { data: insertData, error: insertError } = await supabase
        .from('project_media')
        .insert({
          image_url: publicUrl,
          title: title || null,
          category,
          location: location || null,
          description: description || null,
          is_featured: isFeatured,
          user_wallet_address: walletAddress || null,
          data_consent: dataConsent,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setUploadedMediaId(insertData.id);

      // Calculate TRN rewards
      if (walletAddress && insertData) {
        try {
          const { data: rewardData, error: rewardError } = await supabase.functions.invoke('calculate-trn-reward', {
            body: { 
              mediaId: insertData.id,
              walletAddress,
              dataConsent,
              category
            }
          });

          if (rewardError) {
            console.error('Reward calculation error:', rewardError);
          } else if (rewardData) {
            setEarnedTRN(rewardData.totalTRN || 0);
            setGoblinMessage(rewardData.goblinMessage || "TRN earned!");
            setShowRewardModal(true);
          }
        } catch (err) {
          console.error('Reward error:', err);
        }
      } else {
        toast({
          title: "Upload Successful!",
          description: "Your project has been added.",
        });
        navigate("/");
      }

      if (!walletAddress) {
        toast({
          title: "Success!",
          description: "Project uploaded successfully.",
        });
      }

      // Reset form (but keep modal open if rewards earned)
      if (!showRewardModal) {
        setImageFile(null);
        setImagePreview("");
        setTitle("");
        setCategory("");
        setLocation("");
        setDescription("");
        setIsFeatured(false);
        setWalletAddress("");
        setDataConsent(false);
        
        // Navigate to home after delay
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <GlassCard className="p-8">
          <h1 className="font-display text-3xl font-bold text-center mb-8">
            Upload Project Photo
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <Label>Project Image *</Label>
              {!imagePreview ? (
                <div
                  {...getRootProps()}
                  className={`mt-2 border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {isDragActive
                      ? "Drop the image here"
                      : "Drag & drop an image, or click to select"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    PNG, JPG, JPEG, WEBP (Max 10MB)
                  </p>
                </div>
              ) : (
                <div className="relative mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="mt-2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="drainage">Drainage & Grading</SelectItem>
                  <SelectItem value="hardscape">Hardscapes & Walls</SelectItem>
                  <SelectItem value="erosion">Erosion & Slopes</SelectItem>
                  <SelectItem value="before-after">Before & After</SelectItem>
                  <SelectItem value="outdoor-living">Outdoor Living</SelectItem>
                  <SelectItem value="team">Team & Founders</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="French Drain Installation"
                className="mt-2"
              />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Waxhaw, NC"
                className="mt-2"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the project..."
                className="mt-2"
                rows={4}
              />
            </div>

            {/* Earn TRN Section */}
            <div className="border-t border-primary/20 pt-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-xl font-bold">🌱 Earn TRN Rewards</h3>
                <span className="text-primary font-bold text-lg">Up to {expectedTRN} TRN</span>
              </div>
              
              <div>
                <Label htmlFor="wallet">Solana Wallet Address (Optional)</Label>
                <Input
                  id="wallet"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter your Solana wallet to earn TRN"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Need a wallet? Get one at <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Phantom.app</a>
                </p>
              </div>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="dataConsent"
                    checked={dataConsent}
                    onChange={(e) => setDataConsent(e.target.checked)}
                    className="w-5 h-5 mt-1 cursor-pointer"
                  />
                  <div className="flex-1">
                    <Label htmlFor="dataConsent" className="cursor-pointer text-base">
                      <div className="flex items-center gap-2 mb-2">
                        <span>Allow AI Training Use</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">+50 TRN</span>
                      </div>
                      <p className="font-normal text-sm text-muted-foreground">
                        Help improve our terrain AI models. Your photo will be anonymized and used for training.
                      </p>
                    </Label>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-display font-bold mb-3">Estimated TRN Rewards</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Base Upload</span><span className="font-bold text-primary">+10 TRN</span></div>
                  {dataConsent && <div className="flex justify-between animate-fade-in"><span className="text-muted-foreground">AI Training Consent</span><span className="font-bold text-primary">+50 TRN</span></div>}
                  {walletAddress && <div className="flex justify-between animate-fade-in"><span className="text-muted-foreground">Wallet Provided</span><span className="font-bold text-primary">+5 TRN</span></div>}
                  {(category === 'erosion' || category === 'drainage') && <div className="flex justify-between animate-fade-in"><span className="text-muted-foreground">High-Value Category</span><span className="font-bold text-primary">+10 TRN</span></div>}
                  <div className="border-t border-primary/20 pt-2 mt-2"><div className="flex justify-between text-lg"><span className="font-bold">Total</span><span className="font-bold text-primary">{expectedTRN} TRN</span></div></div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">Additional rewards: +25 TRN for validation, +15 TRN for social share</p>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !imageFile || !category}
            >
              {isSubmitting ? "Uploading..." : "Upload Project"}
            </Button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default UploadProject;