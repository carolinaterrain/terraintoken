import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// All 22 product image types
export type ProductImageType = 
  // Collector Shirt
  | 'collector-shirt-front' 
  | 'collector-shirt-lifestyle'
  // Hoodie
  | 'hoodie-front'
  | 'hoodie-lifestyle'
  // Work Tee
  | 'work-tee-front'
  | 'work-tee-lifestyle'
  // Hat
  | 'collector-hat-front' 
  | 'collector-hat-lifestyle'
  // Beanie
  | 'beanie-front'
  | 'beanie-lifestyle'
  // Mug
  | 'coffee-mug-front'
  | 'coffee-mug-lifestyle'
  // Keychain
  | 'keychain-front'
  | 'keychain-lifestyle'
  // Stickers
  | 'sticker-pack-front'
  | 'sticker-pack-lifestyle'
  // Bundle
  | 'collector-bundle-hero'
  | 'collector-bundle-contents'
  // Certificate
  | 'nft-certificate-display'
  | 'nft-certificate-mobile'
  // Marketing
  | 'brand-hero-all-products'
  | 'lifestyle-team-shot';

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

// All 22 image types for generation
export const ALL_PRODUCT_IMAGE_TYPES: ProductImageType[] = [
  'collector-shirt-front',
  'collector-shirt-lifestyle',
  'hoodie-front',
  'hoodie-lifestyle',
  'work-tee-front',
  'work-tee-lifestyle',
  'collector-hat-front',
  'collector-hat-lifestyle',
  'beanie-front',
  'beanie-lifestyle',
  'coffee-mug-front',
  'coffee-mug-lifestyle',
  'keychain-front',
  'keychain-lifestyle',
  'sticker-pack-front',
  'sticker-pack-lifestyle',
  'collector-bundle-hero',
  'collector-bundle-contents',
  'nft-certificate-display',
  'nft-certificate-mobile',
  'brand-hero-all-products',
  'lifestyle-team-shot'
];

// Map product categories to their image types
const PRODUCT_CATEGORY_IMAGES: Record<string, ProductImageType[]> = {
  'collector-shirt': ['collector-shirt-front', 'collector-shirt-lifestyle'],
  'hoodie': ['hoodie-front', 'hoodie-lifestyle'],
  'work-tee': ['work-tee-front', 'work-tee-lifestyle'],
  'collector-hat': ['collector-hat-front', 'collector-hat-lifestyle'],
  'beanie': ['beanie-front', 'beanie-lifestyle'],
  'coffee-mug': ['coffee-mug-front', 'coffee-mug-lifestyle'],
  'keychain': ['keychain-front', 'keychain-lifestyle'],
  'sticker-pack': ['sticker-pack-front', 'sticker-pack-lifestyle'],
  'bundle': ['collector-bundle-hero', 'collector-bundle-contents', 'nft-certificate-display'],
  'certificate': ['nft-certificate-display', 'nft-certificate-mobile'],
  'marketing': ['brand-hero-all-products', 'lifestyle-team-shot']
};

// Map Shopify product handles to image categories
const SHOPIFY_HANDLE_TO_CATEGORY: Record<string, string> = {
  'trn-collector-tee': 'collector-shirt',
  'trn-premium-hoodie': 'hoodie',
  'trn-work-tee': 'work-tee',
  'trn-collector-hat': 'collector-hat',
  'trn-beanie': 'beanie',
  'trn-coffee-mug': 'coffee-mug',
  'trn-keychain': 'keychain',
  'trn-sticker-pack': 'sticker-pack',
  'trn-collector-bundle': 'bundle',
  'terrain-token-collector-edition': 'bundle',
  // Additional handle variations
  'collector-tee': 'collector-shirt',
  'collector-shirt': 'collector-shirt',
  'premium-hoodie': 'hoodie',
  'hoodie': 'hoodie',
  'work-tee': 'work-tee',
  'collector-hat': 'collector-hat',
  'hat': 'collector-hat',
  'beanie': 'beanie',
  'coffee-mug': 'coffee-mug',
  'mug': 'coffee-mug',
  'keychain': 'keychain',
  'sticker-pack': 'sticker-pack',
  'stickers': 'sticker-pack',
  'collector-bundle': 'bundle',
  'bundle': 'bundle'
};

// Map product titles to categories (for fuzzy matching)
export const getProductCategory = (handle: string, title?: string): string | null => {
  // Direct handle match
  const directMatch = SHOPIFY_HANDLE_TO_CATEGORY[handle.toLowerCase()];
  if (directMatch) return directMatch;

  // Fuzzy matching based on handle/title keywords
  const text = `${handle} ${title || ''}`.toLowerCase();
  
  if (text.includes('hoodie')) return 'hoodie';
  if (text.includes('beanie')) return 'beanie';
  if (text.includes('hat') || text.includes('cap')) return 'collector-hat';
  if (text.includes('work') && text.includes('tee')) return 'work-tee';
  if (text.includes('shirt') || text.includes('tee')) return 'collector-shirt';
  if (text.includes('mug') || text.includes('coffee')) return 'coffee-mug';
  if (text.includes('keychain') || text.includes('key')) return 'keychain';
  if (text.includes('sticker')) return 'sticker-pack';
  if (text.includes('bundle') || text.includes('collector')) return 'bundle';
  
  return null;
};

// Legacy mapping for backward compatibility
const ITEM_TYPE_IMAGES: Record<string, ProductImageType[]> = {
  shirt: ['collector-shirt-front', 'collector-shirt-lifestyle', 'collector-bundle-contents'],
  hat: ['collector-hat-front', 'collector-hat-lifestyle', 'collector-bundle-contents'],
  bundle: ['collector-bundle-hero', 'collector-bundle-contents', 'collector-shirt-front', 'collector-hat-front', 'nft-certificate-display']
};

// Get images for a specific product by Shopify handle
export function useProductImagesByHandle(shopifyHandle: string) {
  const category = SHOPIFY_HANDLE_TO_CATEGORY[shopifyHandle];
  const relevantTypes = category ? PRODUCT_CATEGORY_IMAGES[category] : [];

  const { data: images, isLoading, error } = useQuery({
    queryKey: ['product-images', 'handle', shopifyHandle],
    queryFn: async () => {
      if (relevantTypes.length === 0) return [];
      
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
    staleTime: 1000 * 60 * 5,
    enabled: relevantTypes.length > 0
  });

  const primaryImage = images?.[0]?.public_url || FALLBACK_IMAGE;
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

// Get images by category
export function useProductImagesByCategory(category: keyof typeof PRODUCT_CATEGORY_IMAGES) {
  const relevantTypes = PRODUCT_CATEGORY_IMAGES[category] || [];

  const { data: images, isLoading, error } = useQuery({
    queryKey: ['product-images', 'category', category],
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
    staleTime: 1000 * 60 * 5
  });

  const primaryImage = images?.[0]?.public_url || FALLBACK_IMAGE;
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

// Original hook for backward compatibility
export function useProductImages(itemType: 'shirt' | 'hat' | 'bundle' = 'shirt') {
  const relevantTypes = ITEM_TYPE_IMAGES[itemType] || ['collector-shirt-front'];

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
    staleTime: 1000 * 60 * 5,
  });

  const primaryImage = images?.[0]?.public_url || FALLBACK_IMAGE;
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
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as ProductImage[];
    }
  });
}

// Generate all 22 product images at once
export function useGenerateAllProductImages() {
  const generateImage = useGenerateProductImage();
  const queryClient = useQueryClient();

  const generateAll = async (regenerate = false) => {
    const results = [];
    
    for (const type of ALL_PRODUCT_IMAGE_TYPES) {
      try {
        console.log(`Generating ${type}...`);
        const result = await generateImage.mutateAsync({ productType: type, regenerate });
        results.push({ type, success: true, data: result });
      } catch (error) {
        console.error(`Failed to generate ${type}:`, error);
        results.push({ type, success: false, error });
      }
    }

    queryClient.invalidateQueries({ queryKey: ['product-images'] });

    return results;
  };

  // Generate images by category
  const generateByCategory = async (category: keyof typeof PRODUCT_CATEGORY_IMAGES, regenerate = false) => {
    const types = PRODUCT_CATEGORY_IMAGES[category] || [];
    const results = [];
    
    for (const type of types) {
      try {
        console.log(`Generating ${type}...`);
        const result = await generateImage.mutateAsync({ productType: type, regenerate });
        results.push({ type, success: true, data: result });
      } catch (error) {
        console.error(`Failed to generate ${type}:`, error);
        results.push({ type, success: false, error });
      }
    }

    queryClient.invalidateQueries({ queryKey: ['product-images'] });

    return results;
  };

  return {
    generateAll,
    generateByCategory,
    isGenerating: generateImage.isPending,
    categories: Object.keys(PRODUCT_CATEGORY_IMAGES)
  };
}

// Get marketing/hero images
export function useMarketingImages() {
  return useProductImagesByCategory('marketing');
}

// Get bundle images
export function useBundleImages() {
  return useProductImagesByCategory('bundle');
}
