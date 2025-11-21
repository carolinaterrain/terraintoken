import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const WaitlistCounter = () => {
  const { data: count, isLoading } = useQuery({
    queryKey: ['waitlist-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('terrainscape_waitlist')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground animate-pulse">
        <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
      <span className="w-2 h-2 rounded-full bg-chart-3 animate-pulse" />
      <span className="font-semibold text-foreground">{count?.toLocaleString() || 0} people</span> joined the waitlist
    </div>
  );
};
