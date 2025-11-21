import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { getEquipmentInvestmentsByYear, getCumulativeEquipmentValue } from "@/lib/equipmentData";
import { monthlyRevenue } from "@/lib/financialData";
import { TrendingUp } from "lucide-react";

export const EquipmentROITracker = () => {
  const equipmentInvestments = getEquipmentInvestmentsByYear();
  const equipmentValue = getCumulativeEquipmentValue();
  
  // Calculate cumulative revenue by year
  const revenueByYear = [2022, 2023, 2024, 2025].map(year => {
    const yearRevenue = monthlyRevenue
      .filter(m => m.date.getFullYear() === year)
      .reduce((sum, m) => sum + m.revenue, 0);
    return { year, revenue: yearRevenue };
  });
  
  // Create cumulative data
  let cumulativeInvestment = 0;
  let cumulativeRevenue = 0;
  
  const chartData = [2022, 2023, 2024, 2025].map(year => {
    const investment = equipmentInvestments.find(e => e.year === year)?.investment || 0;
    const revenue = revenueByYear.find(r => r.year === year)?.revenue || 0;
    
    cumulativeInvestment += investment;
    cumulativeRevenue += revenue;
    
    return {
      year,
      investment: cumulativeInvestment,
      revenue: cumulativeRevenue,
      roi: cumulativeInvestment > 0 ? ((cumulativeRevenue - cumulativeInvestment) / cumulativeInvestment * 100) : 0
    };
  });

  const totalRevenue = revenueByYear.reduce((sum, r) => sum + r.revenue, 0);
  const paybackMonths = (equipmentValue.totalInitialCost / (totalRevenue / 42)).toFixed(1); // 42 months of data

  const chartConfig = {
    investment: { label: "🪙 Equipment Investment", color: "hsl(var(--chart-3))" },
    revenue: { label: "💚 Cumulative Revenue", color: "hsl(var(--chart-1))" },
  };

  return (
    <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent" style={{ textShadow: '0 0 20px hsl(var(--primary-glow) / 0.3)' }}>
            Equipment ROI Timeline
          </h3>
          <p className="text-sm text-muted-foreground">Investment Returns Analysis</p>
        </div>
        <Badge variant="outline" className="border-green-500/40 text-green-500 gap-2">
          <TrendingUp className="w-4 h-4" />
          {paybackMonths} month avg payback
        </Badge>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-background/80 border border-border/50">
          <div className="text-xs text-muted-foreground mb-1">Total Invested</div>
          <div className="font-bold text-xl text-chart-3">${(equipmentValue.totalInitialCost / 1000).toFixed(0)}k</div>
        </div>
        <div className="p-4 rounded-lg bg-background/80 border border-border/50">
          <div className="text-xs text-muted-foreground mb-1">Current Value</div>
          <div className="font-bold text-xl text-chart-1">${(equipmentValue.totalCurrentValue / 1000).toFixed(0)}k</div>
        </div>
        <div className="p-4 rounded-lg bg-background/80 border border-border/50">
          <div className="text-xs text-muted-foreground mb-1">Revenue Generated</div>
          <div className="font-bold text-xl text-green-500">${(totalRevenue / 1000).toFixed(0)}k</div>
        </div>
        <div className="p-4 rounded-lg bg-background/80 border border-border/50">
          <div className="text-xs text-muted-foreground mb-1">ROI Multiple</div>
          <div className="font-bold text-xl text-primary">{(totalRevenue / equipmentValue.totalInitialCost).toFixed(1)}x</div>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="h-[300px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="hsl(var(--chart-3))" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" opacity={0.15} />
            <XAxis 
              dataKey="year" 
              stroke="hsl(var(--chart-text))"
              fontSize={13}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--chart-text))"
              fontSize={13}
              tickLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip 
              content={<ChartTooltipContent className="backdrop-blur-md bg-background/95 border-2 p-4" />}
              formatter={(value: number, name: string) => {
                if (name === 'roi') return [`${value.toFixed(0)}%`, '📈 ROI'];
                return [`$${value.toLocaleString()}`, chartConfig[name as keyof typeof chartConfig]?.label || name];
              }}
            />
            <Area 
              type="monotone" 
              dataKey="investment" 
              stroke="hsl(var(--chart-3))" 
              fill="url(#colorInvestment)" 
              strokeWidth={3}
              animationDuration={800}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(var(--chart-1))" 
              fill="url(#colorRevenue)" 
              strokeWidth={3}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Explanation */}
      <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-muted">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">💡 Equipment as Strategic Investment:</span> Carolina Terrain's equipment
          purchases enable higher capacity and larger projects. The gap between the green revenue line and gold investment line
          demonstrates strong ROI. Every $1 invested in equipment has generated <span className="font-bold text-primary">
          ${(totalRevenue / equipmentValue.totalInitialCost).toFixed(2)} in revenue</span>.
        </p>
      </div>
    </Card>
  );
};