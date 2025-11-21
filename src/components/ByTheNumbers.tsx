import { TrendingUp, MapPin, Shield, DollarSign, TrendingDown, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/transparency/MetricCard";
import { RevenueChart, YearOverYearChart, ExpenseBreakdownChart } from "@/components/transparency/FinancialCharts";
import { InteractiveTimeline } from "@/components/transparency/InteractiveTimeline";
import { DownloadReports } from "@/components/transparency/DownloadReports";
import { EquipmentROITracker } from "@/components/transparency/EquipmentROITracker";
import { InventoryCapitalCard } from "@/components/transparency/InventoryCapitalCard";
import { FinancialHealthScore } from "@/components/transparency/FinancialHealthScore";
import { DepreciationSchedule } from "@/components/transparency/DepreciationSchedule";
import { calculateMetrics, balanceSheet } from "@/lib/financialData";

const ByTheNumbers = () => {
  const metrics = calculateMetrics();

  return (
    <section id="by-the-numbers" className="py-20 px-6 bg-gradient-to-b from-background to-background/80 relative overflow-hidden">
      {/* Background Grid Effect */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ 
          backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary/40">
            💼 Complete Financial Transparency
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Carolina Terrain By The Numbers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real financial data from the business backing the TRN community
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            May 2022 – November 2025 • Sourced from QuickBooks Records
          </p>
        </div>

        {/* Key Metrics Grid - Animated */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <MetricCard
            icon={DollarSign}
            label="Total Revenue"
            value={metrics.totalRevenue}
            prefix="$"
            decimals={0}
            description="May 2022 - Nov 2025"
            trend="up"
            trendValue={`${metrics.growthRate.toFixed(1)}%`}
            color="text-green-500"
          />
          <MetricCard
            icon={TrendingUp}
            label="2025 Revenue (YTD)"
            value={metrics.revenue2025YTD}
            prefix="$"
            decimals={0}
            description="Already exceeded 2024!"
            trend="up"
            trendValue="11% over 2024"
            color="text-blue-500"
            delay={0.2}
          />
          <MetricCard
            icon={Activity}
            label="Avg Monthly Revenue"
            value={metrics.avgMonthlyRevenue}
            prefix="$"
            decimals={0}
            description="Across all periods"
            color="text-purple-500"
            delay={0.4}
          />
          <MetricCard
            icon={TrendingDown}
            label="Net Profit Margin"
            value={metrics.netProfitMargin}
            suffix="%"
            decimals={1}
            description="Strong profitability"
            trend="up"
            color="text-cyan-500"
            delay={0.6}
          />
          <MetricCard
            icon={Shield}
            label="Total Assets"
            value={balanceSheet.totalAssets}
            prefix="$"
            decimals={0}
            description="Equipment & cash"
            color="text-orange-500"
            delay={0.8}
          />
          <MetricCard
            icon={MapPin}
            label="Equipment Value"
            value={balanceSheet.equipmentValue}
            prefix="$"
            decimals={0}
            description="Heavy machinery fleet"
            color="text-pink-500"
            delay={1.0}
          />
        </div>

        {/* Interactive Charts */}
        <div className="space-y-8 mb-16">
          <RevenueChart />
          <div className="grid md:grid-cols-2 gap-8">
            <YearOverYearChart />
            <ExpenseBreakdownChart />
          </div>
        </div>

        {/* Financial Health Score */}
        <div className="mb-16">
          <FinancialHealthScore />
        </div>

        {/* Equipment ROI & Inventory */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <EquipmentROITracker />
          <InventoryCapitalCard />
        </div>

        {/* Depreciation Schedule */}
        <div className="mb-16">
          <DepreciationSchedule />
        </div>

        {/* Interactive Timeline */}
        <div className="mb-12">
          <InteractiveTimeline />
        </div>

        {/* Download Reports */}
        <div className="mb-12">
          <DownloadReports />
        </div>

        {/* Critical Disclaimer */}
        <Card className="p-6 bg-muted/50 backdrop-blur-sm border-2 border-muted">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 text-2xl">⚠️</div>
            <div>
              <h4 className="font-display text-lg font-bold mb-2">
                Important Disclosure
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">TRN is a community-driven meme token</span> inspired by the real-world work we do every day at Carolina Terrain. 
                <span className="font-semibold text-foreground"> It is not tied to company equity, profits, or revenue.</span>
              </p>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                The operational data shown above demonstrates the legitimacy and real-world foundation behind the TRN community, 
                but TRN tokens themselves do not represent ownership, investment returns, or financial claims of any kind.
              </p>
            </div>
          </div>
        </Card>

        {/* Additional Context */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
            Since 2019, Carolina Terrain has experienced consistent operational growth, reinvesting into equipment, 
            team expansion, and cutting-edge technology. This complete financial disclosure demonstrates the authentic 
            foundation behind the TRN community.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-4 h-4 text-primary" />
            <span>All data verified from QuickBooks accounting records</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ByTheNumbers;
