import { useEffect, useState, memo, useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, DollarSign, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ChartData {
  date: string;
  holders: number;
}

export const LiveDataCharts = memo(() => {
  const [holderData, setHolderData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    // Fetch real holder snapshot data from database
    const fetchHolderData = async () => {
      try {
        const { data, error } = await supabase
          .from('holder_snapshots')
          .select('snapshot_date, total_holders, is_live_data')
          .eq('is_live_data', true) // Only real data
          .order('snapshot_date', { ascending: true })
          .limit(30);

        if (error) {
          console.error('Error fetching holder snapshots:', error);
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          const chartData = data.map(snapshot => ({
            date: new Date(snapshot.snapshot_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            holders: snapshot.total_holders
          }));
          setHolderData(chartData);
          setHasData(true);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error in fetchHolderData:', err);
        setLoading(false);
      }
    };

    fetchHolderData();
  }, []);

  const tooltipStyle = useMemo(() => ({
    backgroundColor: 'hsl(var(--popover))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px'
  }), []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Holder Growth (Historical Snapshots)
          </CardTitle>
          <CardDescription>
            {hasData ? 'Real holder count from on-chain snapshots' : 'No historical data available yet'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasData ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={holderData}>
                <defs>
                  <linearGradient id="holderGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="holders"
                  stroke="hsl(var(--primary))"
                  fill="url(#holderGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
              <AlertCircle className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-center font-mono text-sm">No historical snapshots recorded yet</p>
              <p className="text-center text-xs mt-2">
                Data will appear as daily snapshots are collected
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

LiveDataCharts.displayName = 'LiveDataCharts';
