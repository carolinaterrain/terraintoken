import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, MapPin, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: string;
  author_name: string;
  location: string | null;
  review_text: string;
  rating: number;
  created_at: string;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-4 h-4 ${
          star <= rating
            ? 'fill-goblin-gold text-goblin-gold'
            : 'fill-muted text-muted'
        }`}
      />
    ))}
  </div>
);

const TestimonialCard = ({ testimonial, index }: { testimonial: Testimonial; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
  >
    <Card className="p-6 h-full bg-gradient-to-br from-card to-muted/20 border-border/50 hover:border-goblin-gold/30 transition-colors">
      <div className="flex items-start gap-3 mb-4">
        <Quote className="w-8 h-8 text-goblin-gold/30 flex-shrink-0" />
        <div className="flex-1">
          <StarRating rating={testimonial.rating} />
        </div>
      </div>

      <p className="text-foreground/90 mb-4 leading-relaxed">
        "{testimonial.review_text}"
      </p>

      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold text-foreground">
          {testimonial.author_name}
        </span>
        {testimonial.location && (
          <>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {testimonial.location}
            </span>
          </>
        )}
      </div>
    </Card>
  </motion.div>
);

const TestimonialSkeleton = () => (
  <Card className="p-6 h-full">
    <div className="flex items-start gap-3 mb-4">
      <Skeleton className="w-8 h-8 rounded" />
      <div className="flex-1">
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <Skeleton className="h-20 w-full mb-4" />
    <div className="flex items-center gap-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-20" />
    </div>
  </Card>
);

export const ClientTestimonials = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, author_name, location, review_text, rating, created_at')
        .eq('is_featured', true)
        .order('sort_order', { ascending: true })
        .limit(6);

      if (error) throw error;
      return data as Testimonial[];
    },
  });

  // Don't render if no testimonials
  if (!isLoading && (!testimonials || testimonials.length === 0)) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Real Clients, Real Results
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it — hear from homeowners across the Charlotte 
            metro area who've experienced Carolina Terrain's quality work firsthand.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              <TestimonialSkeleton />
              <TestimonialSkeleton />
              <TestimonialSkeleton />
            </>
          ) : (
            testimonials?.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                index={index}
              />
            ))
          )}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          🌿 Every testimonial is from a verified Carolina Terrain customer
        </motion.p>
      </div>
    </section>
  );
};
