import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp } from "lucide-react";
import { getInventoryByYear, getInventoryGrowth } from "@/lib/inventoryData";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

export const InventoryCapitalCard = () => {
  const inventoryData = getInventoryByYear();
  const growth = getInventoryGrowth();
  const latest = inventoryData[inventoryData.length - 1];

  const COLORS = [
    'hsl(var(--chart-1))',  // Emerald - Drainage
    'hsl(var(--chart-2))',  // Clay Red - Hardscape
    'hsl(var(--chart-3))',  // Gold - Plants
  ];

  return (
    <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-background/80">
            <Package className="w-6 h-6 text-chart-1" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold">Working Capital Growth</h3>
            <p className="text-sm text-muted-foreground">Inventory Investment</p>
          </div>
        </div>
        <Badge variant="outline" className="border-green-500/40 text-green-500 gap-2">
          <TrendingUp className="w-4 h-4" />
          +{growth.growth.toFixed(0)}% YoY
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="flex items-center justify-center">
          <ChartContainer config={{}} className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={latest.categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                >
                  {latest.categories.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={({ payload }) => {
                    if (!payload || !payload[0]) return null;
                    const data = payload[0].payload;
                    const colorIndex = latest.categories.findIndex(d => d.name === data.name);
                    return (
                      <div className="backdrop-blur-md bg-background/95 border-2 p-4 rounded-lg shadow-lg" style={{ borderColor: COLORS[colorIndex] }}>
                        <p className="font-semibold text-foreground">{data.name}</p>
                        <p className="font-bold text-lg" style={{ color: COLORS[colorIndex] }}>
                          ${data.value.toLocaleString()}
                        </p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          <div className="text-center md:text-left mb-4">
            <div className="font-display text-4xl font-bold text-primary mb-1">
              ${(latest.total / 1000).toFixed(1)}k
            </div>
            <div className="text-sm text-muted-foreground">Total Inventory ({latest.year})</div>
          </div>

          {latest.categories.map((category, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-background/60 border border-border/50">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="flex-1 font-medium text-sm">{category.name}</span>
              <div className="text-right">
                <div className="font-bold">${(category.value / 1000).toFixed(1)}k</div>
                <div className="text-xs text-muted-foreground">
                  {((category.value / latest.total) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          ))}

          {/* Historical Comparison */}
          <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-muted">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">2023 Total</span>
              <span className="font-semibold">${(growth.total2023 / 1000).toFixed(1)}k</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">2024 Total</span>
              <span className="font-semibold">${(growth.total2024 / 1000).toFixed(1)}k</span>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-muted">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">📦 Strategic Inventory:</span> Higher inventory levels reflect
          business growth and preparation for larger contracts. This represents <span className="font-bold text-primary">
          working capital</span> invested in materials to service projects, not wasteful spending.
        </p>
      </div>
    </Card>
  );
};