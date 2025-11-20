import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MapPin, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface ReviewsCarouselProps {
  featured?: boolean;
  limit?: number;
}

const ReviewsCarousel = ({ featured = true, limit = 6 }: ReviewsCarouselProps) => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', featured, limit],
    queryFn: async () => {
      let query = supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (featured) {
        query = query.eq('is_featured', true);
      }

      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No reviews available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((review) => (
        <GlassCard key={review.id} hover className="p-6 flex flex-col h-full">
          {/* Star Rating */}
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-5 h-5 ${
                  i < review.rating 
                    ? "fill-primary text-primary" 
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>

          {/* Review Text */}
          <p className="text-sm text-foreground mb-4 flex-grow leading-relaxed">
            "{review.review_text}"
          </p>

          {/* Author Info */}
          <div className="space-y-2 pt-4 border-t border-border/50">
            <p className="font-semibold text-foreground">
              {review.author_name}
            </p>
            
            {review.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{review.location}</span>
              </div>
            )}

            {review.review_date && (
              <p className="text-xs text-muted-foreground">
                {format(new Date(review.review_date), 'MMMM d, yyyy')}
              </p>
            )}

            {review.google_review_url && (
              <a
                href={review.google_review_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                View on Google
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

export default ReviewsCarousel;