import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const UploadTestimonial = () => {
  const navigate = useNavigate();
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [location, setLocation] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authorName || !reviewText) {
      toast({
        title: "Missing Information",
        description: "Please provide author name and review text.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('testimonials')
        .insert({
          author_name: authorName,
          rating,
          review_text: reviewText,
          location: location || null,
          review_date: reviewDate || null,
          google_review_url: googleReviewUrl || null,
          is_featured: isFeatured,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Testimonial added successfully.",
      });

      // Reset form
      setAuthorName("");
      setRating(5);
      setReviewText("");
      setLocation("");
      setReviewDate("");
      setGoogleReviewUrl("");
      setIsFeatured(false);

      // Navigate to home after delay
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error adding the testimonial. Please try again.",
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
            Add Testimonial
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Author Name */}
            <div>
              <Label htmlFor="authorName">Customer Name *</Label>
              <Input
                id="authorName"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="John Smith"
                className="mt-2"
                required
              />
            </div>

            {/* Rating */}
            <div>
              <Label>Rating *</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div>
              <Label htmlFor="reviewText">Review *</Label>
              <Textarea
                id="reviewText"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write the customer's review..."
                className="mt-2"
                rows={6}
                required
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

            {/* Review Date */}
            <div>
              <Label htmlFor="reviewDate">Review Date</Label>
              <Input
                id="reviewDate"
                type="date"
                value={reviewDate}
                onChange={(e) => setReviewDate(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Google Review URL */}
            <div>
              <Label htmlFor="googleReviewUrl">Google Review URL</Label>
              <Input
                id="googleReviewUrl"
                type="url"
                value={googleReviewUrl}
                onChange={(e) => setGoogleReviewUrl(e.target.value)}
                placeholder="https://g.page/r/..."
                className="mt-2"
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
              disabled={isSubmitting || !authorName || !reviewText}
            >
              {isSubmitting ? "Adding..." : "Add Testimonial"}
            </Button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default UploadTestimonial;