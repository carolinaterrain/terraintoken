import { useMemo } from 'react';

/**
 * Chart data memoization hook to prevent unnecessary recalculations
 */
export const useChartData = <T,>(data: T[]) => {
  return useMemo(() => data, [JSON.stringify(data)]);
};

/**
 * Chart configuration memoization hook
 */
export const useChartConfig = <T,>(config: T) => {
  return useMemo(() => config, [JSON.stringify(config)]);
};

/**
 * Calculate SVG pie chart slice parameters
 */
export const calculatePieSlice = (percentage: number, startPercentage: number) => {
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const offset = (startPercentage / 100) * circumference;
  const dashArray = `${(percentage / 100) * circumference} ${circumference}`;
  
  return { offset, dashArray, circumference };
};

/**
 * Memoized pie slice calculation
 */
export const usePieSlice = (percentage: number, startPercentage: number) => {
  return useMemo(
    () => calculatePieSlice(percentage, startPercentage),
    [percentage, startPercentage]
  );
};

/**
 * Generate accessible chart data table
 */
export const generateChartDataTable = (
  data: Array<Record<string, any>>,
  columns: Array<{ key: string; label: string; format?: (val: any) => string }>
) => {
  return {
    caption: 'Chart data in tabular format',
    headers: columns.map(col => col.label),
    rows: data.map(row => 
      columns.map(col => {
        const value = row[col.key];
        return col.format ? col.format(value) : String(value);
      })
    )
  };
};
