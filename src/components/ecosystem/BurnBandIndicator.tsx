import React from 'react';
import { TrendingUp, Info, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useBurnBands, useLatestReport, useGlossaryTerm } from '@/hooks/useEcosystemData';
import { Skeleton } from '@/components/ui/skeleton';

interface BurnBandIndicatorProps {
  className?: string;
  showProgress?: boolean;
}

export const BurnBandIndicator: React.FC<BurnBandIndicatorProps> = ({
  className = '',
  showProgress = true,
}) => {
  const { data: bands, isLoading: bandsLoading } = useBurnBands();
  const { data: latestReport, isLoading: reportLoading } = useLatestReport();
  const burnBandTerm = useGlossaryTerm('burn_band');

  const isLoading = bandsLoading || reportLoading;

  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  // Find current and next band
  const currentBand = latestReport && bands
    ? bands.find(b => b.id === latestReport.determined_band_id)
    : bands?.[0];

  const currentBandIndex = currentBand && bands
    ? bands.findIndex(b => b.id === currentBand.id)
    : 0;

  const nextBand = bands && currentBandIndex < bands.length - 1
    ? bands[currentBandIndex + 1]
    : null;

  // Calculate progress to next band
  const netRevenue = latestReport?.net_ai_revenue || 0;
  const progressToNext = nextBand && currentBand
    ? Math.min(100, ((netRevenue - currentBand.min_revenue) / (nextBand.min_revenue - currentBand.min_revenue)) * 100)
    : 100;

  if (isLoading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-2 w-full" />
      </div>
    );
  }

  if (!bands || bands.length === 0) {
    return (
      <div className={`text-sm text-muted-foreground ${className}`}>
        Burn bands not configured
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="font-medium">Current Burn Band</span>
                <Info className="h-3 w-3 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">{burnBandTerm?.definition}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Badge variant="default" className="bg-primary">
          {currentBand ? formatPercent(currentBand.burn_rate) : 'N/A'}
        </Badge>
      </div>

      {/* Band visualization */}
      <div className="flex gap-1">
        {bands.map((band, index) => {
          const isActive = band.id === currentBand?.id;
          const isPast = currentBand && band.min_revenue < currentBand.min_revenue;

          return (
            <TooltipProvider key={band.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`h-8 flex-1 rounded transition-all cursor-help ${
                      isActive 
                        ? 'bg-primary ring-2 ring-primary/50' 
                        : isPast 
                          ? 'bg-primary/40' 
                          : 'bg-muted'
                    }`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">
                    <p className="font-medium">
                      {formatCurrency(band.min_revenue)} - {band.max_revenue ? formatCurrency(band.max_revenue) : '∞'}
                    </p>
                    <p className="text-muted-foreground">
                      Burn Rate: {formatPercent(band.burn_rate)}
                    </p>
                    {band.usage_bonus_rate > 0 && (
                      <p className="text-accent">
                        +{formatPercent(band.usage_bonus_rate)} usage bonus
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      {/* Progress to next band */}
      {showProgress && nextBand && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress to next band</span>
            <div className="flex items-center gap-1">
              <span>{formatPercent(currentBand?.burn_rate || 0)}</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-primary">{formatPercent(nextBand.burn_rate)}</span>
            </div>
          </div>
          <Progress value={progressToNext} className="h-1.5" />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{formatCurrency(currentBand?.min_revenue || 0)}</span>
            <span>{formatCurrency(nextBand.min_revenue)} to unlock</span>
          </div>
        </div>
      )}
    </div>
  );
};
