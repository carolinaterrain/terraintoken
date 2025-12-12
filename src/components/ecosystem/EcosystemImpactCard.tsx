import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Flame, ExternalLink, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLatestReport, useBurnBands, useGlossaryTerm } from '@/hooks/useEcosystemData';

interface EcosystemImpactCardProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export const EcosystemImpactCard: React.FC<EcosystemImpactCardProps> = ({ 
  className = '',
  variant = 'full' 
}) => {
  const { data: latestReport, isLoading: reportLoading } = useLatestReport();
  const { data: bands, isLoading: bandsLoading } = useBurnBands();
  const burnBandTerm = useGlossaryTerm('burn_band');
  const buybackBurnTerm = useGlossaryTerm('buyback_burn');

  const isLoading = reportLoading || bandsLoading;

  // Find the current band based on latest report
  const currentBand = latestReport && bands
    ? bands.find(b => b.id === latestReport.determined_band_id)
    : null;

  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  const formatNumber = (value: number) =>
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);

  if (variant === 'compact') {
    return (
      <Card className={`bg-primary/5 border-primary/20 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Ecosystem Impact</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-5 w-16" />
            ) : latestReport ? (
              <Badge variant="outline" className="text-primary border-primary/30">
                {formatPercent(latestReport.final_burn_rate || 0)} Burn Rate
              </Badge>
            ) : (
              <Badge variant="secondary">Pending</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Your activity contributes to TRN buyback + burn.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-br from-primary/10 via-background to-accent/10 border-primary/20 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Flame className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Ecosystem Impact</h3>
              <p className="text-xs text-muted-foreground">Powered by TerrainVision</p>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  {buybackBurnTerm?.definition || 
                    'TerrainVision AI revenue drives programmatic TRN buyback and burn.'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          This month's activity contributes to TRN buyback + burn. Your AI analyses 
          help grow the ecosystem and increase token value.
        </p>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
          </div>
        ) : latestReport ? (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-background/50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs text-muted-foreground">Current Band</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">{burnBandTerm?.definition}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="font-semibold text-lg">
                  {currentBand 
                    ? `${formatCurrency(currentBand.min_revenue)}${currentBand.max_revenue ? ` - ${formatCurrency(currentBand.max_revenue)}` : '+'}`
                    : 'N/A'}
                </p>
              </div>
              <div className="bg-background/50 rounded-lg p-3">
                <span className="text-xs text-muted-foreground block mb-1">Burn Rate</span>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-lg text-primary">
                    {formatPercent(latestReport.final_burn_rate || 0)}
                  </p>
                  {latestReport.usage_bonus_applied && (
                    <Badge variant="secondary" className="text-[10px] px-1.5">
                      +Bonus
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>{formatNumber(latestReport.verified_analyses)} verified analyses</span>
              </div>
              <Link 
                to="/transparency" 
                className="flex items-center gap-1 text-primary hover:underline"
              >
                View Report <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <Badge variant="secondary">Pending First Report</Badge>
            <p className="text-xs text-muted-foreground mt-2">
              First monthly report coming soon.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
