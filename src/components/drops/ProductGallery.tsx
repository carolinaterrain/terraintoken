import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductImages, ProductImageType } from '@/hooks/useProductImages';
import { ImageLightbox } from './ImageLightbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ZoomIn, ChevronLeft, ChevronRight, Image as ImageIcon, Sparkles } from 'lucide-react';

interface ProductGalleryProps {
  itemType: 'shirt' | 'hat' | 'bundle';
}

export function ProductGallery({ itemType }: ProductGalleryProps) {
  const { images, imageUrls, primaryImage, isLoading, hasImages } = useProductImages(itemType);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentImage = imageUrls[selectedIndex] || primaryImage;

  const handlePrevious = () => {
    setSelectedIndex(prev => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex(prev => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="grid grid-cols-3 gap-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show placeholder state if no images
  if (!hasImages) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-card/50 border border-primary/20 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Product Images Coming Soon</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Professional mockups will be displayed here once synced from our print partner.
          </p>
          <Badge variant="outline" className="bg-primary/5">
            <Sparkles className="w-3 h-3 mr-1" />
            Community-Designed Logo Featured
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          {/* Main Image */}
          <div className="md:col-span-3 relative group">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-square bg-gradient-to-br from-primary/5 to-card rounded-2xl overflow-hidden border border-primary/20"
            >
              <img
                src={currentImage}
                alt={`Product view ${selectedIndex + 1}`}
                className="w-full h-full object-contain p-4 cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
              />
              
              {/* Zoom indicator */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ZoomIn className="w-4 h-4 text-foreground" />
              </button>

              {/* Navigation arrows */}
              {imageUrls.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                  >
                    <ChevronLeft className="w-5 h-5 text-foreground" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                  >
                    <ChevronRight className="w-5 h-5 text-foreground" />
                  </button>
                </>
              )}

              {/* Image counter */}
              {imageUrls.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-medium">
                  {selectedIndex + 1} / {imageUrls.length}
                </div>
              )}
            </motion.div>

            {/* Source badge */}
            {images[selectedIndex]?.image_source === 'ai_generated' && (
              <Badge 
                variant="outline" 
                className="absolute top-4 left-4 bg-background/80 backdrop-blur text-xs"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Preview Mockup
              </Badge>
            )}
          </div>

          {/* Thumbnail Grid */}
          <div className="md:col-span-2 grid grid-cols-3 md:grid-cols-2 gap-2">
            {imageUrls.map((url, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedIndex(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  index === selectedIndex
                    ? 'border-primary shadow-[0_0_15px_hsl(142_76%_39%/0.3)]'
                    : 'border-border/50 hover:border-primary/50'
                }`}
              >
                <img
                  src={url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}

            {/* Placeholder thumbnails if less than 6 images */}
            {imageUrls.length < 6 && [...Array(6 - imageUrls.length)].map((_, i) => (
              <div
                key={`placeholder-${i}`}
                className="aspect-square rounded-lg border-2 border-dashed border-border/30 flex items-center justify-center bg-muted/20"
              >
                <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <ImageLightbox
        images={imageUrls}
        initialIndex={selectedIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </>
  );
}
