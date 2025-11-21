import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Info } from "lucide-react";
import { equipmentPurchases, getCumulativeEquipmentValue } from "@/lib/equipmentData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const DepreciationSchedule = () => {
  const equipmentValue = getCumulativeEquipmentValue();
  
  // Show only major equipment
  const majorEquipment = equipmentPurchases
    .filter(eq => eq.initialCost > 10000)
    .sort((a, b) => b.initialCost - a.initialCost);

  return (
    <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent" style={{ textShadow: '0 0 20px hsl(var(--primary-glow) / 0.3)' }}>
            Equipment Depreciation Schedule
          </h3>
          <p className="text-sm text-muted-foreground">Asset Value Over Time (Section 179 Method)</p>
        </div>
        <Badge variant="outline" className="border-primary/40 gap-2">
          <Calculator className="w-4 h-4" />
          Tax Optimization
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-background/80 border border-border/50">
          <div className="text-xs text-muted-foreground mb-1">Total Purchase Cost</div>
          <div className="font-bold text-2xl text-chart-3">${(equipmentValue.totalInitialCost / 1000).toFixed(0)}k</div>
        </div>
        <div className="p-4 rounded-lg bg-background/80 border border-border/50">
          <div className="text-xs text-muted-foreground mb-1">Current Book Value</div>
          <div className="font-bold text-2xl text-chart-1">${(equipmentValue.totalCurrentValue / 1000).toFixed(0)}k</div>
        </div>
        <div className="p-4 rounded-lg bg-background/80 border border-border/50">
          <div className="text-xs text-muted-foreground mb-1">Total Depreciation</div>
          <div className="font-bold text-2xl text-chart-2">${(equipmentValue.totalDepreciation / 1000).toFixed(0)}k</div>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4 mb-6">
        {majorEquipment.map((eq, index) => {
          const depreciationPercent = (eq.totalDepreciation / eq.initialCost) * 100;
          return (
            <Card key={index} className="p-4 bg-background/80 border border-border/50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{eq.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {eq.purchaseDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <Badge variant={depreciationPercent > 0 ? "secondary" : "outline"}>
                  {depreciationPercent.toFixed(0)}%
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">Purchase Cost</span>
                  <span className="font-mono font-semibold">${eq.initialCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">Current Value</span>
                  <span className="font-mono font-semibold text-chart-1">${eq.currentValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-muted-foreground">Depreciation</span>
                  <span className="font-mono font-semibold text-chart-2">${eq.totalDepreciation.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-border/50 mb-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-bold">Asset</TableHead>
              <TableHead className="font-bold text-right">Purchase Cost</TableHead>
              <TableHead className="font-bold text-right">Current Value</TableHead>
              <TableHead className="font-bold text-right">Depreciation</TableHead>
              <TableHead className="font-bold text-right">% Depreciated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {majorEquipment.map((eq, index) => {
              const depreciationPercent = (eq.totalDepreciation / eq.initialCost) * 100;
              return (
                <TableRow key={index} className="hover:bg-muted/30">
                  <TableCell className="font-medium">
                    {eq.name}
                    <div className="text-xs text-muted-foreground">
                      {eq.purchaseDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${eq.initialCost.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono text-chart-1">
                    ${eq.currentValue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono text-chart-2">
                    ${eq.totalDepreciation.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={depreciationPercent > 0 ? "secondary" : "outline"}>
                      {depreciationPercent.toFixed(0)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Explainer Box */}
      <div className="p-4 rounded-lg bg-muted/50 border border-muted flex gap-3">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">🧮 What is Depreciation?</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Depreciation is an <span className="font-semibold text-foreground">accounting method</span> that spreads 
            equipment costs over multiple tax years. It reduces taxable income but <span className="font-semibold text-foreground">
            doesn't affect actual cash flow</span>.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Example:</span> We purchased a $85k skidsteer in 2024 (paid cash). 
            Accounting shows it as an $85k "expense" for tax purposes, but we <span className="font-semibold text-foreground">
            own an $85k asset</span> generating revenue. This is <span className="font-bold text-primary">smart tax strategy</span>, 
            not financial trouble.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Section 179:</span> Allows businesses to deduct the full purchase 
            price of qualifying equipment in the year of purchase, reducing tax burden while building operational capacity.
          </p>
        </div>
      </div>
    </Card>
  );
};