import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { monthlyRevenue, getYoYComparison, getExpenseBreakdown } from "@/lib/financialData";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
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
    revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
    expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
    netIncome: { label: "Net Income", color: "hsl(var(--chart-3))" },
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-2xl font-bold mb-2">Monthly Financial Performance</h3>
          <p className="text-sm text-muted-foreground">May 2022 - November 2025</p>
        </div>
        <div className="flex gap-2">
          <Badge 
            variant={view === "revenue" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setView("revenue")}
          >
            Revenue
          </Badge>
          <Badge 
            variant={view === "expenses" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setView("expenses")}
          >
            Expenses
          </Badge>
          <Badge 
            variant={view === "netIncome" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setView("netIncome")}
          >
            Net Income
          </Badge>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorNetIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
            />
            {view === "revenue" && (
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--chart-1))" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                strokeWidth={2}
              />
            )}
            {view === "expenses" && (
              <Area 
                type="monotone" 
                dataKey="expenses" 
                stroke="hsl(var(--chart-2))" 
                fillOpacity={1} 
                fill="url(#colorExpenses)" 
                strokeWidth={2}
              />
            )}
            {view === "netIncome" && (
              <Area 
                type="monotone" 
                dataKey="netIncome" 
                stroke="hsl(var(--chart-3))" 
                fillOpacity={1} 
                fill="url(#colorNetIncome)" 
                strokeWidth={2}
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
    revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
    expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
    netIncome: { label: "Net Income", color: "hsl(var(--chart-3))" },
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <h3 className="font-display text-2xl font-bold mb-6">Year-over-Year Comparison</h3>
      <ChartContainer config={chartConfig} className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={yoyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="year" 
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
            />
            <Legend />
            <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="netIncome" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  );
};

export const ExpenseBreakdownChart = () => {
  const expenseData = getExpenseBreakdown();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <h3 className="font-display text-2xl font-bold mb-6">Expense Breakdown</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <ChartContainer config={{}} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {expenseData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                    style={{ 
                      transition: "opacity 0.3s ease",
                      transform: activeIndex === index ? "scale(1.05)" : "scale(1)",
                    }}
                  />
                ))}
              </Pie>
              <ChartTooltip 
                content={({ payload }) => {
                  if (!payload || !payload[0]) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background/95 border border-border p-3 rounded-lg shadow-lg">
                      <p className="font-semibold text-foreground">{data.name}</p>
                      <p className="text-primary font-bold">${data.value.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{data.percentage.toFixed(1)}%</p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="space-y-4">
          {expenseData.map((item, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors cursor-pointer"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.percentage.toFixed(1)}%</p>
                </div>
              </div>
              <p className="font-bold text-primary">${item.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
