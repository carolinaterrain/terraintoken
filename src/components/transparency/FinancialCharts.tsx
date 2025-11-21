import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { monthlyRevenue, getYoYComparison, getExpenseBreakdown } from "@/lib/financialData";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { useState } from "react";

export const RevenueChart = () => {
  const [view, setView] = useState<"revenue" | "expenses" | "netIncome">("revenue");
  
  const chartData = monthlyRevenue.map(m => ({
    month: m.month.split(" ")[0] + " '" + m.month.split(" ")[1].slice(-2),
    revenue: m.revenue,
    expenses: m.expenses,
    netIncome: m.netIncome,
  }));

  const chartConfig = {
    revenue: { label: "💚 Revenue", color: "hsl(var(--chart-1))" },
    expenses: { label: "🔴 Expenses", color: "hsl(var(--chart-2))" },
    netIncome: { label: "💰 Net Income", color: "hsl(var(--chart-3))" },
  };

  return (
    <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent" style={{ textShadow: '0 0 20px hsl(var(--primary-glow) / 0.3)' }}>
            Monthly Financial Performance
          </h3>
          <p className="text-sm text-muted-foreground">May 2022 - November 2025</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge 
            variant={view === "revenue" ? "default" : "outline"}
            className="cursor-pointer transition-all hover:scale-105 min-h-[48px] px-4"
            onClick={() => setView("revenue")}
          >
            💚 Revenue
          </Badge>
          <Badge 
            variant={view === "expenses" ? "default" : "outline"}
            className="cursor-pointer transition-all hover:scale-105 min-h-[48px] px-4"
            onClick={() => setView("expenses")}
          >
            🔴 Expenses
          </Badge>
          <Badge 
            variant={view === "netIncome" ? "default" : "outline"}
            className="cursor-pointer transition-all hover:scale-105 min-h-[48px] px-4"
            onClick={() => setView("netIncome")}
          >
            💰 Net Income
          </Badge>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="h-[300px] md:h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="colorNetIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-3))" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="hsl(var(--chart-3))" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" opacity={0.15} />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--chart-text))"
              fontSize={13}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="hsl(var(--chart-text))"
              fontSize={13}
              tickLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip 
              content={<ChartTooltipContent className="backdrop-blur-md bg-background/95 border-2 p-4" />}
              formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, chartConfig[name as keyof typeof chartConfig]?.label || name]}
            />
            {view === "revenue" && (
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--chart-1))" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                strokeWidth={3}
                animationDuration={800}
                animationEasing="ease-out"
              />
            )}
            {view === "expenses" && (
              <Area 
                type="monotone" 
                dataKey="expenses" 
                stroke="hsl(var(--chart-2))" 
                fillOpacity={1} 
                fill="url(#colorExpenses)" 
                strokeWidth={3}
                animationDuration={800}
                animationEasing="ease-out"
              />
            )}
            {view === "netIncome" && (
              <Area 
                type="monotone" 
                dataKey="netIncome" 
                stroke="hsl(var(--chart-3))" 
                fillOpacity={1} 
                fill="url(#colorNetIncome)" 
                strokeWidth={3}
                animationDuration={800}
                animationEasing="ease-out"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  );
};

export const YearOverYearChart = () => {
  const yoyData = getYoYComparison();

  const chartConfig = {
    revenue: { label: "💚 Revenue", color: "hsl(var(--chart-1))" },
    expenses: { label: "🔴 Expenses", color: "hsl(var(--chart-2))" },
    netIncome: { label: "💰 Net Income", color: "hsl(var(--chart-3))" },
  };

  return (
    <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="mb-6">
        <h3 className="font-display text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent" style={{ textShadow: '0 0 20px hsl(var(--primary-glow) / 0.3)' }}>
          Year-over-Year Comparison
        </h3>
        <p className="text-sm text-muted-foreground">Annual Performance Trends</p>
      </div>
      <ChartContainer config={chartConfig} className="h-[300px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={yoyData} barGap={8} barCategoryGap="20%">
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
              content={<ChartTooltipContent className="backdrop-blur-md bg-background/95 border-2 border-primary/30 p-4" />}
              formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, chartConfig[name as keyof typeof chartConfig]?.label || name]}
            />
            <ChartLegend content={<ChartLegendContent className="flex-wrap gap-4" />} wrapperStyle={{ paddingTop: '20px' }} />
            <Bar 
              dataKey="revenue" 
              fill="hsl(var(--chart-1))" 
              radius={[8, 8, 0, 0]}
              animationDuration={800}
              animationEasing="ease-out"
            />
            <Bar 
              dataKey="expenses" 
              fill="hsl(var(--chart-2))" 
              radius={[8, 8, 0, 0]}
              animationDuration={800}
              animationEasing="ease-out"
            />
            <Bar 
              dataKey="netIncome" 
              fill="hsl(var(--chart-3))" 
              radius={[8, 8, 0, 0]}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  );
};

export const ExpenseBreakdownChart = () => {
  const expenseData = getExpenseBreakdown();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const COLORS = [
    'hsl(var(--chart-1))',  // Emerald - Supplies
    'hsl(var(--chart-2))',  // Clay Red - Labor
    'hsl(var(--chart-3))',  // Gold - Advertising
    'hsl(var(--chart-4))',  // Purple - Operations
  ];

  return (
    <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="mb-6">
        <h3 className="font-display text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent" style={{ textShadow: '0 0 20px hsl(var(--primary-glow) / 0.3)' }}>
          Expense Breakdown
        </h3>
        <p className="text-sm text-muted-foreground">Cost Distribution Analysis</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <ChartContainer config={{}} className="h-[300px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={typeof window !== 'undefined' && window.innerWidth < 768 ? 80 : 120}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                stroke="hsl(var(--background))"
                strokeWidth={2}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {expenseData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                    style={{ 
                      transition: "all 0.3s ease",
                      transform: activeIndex === index ? "scale(1.08)" : "scale(1)",
                      transformOrigin: "center",
                    }}
                  />
                ))}
              </Pie>
              <ChartTooltip 
                content={({ payload }) => {
                  if (!payload || !payload[0]) return null;
                  const data = payload[0].payload;
                  const colorIndex = expenseData.findIndex(d => d.name === data.name);
                  return (
                    <div className="backdrop-blur-md bg-background/95 border-2 p-4 rounded-lg shadow-lg" style={{ borderColor: COLORS[colorIndex] }}>
                      <p className="font-semibold text-foreground">{data.name}</p>
                      <p className="font-bold text-lg" style={{ color: COLORS[colorIndex] }}>${data.value.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{data.percentage.toFixed(1)}%</p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="grid grid-cols-1 gap-3">
          {expenseData.map((item, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-all hover:scale-105 border border-border/50"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              style={{
                borderColor: activeIndex === index ? COLORS[index] : undefined,
                backgroundColor: activeIndex === index ? `${COLORS[index]}10` : undefined,
              }}
            >
              <div 
                className="w-4 h-4 rounded-full shadow-lg flex-shrink-0" 
                style={{ 
                  backgroundColor: COLORS[index],
                  boxShadow: activeIndex === index ? `0 0 16px ${COLORS[index]}` : undefined,
                }}
              />
              <span className="flex-1 font-medium">{item.name}</span>
              <div className="text-right">
                <div className="font-bold text-lg">{item.percentage.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">
                  ${(item.value / 1000).toFixed(0)}k
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
