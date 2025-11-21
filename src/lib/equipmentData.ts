// Equipment purchase and depreciation data from tax records

export interface EquipmentPurchase {
  name: string;
  purchaseDate: Date;
  initialCost: number;
  currentValue: number;
  depreciation2023: number;
  depreciation2024: number;
  depreciation2025: number;
  totalDepreciation: number;
  category: "machinery" | "trailer" | "vehicle" | "tool";
  status: "owned" | "financed";
  paymentsPaid?: number;
  totalPayments?: number;
}

export const equipmentPurchases: EquipmentPurchase[] = [
  {
    name: "Big Tex Dump Trailer",
    purchaseDate: new Date(2022, 4, 10),
    initialCost: 13626,
    currentValue: 8323,
    depreciation2023: 2920,
    depreciation2024: 2383,
    depreciation2025: 0,
    totalDepreciation: 5303,
    category: "trailer",
    status: "owned"
  },
  {
    name: "ASV-RT25 Mini Skidsteer",
    purchaseDate: new Date(2022, 4, 25),
    initialCost: 45000,
    currentValue: 27465,
    depreciation2023: 9664,
    depreciation2024: 7871,
    depreciation2025: 0,
    totalDepreciation: 17535,
    category: "machinery",
    status: "owned"
  },
  {
    name: "Mini Skid Trencher, Auger, Bucket",
    purchaseDate: new Date(2022, 5, 2),
    initialCost: 19505,
    currentValue: 11884,
    depreciation2023: 4180,
    depreciation2024: 3441,
    depreciation2025: 0,
    totalDepreciation: 7621,
    category: "tool",
    status: "owned"
  },
  {
    name: "Soil Conditioner",
    purchaseDate: new Date(2023, 2, 9),
    initialCost: 8560,
    currentValue: 4586,
    depreciation2023: 2140,
    depreciation2024: 1834,
    depreciation2025: 0,
    totalDepreciation: 3974,
    category: "tool",
    status: "owned"
  },
  {
    name: "Big Tex Rice Trailer (Pressure wash rig)",
    purchaseDate: new Date(2023, 2, 13),
    initialCost: 6443,
    currentValue: 3451,
    depreciation2023: 1611,
    depreciation2024: 1381,
    depreciation2025: 0,
    totalDepreciation: 2992,
    category: "trailer",
    status: "owned"
  },
  {
    name: "Kubota Mini Excavator U27-4R1",
    purchaseDate: new Date(2023, 10, 30),
    initialCost: 44431,
    currentValue: 30604,
    depreciation2023: 1586,
    depreciation2024: 12241,
    depreciation2025: 0,
    totalDepreciation: 13827,
    category: "machinery",
    status: "owned"
  },
  {
    name: "Jumpin Jack Tam",
    purchaseDate: new Date(2023, 11, 20),
    initialCost: 3884,
    currentValue: 2675,
    depreciation2023: 139,
    depreciation2024: 1070,
    depreciation2025: 0,
    totalDepreciation: 1209,
    category: "tool",
    status: "owned"
  },
  {
    name: "Spectra GL1425C Dual Grade Laser",
    purchaseDate: new Date(2024, 0, 11),
    initialCost: 2799,
    currentValue: 2799,
    depreciation2023: 0,
    depreciation2024: 0,
    depreciation2025: 0,
    totalDepreciation: 0,
    category: "tool",
    status: "owned"
  },
  {
    name: "Kubota Large Skidsteer SVL75-3HFWC",
    purchaseDate: new Date(2024, 2, 1),
    initialCost: 85002,
    currentValue: 85002,
    depreciation2023: 0,
    depreciation2024: 0,
    depreciation2025: 0,
    totalDepreciation: 0,
    category: "machinery",
    status: "owned"
  },
  {
    name: "Big Tex Large Trailer",
    purchaseDate: new Date(2024, 2, 1),
    initialCost: 10105,
    currentValue: 10105,
    depreciation2023: 0,
    depreciation2024: 0,
    depreciation2025: 0,
    totalDepreciation: 0,
    category: "trailer",
    status: "owned"
  },
  {
    name: "2020 Dodge Ram",
    purchaseDate: new Date(2024, 6, 28),
    initialCost: 53993,
    currentValue: 53993,
    depreciation2023: 0,
    depreciation2024: 0,
    depreciation2025: 0,
    totalDepreciation: 0,
    category: "vehicle",
    status: "owned"
  },
  {
    name: "M-T-M Pressure Washer",
    purchaseDate: new Date(2024, 8, 11),
    initialCost: 2526,
    currentValue: 2526,
    depreciation2023: 0,
    depreciation2024: 0,
    depreciation2025: 0,
    totalDepreciation: 0,
    category: "tool",
    status: "owned"
  },
  {
    name: "2022 Nolan Trailer",
    purchaseDate: new Date(2024, 9, 12),
    initialCost: 4500,
    currentValue: 4500,
    depreciation2023: 0,
    depreciation2024: 0,
    depreciation2025: 0,
    totalDepreciation: 0,
    category: "trailer",
    status: "owned"
  },
  {
    name: "Shipping Containers",
    purchaseDate: new Date(2024, 11, 5),
    initialCost: 4644,
    currentValue: 4644,
    depreciation2023: 0,
    depreciation2024: 0,
    depreciation2025: 0,
    totalDepreciation: 0,
    category: "tool",
    status: "owned"
  },
  {
    name: "Pressure Washer Equipment (Trailer)",
    purchaseDate: new Date(2024, 11, 27),
    initialCost: 27060,
    currentValue: 27060,
    depreciation2023: 0,
    depreciation2024: 0,
    depreciation2025: 0,
    totalDepreciation: 0,
    category: "tool",
    status: "financed",
    paymentsPaid: 10,
    totalPayments: 10
  },
  {
    name: "Yarbo International Mower",
    purchaseDate: new Date(2025, 6, 17),
    initialCost: 4458,
    currentValue: 4458,
    depreciation2023: 0,
    depreciation2024: 0,
    depreciation2025: 0,
    totalDepreciation: 0,
    category: "tool",
    status: "owned"
  },
  {
    name: "2025 Dodge Ram",
    purchaseDate: new Date(2025, 8, 11),
    initialCost: 55843,
    currentValue: 55843,
    depreciation2023: 0,
    depreciation2024: 0,
    depreciation2025: 0,
    totalDepreciation: 0,
    category: "vehicle",
    status: "owned"
  }
];

// Calculate total equipment investments by year
export const getEquipmentInvestmentsByYear = () => {
  const investments: { [year: number]: number } = {};
  
  equipmentPurchases.forEach(eq => {
    const year = eq.purchaseDate.getFullYear();
    investments[year] = (investments[year] || 0) + eq.initialCost;
  });
  
  return Object.keys(investments).map(year => ({
    year: parseInt(year),
    investment: investments[parseInt(year)]
  })).sort((a, b) => a.year - b.year);
};

// Get total depreciation by year
export const getDepreciationByYear = () => {
  return [
    { year: 2023, depreciation: equipmentPurchases.reduce((sum, eq) => sum + eq.depreciation2023, 0) },
    { year: 2024, depreciation: equipmentPurchases.reduce((sum, eq) => sum + eq.depreciation2024, 0) },
    { year: 2025, depreciation: equipmentPurchases.reduce((sum, eq) => sum + eq.depreciation2025, 0) }
  ];
};

// Calculate cumulative equipment value
export const getCumulativeEquipmentValue = () => {
  const totalInitialCost = equipmentPurchases.reduce((sum, eq) => sum + eq.initialCost, 0);
  const totalCurrentValue = equipmentPurchases.reduce((sum, eq) => sum + eq.currentValue, 0);
  const totalDepreciation = equipmentPurchases.reduce((sum, eq) => sum + eq.totalDepreciation, 0);
  
  return {
    totalInitialCost,
    totalCurrentValue,
    totalDepreciation
  };
};

// Get equipment purchases for timeline markers
export const getEquipmentTimelineMarkers = () => {
  return equipmentPurchases
    .filter(eq => eq.initialCost > 20000) // Only show major purchases
    .map(eq => ({
      date: eq.purchaseDate,
      name: eq.name,
      cost: eq.initialCost,
      category: eq.category,
      monthKey: `${eq.purchaseDate.toLocaleString('default', { month: 'short' })} '${eq.purchaseDate.getFullYear().toString().slice(-2)}`
    }));
};