import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Upload, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glass-card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
  useState(() => {
    let reward = 10; // Base upload
    if (dataConsent) reward += 50;
    if (walletAddress) reward += 5;
    if (category === 'erosion' || category === 'drainage') reward += 10;
    setExpectedTRN(reward);
  });

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

    setIsSubmitting(true);

    try {
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

      // Calculate TRN rewards
      if (walletAddress && insertData) {
        const { data: rewardData } = await supabase.functions.invoke('calculate-trn-reward', {
          body: { 
            mediaId: insertData.id,
            walletAddress,
            dataConsent,
            category
          }
        });

        if (rewardData) {
          setEarnedTRN(rewardData.totalTRN);
          setGoblinMessage(rewardData.goblinMessage);
          setShowRewardModal(true);
        }
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

            {/* Featured Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Mark as Featured
              </Label>
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