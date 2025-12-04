import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type ProductImageType = 
  | 'shirt-front' 
  | 'shirt-model' 
  | 'hat-front' 
  | 'hat-model' 
  | 'flat-lay' 
  | 'bundle' 
  | 'certificate';

export interface ProductImage {
  id: string;
  product_type: string;
  image_source: string;
  storage_path: string | null;
  public_url: string;
  is_active: boolean;
  display_order: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Fallback logo for when no images exist
const FALLBACK_IMAGE = '/branding/trn-logo-full.png';

// Map item types to relevant product image types
const ITEM_TYPE_IMAGES: Record<string, ProductImageType[]> = {
  shirt: ['shirt-front', 'shirt-model', 'flat-lay'],
  hat: ['hat-front', 'hat-model', 'flat-lay'],
  bundle: ['bundle', 'flat-lay', 'shirt-front', 'hat-front', 'certificate']
};

export function useProductImages(itemType: 'shirt' | 'hat' | 'bundle' = 'shirt') {
  const relevantTypes = ITEM_TYPE_IMAGES[itemType] || ['shirt-front'];

  const { data: images, isLoading, error } = useQuery({
    queryKey: ['product-images', itemType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .in('product_type', relevantTypes)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching product images:', error);
        throw error;
      }

      return (data || []) as ProductImage[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Get primary image (first in order)
  const primaryImage = images?.[0]?.public_url || FALLBACK_IMAGE;

  // Get all image URLs
  const imageUrls = images?.map(img => img.public_url) || [FALLBACK_IMAGE];

  return {
    images: images || [],
    imageUrls,
    primaryImage,
    isLoading,
    error,
    hasImages: (images?.length || 0) > 0
  };
}

// Hook for generating new images
export function useGenerateProductImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      productType, 
      regenerate = false 
    }: { 
      productType: ProductImageType; 
      regenerate?: boolean;
    }) => {
      const { data, error } = await supabase.functions.invoke('generate-product-image', {
        body: { productType, regenerate }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      return data;
    },
    onSuccess: () => {
      // Invalidate all product image queries
      queryClient.invalidateQueries({ queryKey: ['product-images'] });
    }
  });
}

// Hook for fetching all product images (admin view)
export function useAllProductImages() {
  return useQuery({
    queryKey: ['product-images', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .order('product_type')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as ProductImage[];
    }
  });
}

// Generate all product images at once
export function useGenerateAllProductImages() {
  const generateImage = useGenerateProductImage();
  const queryClient = useQueryClient();

  const generateAll = async (regenerate = false) => {
    const types: ProductImageType[] = [
      'shirt-front',
      'shirt-model', 
      'hat-front',
      'hat-model',
      'flat-lay',
      'bundle',
      'certificate'
    ];

    const results = [];
    
    for (const type of types) {
      try {
        const result = await generateImage.mutateAsync({ productType: type, regenerate });
        results.push({ type, success: true, data: result });
      } catch (error) {
        console.error(`Failed to generate ${type}:`, error);
        results.push({ type, success: false, error });
      }
    }

    // Invalidate all queries after generation
    queryClient.invalidateQueries({ queryKey: ['product-images'] });

    return results;
  };

  return {
    generateAll,
    isGenerating: generateImage.isPending
  };
}
