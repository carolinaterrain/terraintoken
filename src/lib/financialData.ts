// Financial data parser and utilities for Carolina Terrain transparency dashboard

export interface MonthlyData {
  month: string;
  date: Date;
  revenue: number;
  expenses: number;
  netIncome: number;
  supplies: number;
  labor: number;
  advertising: number;
}

export interface BalanceSheetData {
  totalAssets: number;
  currentAssets: number;
  fixedAssets: number;
  totalLiabilities: number;
  equity: number;
  cashBalance: number;
  equipmentValue: number;
}

// Real monthly revenue data from P&L CSV (May 2022 - Nov 2025)
export const monthlyRevenue: MonthlyData[] = [
  { month: "May 2022", date: new Date(2022, 4), revenue: 5634.41, expenses: 1304.93, netIncome: 4329.48, supplies: 1304.93, labor: 0, advertising: 0 },
  { month: "Jun 2022", date: new Date(2022, 5), revenue: 8100.39, expenses: 1927.42, netIncome: 6172.97, supplies: 127.16, labor: 0, advertising: 360.26 },
  { month: "Jul 2022", date: new Date(2022, 6), revenue: 3669.51, expenses: 1992.94, netIncome: 1676.57, supplies: 1678.48, labor: 0, advertising: 146.61 },
  { month: "Aug 2022", date: new Date(2022, 7), revenue: 12100.54, expenses: 5717.94, netIncome: 6284.73, supplies: 5414.69, labor: 0, advertising: 303.25 },
  { month: "Sep 2022", date: new Date(2022, 8), revenue: 3103.52, expenses: 1896.56, netIncome: -1306.38, supplies: 996.24, labor: 0, advertising: 869.86 },
  { month: "Oct 2022", date: new Date(2022, 9), revenue: 7910.76, expenses: 9194.89, netIncome: -1857.74, supplies: 5731.43, labor: 2500, advertising: 731.13 },
  { month: "Nov 2022", date: new Date(2022, 10), revenue: 36487.28, expenses: 11468.25, netIncome: 25019.03, supplies: 10092.16, labor: 0, advertising: 695.03 },
  { month: "Dec 2022", date: new Date(2022, 11), revenue: 34407.77, expenses: 23409.04, netIncome: 7989.69, supplies: 14735.73, labor: 0, advertising: 877.56 },
  { month: "Jan 2023", date: new Date(2023, 0), revenue: 53299.06, expenses: 21598.94, netIncome: 31259.66, supplies: 12464.78, labor: 3150, advertising: 510.41 },
  { month: "Feb 2023", date: new Date(2023, 1), revenue: 59899.21, expenses: 45577.50, netIncome: 14053.24, supplies: 35101.56, labor: 5865.80, advertising: 1438.26 },
  { month: "Mar 2023", date: new Date(2023, 2), revenue: 56858.23, expenses: 19693.89, netIncome: 37028.02, supplies: 14731.27, labor: 3797.73, advertising: 682.44 },
  { month: "Apr 2023", date: new Date(2023, 3), revenue: 19986.26, expenses: 15890.56, netIncome: 3938.61, supplies: 6997.68, labor: 6050, advertising: 975.69 },
  { month: "May 2023", date: new Date(2023, 4), revenue: 39444.44, expenses: 17943.56, netIncome: 21302.12, supplies: 8496.82, labor: 6270, advertising: 1444.99 },
  { month: "Jun 2023", date: new Date(2023, 5), revenue: 43449.82, expenses: 50820.41, netIncome: -7370.59, supplies: 27072.96, labor: 10145, advertising: 1689.74 },
  { month: "Jul 2023", date: new Date(2023, 6), revenue: 47830.55, expenses: 49333.32, netIncome: -1674.01, supplies: 25482.29, labor: 12220.02, advertising: 1611.70 },
  { month: "Aug 2023", date: new Date(2023, 7), revenue: 51695.69, expenses: 20853.18, netIncome: 28524.99, supplies: 5778.71, labor: 7690, advertising: 1169.45 },
  { month: "Sep 2023", date: new Date(2023, 8), revenue: 31429.93, expenses: 27469.88, netIncome: 3960.05, supplies: 11233.92, labor: 6188.25, advertising: 1382.27 },
  { month: "Oct 2023", date: new Date(2023, 9), revenue: 115636.08, expenses: 41261.74, netIncome: 80020.15, supplies: 23448.02, labor: 3600, advertising: 2234.43 },
  { month: "Nov 2023", date: new Date(2023, 10), revenue: 43823.36, expenses: 35462.92, netIncome: -21541.14, supplies: 12802.26, labor: 7425, advertising: 1789.58 },
  { month: "Dec 2023", date: new Date(2023, 11), revenue: 119386.01, expenses: 62793.60, netIncome: 62481.33, supplies: 36988.32, labor: 8470, advertising: 1813.43 },
  { month: "Jan 2024", date: new Date(2024, 0), revenue: 63531.21, expenses: 55586.29, netIncome: 11877.65, supplies: 31849.29, labor: 10133, advertising: 2467.23 },
  { month: "Feb 2024", date: new Date(2024, 1), revenue: 56192.22, expenses: 49131.17, netIncome: 20959.14, supplies: 26971.63, labor: 6350.99, advertising: 3818.97 },
  { month: "Mar 2024", date: new Date(2024, 2), revenue: 52353.63, expenses: 33527.94, netIncome: 26131.02, supplies: 12275.01, labor: 11670.75, advertising: 3227.23 },
  { month: "Apr 2024", date: new Date(2024, 3), revenue: 61860.77, expenses: 24157.43, netIncome: 9660.62, supplies: 7603.96, labor: 3910, advertising: 2294.72 },
  { month: "May 2024", date: new Date(2024, 4), revenue: 59682.34, expenses: 51314.33, netIncome: 22191.24, supplies: 24144.02, labor: 8760, advertising: 4686.11 },
  { month: "Jun 2024", date: new Date(2024, 5), revenue: 89095.71, expenses: 36601.39, netIncome: 32699.18, supplies: 13889.95, labor: 11629, advertising: 3784.80 },
  { month: "Jul 2024", date: new Date(2024, 6), revenue: 50943.85, expenses: 55468.17, netIncome: 15616.74, supplies: 33815.59, labor: 9750, advertising: 4761.80 },
  { month: "Aug 2024", date: new Date(2024, 7), revenue: 24742.58, expenses: 34361.32, netIncome: -237644.56, supplies: 12169.84, labor: 5490, advertising: 4205.41 },
  { month: "Sep 2024", date: new Date(2024, 8), revenue: 32750.17, expenses: 57793.12, netIncome: -688.61, supplies: 26271.76, labor: 11366, advertising: 4031.38 },
  { month: "Oct 2024", date: new Date(2024, 9), revenue: 32103.72, expenses: 32748.14, netIncome: 5382.00, supplies: 15729.17, labor: 4640, advertising: 3487.30 },
  { month: "Nov 2024", date: new Date(2024, 10), revenue: 77531.08, expenses: 26190.70, netIncome: 18328.39, supplies: 8636.76, labor: 6960, advertising: 3294.44 },
  { month: "Dec 2024", date: new Date(2024, 11), revenue: 91659.03, expenses: 58538.11, netIncome: 33716.93, supplies: 19368.95, labor: 6080, advertising: 4533.84 },
  { month: "Jan 2025", date: new Date(2025, 0), revenue: 81606.48, expenses: 56829.12, netIncome: 21758.75, supplies: 28906.89, labor: 3775, advertising: 3857.28 },
  { month: "Feb 2025", date: new Date(2025, 1), revenue: 57517.52, expenses: 56915.48, netIncome: 1664.03, supplies: 25055.01, labor: 8355, advertising: 4324.32 },
  { month: "Mar 2025", date: new Date(2025, 2), revenue: 83265.78, expenses: 53520.65, netIncome: 20035.97, supplies: 19789.71, labor: 7301.14, advertising: 4568.33 },
  { month: "Apr 2025", date: new Date(2025, 3), revenue: 108637.78, expenses: 61097.51, netIncome: 52839.61, supplies: 28918.78, labor: 6768.54, advertising: 4200.15 },
  { month: "May 2025", date: new Date(2025, 4), revenue: 84688.17, expenses: 52711.20, netIncome: 3142.24, supplies: 19334.63, labor: 6670, advertising: 1056.71 },
  { month: "Jun 2025", date: new Date(2025, 5), revenue: 78151.40, expenses: 80712.11, netIncome: -2313.60, supplies: 30867.97, labor: 21720, advertising: 1175.03 },
  { month: "Jul 2025", date: new Date(2025, 6), revenue: 71581.43, expenses: 79164.11, netIncome: 22602.09, supplies: 33664.47, labor: 12030, advertising: 7334.68 },
  { month: "Aug 2025", date: new Date(2025, 7), revenue: 0, expenses: 50023.64, netIncome: 0, supplies: 25553.63, labor: 5710, advertising: 1464.23 },
];

// Real balance sheet data from CSV
export const balanceSheet: BalanceSheetData = {
  totalAssets: 255485.35,
  currentAssets: 82893.57,
  fixedAssets: 172591.78,
  totalLiabilities: 215693.48,
  equity: 39791.87,
  cashBalance: 59232.18,
  equipmentValue: 172591.78,
};

// Equipment inventory with real values
export const equipmentInventory = [
  { name: "Kubota Excavator", purchasePrice: 44431.41, currentValue: 44431.41, purchaseDate: "2023" },
  { name: "Large Skidsteer", purchasePrice: 85001.75, currentValue: 85001.75, purchaseDate: "2023" },
  { name: "Dodge Ram 2020", purchasePrice: 53993.21, currentValue: 53993.21, purchaseDate: "2024" },
  { name: "Dodge Ram 2025", purchasePrice: 55843.00, currentValue: 55843.00, purchaseDate: "2024" },
  { name: "Pressure Washer Rig", purchasePrice: 27060.00, currentValue: 27060.00, purchaseDate: "2024", status: "PAID OFF" },
  { name: "Tools & Equipment", purchasePrice: 126050.41, currentValue: 126050.41, purchaseDate: "2019-2025" },
  { name: "Yarbo Mower", purchasePrice: 4458.00, currentValue: 4458.00, purchaseDate: "2024" },
];

// Calculate key metrics
export const calculateMetrics = () => {
  const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
  const totalExpenses = monthlyRevenue.reduce((sum, m) => sum + m.expenses, 0);
  const totalNetIncome = monthlyRevenue.reduce((sum, m) => sum + m.netIncome, 0);
  const monthsWithData = monthlyRevenue.filter(m => m.revenue > 0).length;
  
  // Calculate 2024 vs 2025 growth
  const revenue2024 = monthlyRevenue
    .filter(m => m.date.getFullYear() === 2024)
    .reduce((sum, m) => sum + m.revenue, 0);
  
  const revenue2025YTD = monthlyRevenue
    .filter(m => m.date.getFullYear() === 2025 && m.revenue > 0)
    .reduce((sum, m) => sum + m.revenue, 0);
  
  const months2024 = 12;
  const months2025 = monthlyRevenue.filter(m => m.date.getFullYear() === 2025 && m.revenue > 0).length;
  
  const avgMonthly2024 = revenue2024 / months2024;
  const avgMonthly2025 = revenue2025YTD / months2025;
  const growthRate = ((avgMonthly2025 - avgMonthly2024) / avgMonthly2024) * 100;

  return {
    totalRevenue,
    totalExpenses,
    totalNetIncome,
    avgMonthlyRevenue: totalRevenue / monthsWithData,
    netProfitMargin: (totalNetIncome / totalRevenue) * 100,
    grossMargin: 100, // No COGS
    operatingMargin: ((totalRevenue - totalExpenses) / totalRevenue) * 100,
    assetTurnoverRatio: totalRevenue / balanceSheet.totalAssets,
    currentRatio: balanceSheet.currentAssets / (balanceSheet.totalLiabilities - 189571.83), // Current liabilities only
    debtRatio: (balanceSheet.totalLiabilities / balanceSheet.totalAssets) * 100,
    revenue2024,
    revenue2025YTD,
    growthRate,
    peakMonth: monthlyRevenue.reduce((max, m) => m.revenue > max.revenue ? m : max, monthlyRevenue[0]),
  };
};

// Get year-over-year comparison data
export const getYoYComparison = () => {
  const years = [2023, 2024, 2025];
  return years.map(year => {
    const yearData = monthlyRevenue.filter(m => m.date.getFullYear() === year);
    const revenue = yearData.reduce((sum, m) => sum + m.revenue, 0);
    const expenses = yearData.reduce((sum, m) => sum + m.expenses, 0);
    const netIncome = yearData.reduce((sum, m) => sum + m.netIncome, 0);
    
    return {
      year,
      revenue,
      expenses,
      netIncome,
      months: yearData.length,
      avgMonthly: revenue / yearData.length,
    };
  });
};

// Get expense breakdown
export const getExpenseBreakdown = () => {
  const totalSupplies = monthlyRevenue.reduce((sum, m) => sum + m.supplies, 0);
  const totalLabor = monthlyRevenue.reduce((sum, m) => sum + m.labor, 0);
  const totalAdvertising = monthlyRevenue.reduce((sum, m) => sum + m.advertising, 0);
  const totalExpenses = monthlyRevenue.reduce((sum, m) => sum + m.expenses, 0);
  const otherExpenses = totalExpenses - totalSupplies - totalLabor - totalAdvertising;
  
  return [
    { name: "Supplies & Materials", value: totalSupplies, percentage: (totalSupplies / totalExpenses) * 100, color: "hsl(var(--chart-1))" },
    { name: "Contract Labor", value: totalLabor, percentage: (totalLabor / totalExpenses) * 100, color: "hsl(var(--chart-2))" },
    { name: "Advertising", value: totalAdvertising, percentage: (totalAdvertising / totalExpenses) * 100, color: "hsl(var(--chart-3))" },
    { name: "Operations & Other", value: otherExpenses, percentage: (otherExpenses / totalExpenses) * 100, color: "hsl(var(--chart-4))" },
  ];
};
