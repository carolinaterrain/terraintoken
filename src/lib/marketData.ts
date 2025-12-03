/**
 * Market landscape data for TRN ecosystem
 * Based on strategic analysis document
 */

export interface MarketSegment {
  name: string;
  size2024: number;
  size2029: number;
  cagr: number;
  description: string;
  color: string;
}

export const marketSegments: MarketSegment[] = [
  {
    name: 'Drainage & Erosion Control',
    size2024: 20.4,
    size2029: 29.65,
    cagr: 7.8,
    description: 'Drainage maintenance, grading, and erosion management services',
    color: 'hsl(var(--chart-1))'
  },
  {
    name: 'AI in Construction',
    size2024: 4.0,
    size2029: 11.8,
    cagr: 24.2,
    description: 'AI-powered construction tech, project management, and site analysis',
    color: 'hsl(var(--chart-2))'
  },
  {
    name: 'Landscaping Services (US)',
    size2024: 115.0,
    size2029: 148.0,
    cagr: 5.2,
    description: '660k+ US landscaping businesses, mostly small contractors',
    color: 'hsl(var(--chart-3))'
  }
];

export interface TamSamSom {
  label: string;
  value: number;
  description: string;
  percentage?: number;
}

export const marketOpportunity: TamSamSom[] = [
  {
    label: 'TAM (Total Addressable Market)',
    value: 29.65,
    description: 'Global drainage & erosion control market by 2029',
    percentage: 100
  },
  {
    label: 'SAM (Serviceable Available Market)',
    value: 7.9,
    description: 'US contractor market accessible via AI tools (1% of 660k businesses)',
    percentage: 26.6
  },
  {
    label: 'SOM (Serviceable Obtainable Market)',
    value: 2.5,
    description: 'Conservative 3-year capture target with aggressive marketing',
    percentage: 31.6
  }
];

export interface CompetitiveLandscape {
  category: string;
  competitors: string[];
  gap: string;
  trnAdvantage: string;
}

export const competitiveLandscape: CompetitiveLandscape[] = [
  {
    category: 'Traditional Drainage',
    competitors: ['On-site consultations', 'Manual estimation', 'Experience-based pricing'],
    gap: 'Expensive, slow, inconsistent',
    trnAdvantage: 'AI-powered instant analysis at 1/10th the cost'
  },
  {
    category: 'Construction AI',
    competitors: ['Procore', 'Autodesk BIM 360', 'PlanGrid'],
    gap: 'General project management, not terrain-specific',
    trnAdvantage: 'First AI specialized in terrain intelligence and drainage'
  },
  {
    category: 'Data Marketplaces',
    competitors: ['AWS Data Exchange', 'Snowflake Marketplace'],
    gap: 'Generic data, no terrain focus',
    trnAdvantage: 'Only marketplace for terrain datasets, templates, and drainage designs'
  },
  {
    category: 'Utility Tokens',
    competitors: ['Generic meme coins', 'Reflection tokens'],
    gap: 'No real-world backing or utility',
    trnAdvantage: 'Token backed by real business, AI platform, and marketplace'
  }
];

export interface AdoptionDriver {
  title: string;
  stat: string;
  description: string;
  icon: string;
}

export const adoptionDrivers: AdoptionDriver[] = [
  {
    title: 'AI Adoption Accelerating',
    stat: '70%+',
    description: 'Organizations have adopted AI in at least one business function (2024)',
    icon: 'Brain'
  },
  {
    title: 'Fragmented Market',
    stat: '660k+',
    description: 'US landscaping businesses, mostly small firms needing efficiency tools',
    icon: 'Users'
  },
  {
    title: 'Thin Margins',
    stat: '10-15%',
    description: 'Typical contractor profit margins; cost-saving tools are critical',
    icon: 'TrendingDown'
  },
  {
    title: 'Experience-Based Estimation',
    stat: '90%+',
    description: 'Contractors rely on gut feel, not data—creating opportunity for AI disruption',
    icon: 'Brain'
  },
  {
    title: 'Rising Compute Costs',
    stat: '↓ 40%/yr',
    description: 'AI compute costs declining rapidly, making enterprise AI accessible to SMBs',
    icon: 'Zap'
  },
  {
    title: 'Climate Impact',
    stat: '$150B',
    description: 'Annual US flood damage; drainage solutions increasingly critical',
    icon: 'CloudRain'
  }
];

export const marketPositioning = {
  blueOcean: {
    title: 'Blue Ocean Strategy',
    description: 'TerrainVision occupies unclaimed territory at the intersection of AI, terrain intelligence, and blockchain utility.',
    competitors: 'No direct competitors offering AI terrain analysis + data marketplace + utility token ecosystem'
  },
  firstMover: {
    title: 'First-Mover Advantage',
    description: 'Category leadership established before the category exists at scale.',
    timeline: '2025-2026: Early adoption phase. 2027+: Category recognition and market validation.'
  },
  networkEffects: {
    title: 'Network Effects',
    description: 'More users → More data → Better AI → More users → Higher token utility',
    flywheel: 'Data contributions improve AI accuracy, which attracts more users, which increases token demand'
  }
};

// Protocol comparison data based on strategic research
export interface ProtocolComparison {
  name: string;
  category: 'Data' | 'Compute' | 'Climate/ReFi' | 'Infrastructure' | 'Oracle';
  focus: string;
  dataType: string;
  trnSynergy: string;
  fdv?: string;
  color: string;
}

export const protocolComparison: ProtocolComparison[] = [
  {
    name: 'Hivemapper',
    category: 'Data',
    focus: 'Street-level mapping',
    dataType: 'Road imagery, GPS',
    trnSynergy: 'Complementary ground-truth: terrain + roads = complete property intelligence',
    fdv: '$150M+',
    color: 'hsl(var(--chart-1))'
  },
  {
    name: 'WeatherXM',
    category: 'Data',
    focus: 'Weather stations',
    dataType: 'Temperature, humidity, precipitation',
    trnSynergy: 'Weather data enhances drainage timing predictions',
    fdv: '$50M+',
    color: 'hsl(var(--chart-1))'
  },
  {
    name: 'Ocean Protocol',
    category: 'Data',
    focus: 'Data marketplace',
    dataType: 'Generic datasets',
    trnSynergy: 'Terrain data marketplace integration potential',
    fdv: '$200M+',
    color: 'hsl(var(--chart-1))'
  },
  {
    name: 'Switchboard',
    category: 'Oracle',
    focus: 'Solana oracles',
    dataType: 'Price feeds, randomness',
    trnSynergy: 'TRN can serve as terrain oracle feed provider',
    fdv: '$100M+',
    color: 'hsl(var(--chart-4))'
  },
  {
    name: 'Render',
    category: 'Compute',
    focus: 'GPU rendering',
    dataType: 'Compute jobs',
    trnSynergy: 'Distributed compute for terrain AI processing',
    fdv: '$2B+',
    color: 'hsl(var(--chart-2))'
  },
  {
    name: 'Akash',
    category: 'Compute',
    focus: 'Decentralized cloud',
    dataType: 'General compute',
    trnSynergy: 'Cost-effective infrastructure for TerrainVision AI',
    fdv: '$500M+',
    color: 'hsl(var(--chart-2))'
  },
  {
    name: 'Toucan',
    category: 'Climate/ReFi',
    focus: 'Carbon credits',
    dataType: 'Offset certificates',
    trnSynergy: 'Compute-to-offset integration for sustainable AI',
    fdv: '$50M+',
    color: 'hsl(var(--chart-3))'
  },
  {
    name: 'Regen Network',
    category: 'Climate/ReFi',
    focus: 'Ecological credits',
    dataType: 'Land stewardship',
    trnSynergy: 'Impact certificates for terrain contributions',
    fdv: '$30M+',
    color: 'hsl(var(--chart-3))'
  },
  {
    name: 'KlimaDAO',
    category: 'Climate/ReFi',
    focus: 'Carbon DeFi',
    dataType: 'Carbon reserves',
    trnSynergy: 'Treasury carbon offset mechanism',
    fdv: '$20M+',
    color: 'hsl(var(--chart-3))'
  },
  {
    name: 'Peaq',
    category: 'Infrastructure',
    focus: 'Machine DIDs',
    dataType: 'Device identity',
    trnSynergy: 'FlowGuardian sensor verification and device registry',
    fdv: '$200M+',
    color: 'hsl(var(--chart-5))'
  },
  {
    name: 'Wormhole',
    category: 'Infrastructure',
    focus: 'Cross-chain bridge',
    dataType: 'Asset transfers',
    trnSynergy: 'Multi-chain TRN expansion pathway',
    fdv: '$1B+',
    color: 'hsl(var(--chart-5))'
  },
  {
    name: 'TRN',
    category: 'Data',
    focus: 'Terrain intelligence',
    dataType: 'Drainage, grading, erosion',
    trnSynergy: 'The connective tissue of the physical-digital stack',
    fdv: '$25K',
    color: 'hsl(var(--primary))'
  }
];

// Physical stack layers for visualization
export interface PhysicalStackLayer {
  name: string;
  description: string;
  components: string[];
  color: string;
  icon: string;
}

export const physicalStackLayers: PhysicalStackLayer[] = [
  {
    name: 'Value Layer',
    description: 'Token economics and DeFi integration',
    components: ['TRN Token', 'Impact Credits', 'Staking', 'Governance'],
    color: 'hsl(var(--chart-4))',
    icon: 'Coins'
  },
  {
    name: 'Data Layer',
    description: 'Terrain intelligence and sensor networks',
    components: ['TerrainVision AI', 'Sensor Networks', 'Oracle Feeds', 'Data Marketplace'],
    color: 'hsl(var(--chart-1))',
    icon: 'Database'
  },
  {
    name: 'Compute Layer',
    description: 'Distributed processing infrastructure',
    components: ['AI Processing', 'Edge Nodes', 'Distributed Compute', 'Model Training'],
    color: 'hsl(var(--chart-2))',
    icon: 'Cpu'
  },
  {
    name: 'Energy Layer',
    description: 'Clean energy and grid optimization',
    components: ['FlowGuardian', 'Grid Optimization', 'Renewable Integration', 'Carbon Tracking'],
    color: 'hsl(var(--chart-3))',
    icon: 'Zap'
  }
];

// TRN unique positioning
export const trnPositioning = {
  tagline: 'Watts to Sats: From Energy to Intelligence to Value',
  uniqueValue: 'First protocol to unify physical infrastructure data with tokenized incentives',
  keyDifferentiators: [
    {
      title: 'Ground-Truth Oracle',
      description: 'Real terrain data from licensed contractors, not synthetic or scraped'
    },
    {
      title: 'Proof-of-Terrain',
      description: 'Verified contributions from actual site work, not just sensor readings'
    },
    {
      title: 'Physical-Digital Bridge',
      description: 'Connects $30B drainage market to Web3 infrastructure'
    },
    {
      title: 'Multi-Protocol Hub',
      description: 'Integration points with data, compute, climate, and infrastructure protocols'
    }
  ],
  categories: ['DePIN', 'ReFi', 'DeSci'] as const
};
