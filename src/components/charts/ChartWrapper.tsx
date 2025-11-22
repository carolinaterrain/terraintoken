import { memo, ReactElement } from 'react';
import { ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';

interface ChartWrapperProps {
  title: string;
  description?: string;
  children: ReactElement;
  height?: number;
  className?: string;
  printable?: boolean;
}

export const ChartWrapper = memo(({ 
  title, 
  description, 
  children, 
  height = 400,
  className = '',
  printable = true 
}: ChartWrapperProps) => {
  return (
    <Card 
      className={`p-6 md:p-8 lg:p-10 ${className} ${printable ? 'financial-chart' : ''}`}
      role="region"
      aria-label={`${title} chart`}
    >
      <div className="mb-6">
        <h3 className="font-display text-2xl font-bold mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="w-full overflow-x-auto">
        <ResponsiveContainer width="100%" height={height} minWidth={300}>
          {children}
        </ResponsiveContainer>
      </div>
    </Card>
  );
});

ChartWrapper.displayName = 'ChartWrapper';
