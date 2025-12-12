import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useGlossaryTerm } from '@/hooks/useEcosystemData';

interface GlossaryTooltipProps {
  termKey: string;
  children?: React.ReactNode;
  showIcon?: boolean;
  className?: string;
}

/**
 * A tooltip component that pulls definitions from the shared glossary.
 * Usage: <GlossaryTooltip termKey="ai_net_revenue">AI Net Revenue</GlossaryTooltip>
 */
export const GlossaryTooltip: React.FC<GlossaryTooltipProps> = ({
  termKey,
  children,
  showIcon = true,
  className = '',
}) => {
  const term = useGlossaryTerm(termKey);

  if (!term) {
    // If term not found, just render children without tooltip
    return <span className={className}>{children}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`inline-flex items-center gap-1 cursor-help ${className}`}>
            {children || term.term_name}
            {showIcon && <Info className="h-3 w-3 text-muted-foreground" />}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <div className="space-y-2">
            <p className="font-medium">{term.term_name}</p>
            <p className="text-sm text-muted-foreground">{term.definition}</p>
            {term.example && (
              <p className="text-xs text-muted-foreground italic">
                Example: {term.example}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

/**
 * Hook-based approach for when you need the definition inline
 */
export const useTermDefinition = (termKey: string) => {
  const term = useGlossaryTerm(termKey);
  return term?.definition || null;
};
