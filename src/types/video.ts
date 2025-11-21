export interface VideoUpdate {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category: 'price-action' | 'demo' | 'update' | 'team' | 'community';
  duration: number; // in seconds
  date: string;
  author: string;
  views?: number;
  featured?: boolean;
}

export const categoryColors = {
  'price-action': 'from-primary to-primary/80',
  'demo': 'from-blue-500 to-blue-600',
  'update': 'from-yellow-500 to-yellow-600',
  'team': 'from-purple-500 to-purple-600',
  'community': 'from-orange-500 to-orange-600',
} as const;

export const categoryLabels = {
  'price-action': 'Price Action',
  'demo': 'Demo',
  'update': 'Update',
  'team': 'Team',
  'community': 'Community',
} as const;
