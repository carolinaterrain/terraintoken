/**
 * Revenue streams data for TRN ecosystem
 * Based on strategic analysis document
 */

export interface RevenueStream {
  id: string;
  name: string;
  description: string;
  pricing: string;
  marketSize: string;
  captureTarget: string;
  arrProjection: string;
  category: 'recurring' | 'one-off';
  priority: 'high' | 'medium' | 'low';
  timeline: string;
}

export const revenueStreams: RevenueStream[] = [
  // Recurring Revenue Streams
  {
    id: 'contractor-subs',
    name: 'Contractor Subscriptions',
    description: 'Tiered monthly plans for small to mid-size contractors',
    pricing: '$49-$300/month',
    marketSize: '660k+ US landscaping businesses',
    captureTarget: '1% market share = 6,600 subscribers',
    arrProjection: '$7.9M at 1% capture',
    category: 'recurring',
    priority: 'high',
    timeline: 'Q1 2026'
  },
  {
    id: 'enterprise-licensing',
    name: 'Enterprise Licensing',
    description: 'Annual licenses for large facility management firms and government agencies',
    pricing: '$25k-$200k/year',
    marketSize: 'Fortune 500 facilities & municipalities',
    captureTarget: '20 enterprise clients',
    arrProjection: '$1M+ (20 clients @ $50k avg)',
    category: 'recurring',
    priority: 'high',
    timeline: 'Q3 2026'
  },
  {
    id: 'api-usage',
    name: 'API Usage Fees',
    description: 'Public API for PropTech, insurance platforms, and smart-city dashboards',
    pricing: '$1-5 per analysis or $100/mo dev subscription',
    marketSize: 'Insurance tech, PropTech apps',
    captureTarget: 'Few large volume clients',
    arrProjection: '$500k+ with key partnerships',
    category: 'recurring',
    priority: 'medium',
    timeline: 'Q4 2026'
  },
  {
    id: 'marketplace-fees',
    name: 'Marketplace Transaction Fees',
    description: '5-15% commission on terrain data, templates, and design transactions',
    pricing: '10% average commission',
    marketSize: 'Terrain Data Marketplace',
    captureTarget: '$10M in transactions by 2028',
    arrProjection: '$1M (10% of $10M GMV)',
    category: 'recurring',
    priority: 'high',
    timeline: '2026 launch, scale 2027-2028'
  },
  {
    id: 'training-library',
    name: 'Training Library Subscriptions',
    description: 'Premium educational content, courses, and certification programs',
    pricing: '$10-30/month or $199/year',
    marketSize: 'Contractors seeking certification',
    captureTarget: '1,000 subscribers @ $20/mo',
    arrProjection: '$240k annually',
    category: 'recurring',
    priority: 'medium',
    timeline: 'Q2 2026'
  },
  {
    id: 'staking-discounts',
    name: 'Staking-Based Loyalty Program',
    description: 'TRN stakers unlock 10% subscription discounts and bonus API credits',
    pricing: 'Indirect revenue (retention + token demand)',
    marketSize: 'Existing subscriber base',
    captureTarget: '30% of subscribers stake',
    arrProjection: 'Indirect: +$200k in retention value',
    category: 'recurring',
    priority: 'medium',
    timeline: 'Q1 2026'
  },
  {
    id: 'white-label',
    name: 'White-Label AI Licenses',
    description: 'Retailers and equipment companies embed TerrainVision in their platforms',
    pricing: '$30k-$100k/year + integration fee',
    marketSize: 'Home improvement chains, OEMs',
    captureTarget: '5 white-label partners',
    arrProjection: '$300k (5 partners @ $60k avg)',
    category: 'recurring',
    priority: 'low',
    timeline: '2027+'
  },
  {
    id: 'sponsored-placements',
    name: 'Sponsored Product Placements',
    description: 'Drainage manufacturers pay for visibility in AI recommendations',
    pricing: '$500-$5,000/month',
    marketSize: 'Drainage product manufacturers',
    captureTarget: '10 active sponsors',
    arrProjection: '$180k (10 sponsors @ $1.5k/mo)',
    category: 'recurring',
    priority: 'low',
    timeline: 'Q4 2026'
  },

  // One-Off Revenue Streams
  {
    id: 'pay-per-use',
    name: 'Pay-Per-Use Analyses',
    description: 'Single analysis purchases for homeowners and casual users',
    pricing: '$10-30 per analysis',
    marketSize: 'US homeowners (post-storm demand)',
    captureTarget: '50k analyses/year',
    arrProjection: '$1M (50k @ $20 avg)',
    category: 'one-off',
    priority: 'high',
    timeline: 'Immediate'
  },
  {
    id: 'data-verification',
    name: 'Data Upload/Verification Fees',
    description: 'Quality certification for large dataset uploads',
    pricing: '$5 per 100 photos or $50 per dataset',
    marketSize: 'Professional data contributors',
    captureTarget: 'Use sparingly to encourage contributions',
    arrProjection: '$50k annually',
    category: 'one-off',
    priority: 'low',
    timeline: 'Q3 2026'
  },
  {
    id: 'merchandise',
    name: 'Merchandise & Digital Collectibles',
    description: 'Branded merch and NFT art (Terry the Goblin collection)',
    pricing: '$5-50 per item',
    marketSize: 'Community members',
    captureTarget: '5,000 items sold',
    arrProjection: '$100k (5k items @ $20 avg)',
    category: 'one-off',
    priority: 'low',
    timeline: 'Ongoing'
  },
  {
    id: 'plan-templates',
    name: 'Professional Plan Templates',
    description: 'High-quality drainage design templates and CAD drawings',
    pricing: '$20-100 per template',
    marketSize: 'DIY contractors and homeowners',
    captureTarget: '10,000 template sales',
    arrProjection: '$400k (10k @ $40 avg)',
    category: 'one-off',
    priority: 'medium',
    timeline: 'Q2 2026'
  },
  {
    id: 'software-licenses',
    name: 'Software License Keys',
    description: 'One-time licenses for advanced features (offline CAD export)',
    pricing: '~$500 perpetual',
    marketSize: 'Users preferring perpetual licenses',
    captureTarget: '500 licenses',
    arrProjection: '$250k one-time',
    category: 'one-off',
    priority: 'low',
    timeline: 'Q4 2026'
  },
  {
    id: 'masterclasses',
    name: 'Masterclasses & Webinars',
    description: 'Live training events with industry experts',
    pricing: '$50-200 per seat',
    marketSize: 'Professionals seeking training',
    captureTarget: '20 events/year, 50 attendees each',
    arrProjection: '$100k (1,000 seats @ $100 avg)',
    category: 'one-off',
    priority: 'medium',
    timeline: 'Q3 2026'
  },
  {
    id: 'enterprise-onboarding',
    name: 'Enterprise Onboarding Fees',
    description: 'Custom integrations and data import services for large clients',
    pricing: '$1,000-$5,000+ per setup',
    marketSize: 'Enterprise clients',
    captureTarget: '20 enterprise setups',
    arrProjection: '$60k (20 @ $3k avg)',
    category: 'one-off',
    priority: 'medium',
    timeline: 'As needed'
  }
];

export const revenueAllocationFramework = {
  operations: {
    percentage: 50,
    description: 'Core operations, salaries, infrastructure, compute costs',
    color: 'hsl(var(--chart-1))'
  },
  communityRewards: {
    percentage: 10,
    description: 'TRN rewards vault, incentives, community programs',
    color: 'hsl(var(--chart-2))'
  },
  growthRnD: {
    percentage: 20,
    description: 'AI training, product development, integrations, marketing',
    color: 'hsl(var(--chart-3))'
  },
  buybacks: {
    percentage: 10,
    description: 'Strategic TRN buyback and burn programs',
    color: 'hsl(var(--chart-4))'
  },
  strategic: {
    percentage: 10,
    description: 'Reserves, partnerships, opportunistic investments',
    color: 'hsl(var(--chart-5))'
  }
};

// Calculate total projected ARR
export const calculateProjectedARR = () => {
  const recurring = revenueStreams
    .filter(s => s.category === 'recurring')
    .reduce((sum, s) => {
      const arr = parseFloat(s.arrProjection.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(arr) ? 0 : arr);
    }, 0);

  const oneOff = revenueStreams
    .filter(s => s.category === 'one-off')
    .reduce((sum, s) => {
      const arr = parseFloat(s.arrProjection.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(arr) ? 0 : arr);
    }, 0);

  return {
    recurring,
    oneOff,
    total: recurring + oneOff
  };
};