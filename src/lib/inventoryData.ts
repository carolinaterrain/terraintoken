// Inventory data from tax records

export interface InventoryCategory {
  category: string;
  year: number;
  totalValue: number;
  items: InventoryItem[];
}

export interface InventoryItem {
  product: string;
  units: number;
  costPerUnit: number;
  inventoryValue: number;
}

// Drainage Supplies
export const drainageSupplies2023: InventoryItem[] = [
  { product: '4" Adapters', units: 57, costPerUnit: 13.72, inventoryValue: 782.04 },
  { product: '4" Wyes', units: 15, costPerUnit: 14.19, inventoryValue: 212.85 },
  { product: '3" Adapters', units: 64, costPerUnit: 10.71, inventoryValue: 685.44 },
  { product: '4" Caps', units: 33, costPerUnit: 7.46, inventoryValue: 246.18 },
  { product: '4" Tees', units: 10, costPerUnit: 15.44, inventoryValue: 154.40 },
  { product: '4" 90 degree', units: 10, costPerUnit: 10.94, inventoryValue: 109.40 },
  { product: '4" Pop Ups', units: 27, costPerUnit: 17.83, inventoryValue: 481.41 },
  { product: '6" Reducing Tee', units: 7, costPerUnit: 41.07, inventoryValue: 287.49 },
  { product: '12" CB', units: 8, costPerUnit: 77.39, inventoryValue: 619.12 },
  { product: '6" Perforated', units: 6, costPerUnit: 2.23, inventoryValue: 13.38 },
  { product: '6" Solid', units: 7, costPerUnit: 2.21, inventoryValue: 15.47 },
  { product: '4" Perforated', units: 8, costPerUnit: 0.87, inventoryValue: 6.96 },
  { product: '4" Solid', units: 10, costPerUnit: 0.85, inventoryValue: 8.50 },
];

export const drainageSupplies2024: InventoryItem[] = [
  { product: '6" 45 elbow - dual wall', units: 2, costPerUnit: 47.53, inventoryValue: 95.06 },
  { product: '6" 90 elbow - dual wall', units: 1, costPerUnit: 47.34, inventoryValue: 47.34 },
  { product: '6" catch basin adaptors - dual wall', units: 5, costPerUnit: 8.63, inventoryValue: 43.15 },
  { product: '8" catch basin adaptors - dual wall', units: 2, costPerUnit: 51.98, inventoryValue: 103.96 },
  { product: '4" dual wall pipe 20 foot stick', units: 120, costPerUnit: 2.46, inventoryValue: 295.20 },
  { product: '6" dual wall pipe 20 foot stick', units: 8, costPerUnit: 90.72, inventoryValue: 725.76 },
  // Many more items omitted for brevity - total in data
];

// Hardscape Materials
export const hardscapeMaterials2023: InventoryItem[] = [
  { product: 'Beige Poly Sand', units: 4, costPerUnit: 42.56, inventoryValue: 170.24 },
  { product: 'Slate Grey Poly Sand', units: 5, costPerUnit: 44.74, inventoryValue: 223.70 },
  { product: 'Plastic Edging', units: 15, costPerUnit: 11.23, inventoryValue: 168.45 },
];

export const hardscapeMaterials2024: InventoryItem[] = [
  { product: 'Belgard dimensions 12 paver', units: 144, costPerUnit: 5.86, inventoryValue: 281.28 },
  { product: 'Uniloc Trio premier three piece paver', units: 36, costPerUnit: 6.28, inventoryValue: 226.22 },
  { product: 'Belgard 9D retaining wall block', units: 1260, costPerUnit: 9.99, inventoryValue: 1279.10 },
  { product: 'Wooden pallets', units: 143, costPerUnit: 10, inventoryValue: 1430.00 },
  // Many more items
];

// Plants & Landscaping
export const plantsLandscaping2023: InventoryItem[] = [
  { product: 'Flag Iris & Tulips (1 gal)', units: 200, costPerUnit: 13.00, inventoryValue: 2600.00 },
  { product: 'Loropetalum (3 gal)', units: 12, costPerUnit: 25.00, inventoryValue: 300.00 },
  { product: 'Nandina (3 gal)', units: 13, costPerUnit: 16.00, inventoryValue: 208.00 },
  { product: 'Sunshine Ligustrum (3 gal)', units: 14, costPerUnit: 20.00, inventoryValue: 280.00 },
  { product: 'Ilex Compacta (7 gal)', units: 6, costPerUnit: 28.00, inventoryValue: 168.00 },
  { product: 'Arborvitae (30 gal)', units: 3, costPerUnit: 225.00, inventoryValue: 675.00 },
  { product: 'Ilex Fine Line (30 gal)', units: 12, costPerUnit: 213.75, inventoryValue: 2565.00 },
];

export const plantsLandscaping2024: InventoryItem[] = [
  { product: 'Flag Iris & Tulips (1 gal)', units: 200, costPerUnit: 13.00, inventoryValue: 2600.00 },
  { product: 'Loropetalum (3 gal)', units: 10, costPerUnit: 25.00, inventoryValue: 250.00 },
  { product: 'Nandina (3 gal)', units: 11, costPerUnit: 16.00, inventoryValue: 176.00 },
  { product: 'Sunshine Ligustrum (3 gal)', units: 14, costPerUnit: 20.00, inventoryValue: 280.00 },
  { product: 'Ilex Compacta (7 gal)', units: 4, costPerUnit: 28.00, inventoryValue: 112.00 },
  { product: 'Arborvitae (30 gal)', units: 3, costPerUnit: 225.00, inventoryValue: 675.00 },
  { product: 'Umbrella Sedge (3 gal)', units: 10, costPerUnit: 15.60, inventoryValue: 156.00 },
];

// Calculate totals
export const getInventoryByYear = () => {
  const drainageTotal2023 = 4495.52;
  const drainageTotal2024 = 16744.93;
  
  const hardscapeTotal2023 = 562.39;
  const hardscapeTotal2024 = 6963.09;
  
  const plantsTotal2023 = 6796.00;
  const plantsTotal2024 = 4249.00;
  
  return [
    {
      year: 2023,
      categories: [
        { name: 'Drainage Supplies', value: drainageTotal2023, color: 'hsl(var(--chart-1))' },
        { name: 'Hardscape Materials', value: hardscapeTotal2023, color: 'hsl(var(--chart-2))' },
        { name: 'Plants & Landscaping', value: plantsTotal2023, color: 'hsl(var(--chart-3))' },
      ],
      total: drainageTotal2023 + hardscapeTotal2023 + plantsTotal2023
    },
    {
      year: 2024,
      categories: [
        { name: 'Drainage Supplies', value: drainageTotal2024, color: 'hsl(var(--chart-1))' },
        { name: 'Hardscape Materials', value: hardscapeTotal2024, color: 'hsl(var(--chart-2))' },
        { name: 'Plants & Landscaping', value: plantsTotal2024, color: 'hsl(var(--chart-3))' },
      ],
      total: drainageTotal2024 + hardscapeTotal2024 + plantsTotal2024
    }
  ];
};

export const getInventoryGrowth = () => {
  const data = getInventoryByYear();
  const total2023 = data[0].total;
  const total2024 = data[1].total;
  const growth = ((total2024 - total2023) / total2023) * 100;
  
  return {
    total2023,
    total2024,
    growth
  };
};