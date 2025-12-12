import React from 'react';
import { Zap, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLatestReport, useGlossaryTerm } from '@/hooks/useEcosystemData';
import { Skeleton } from '@/components/ui/skeleton';

interface PoweredByTerrainVisionProps {
  showAnalysisCount?: boolean;
  className?: string;
}

export const PoweredByTerrainVision: React.FC<PoweredByTerrainVisionProps> = ({
  showAnalysisCount = true,
  className = '',
}) => {
  const { data: latestReport, isLoading } = useLatestReport();
  const verifiedAnalysisTerm = useGlossaryTerm('verified_analysis');

  const formatNumber = (value: number) =>
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-2 ${className}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline" 
              className="bg-accent/10 border-accent/30 hover:bg-accent/20 transition-colors cursor-help"
            >
              <Zap className="h-3 w-3 mr-1 text-accent" />
              <span className="text-xs">Powered by TerrainVision</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-sm">
              TRN burn data is sourced from verified TerrainVision AI usage metrics.
              {verifiedAnalysisTerm && (
                <span className="block mt-1 text-muted-foreground">
                  {verifiedAnalysisTerm.definition}
                </span>
              )}
            </p>
          </TooltipContent>
        </Tooltip>

        {showAnalysisCount && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-xs text-muted-foreground flex items-center gap-1 cursor-help">
                {isLoading ? (
                  <Skeleton className="h-4 w-16" />
                ) : latestReport ? (
                  <>
                    <span className="font-medium text-foreground">
                      {formatNumber(latestReport.verified_analyses)}
                    </span>
                    <span>analyses this period</span>
                  </>
                ) : (
                  <span>No data yet</span>
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">
                Number of verified AI terrain analyses from TerrainVision
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};
