import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import BackToHome from "@/components/BackToHome";
import { TrendingUp, TrendingDown, Users } from "lucide-react";

interface FunnelStep {
  step_name: string;
  step_order: number;
  total_users: number;
  avg_time_seconds: number;
  completion_rate: number;
}

export default function FunnelAnalytics() {
  const [funnelData, setFunnelData] = useState<FunnelStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFunnelData = async () => {
      const { data, error } = await supabase
        .from('funnel_events')
        .select('*')
        .order('step_order', { ascending: true });

      if (error) {
        console.error('Error fetching funnel data:', error);
        setLoading(false);
        return;
      }

      // Process data to calculate metrics per step
      const stepMap = new Map<string, any>();
      
      data?.forEach(event => {
        if (!stepMap.has(event.step_name)) {
          stepMap.set(event.step_name, {
            step_name: event.step_name,
            step_order: event.step_order,
            sessions: new Set(),
            total_time: 0,
            count: 0
          });
        }
        
        const step = stepMap.get(event.step_name);
        step.sessions.add(event.session_id);
        step.total_time += event.time_spent_seconds || 0;
        step.count++;
      });

      const steps: FunnelStep[] = Array.from(stepMap.values()).map((step, index, arr) => ({
        step_name: step.step_name,
        step_order: step.step_order,
        total_users: step.sessions.size,
        avg_time_seconds: step.total_time / step.count,
        completion_rate: index === 0 ? 100 : (step.sessions.size / arr[0].sessions.size) * 100
      }));

      setFunnelData(steps);
      setLoading(false);
    };

    fetchFunnelData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <BackToHome />
        <div className="max-w-6xl mx-auto mt-8">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded-lg" />
            <div className="h-32 bg-muted rounded-lg" />
            <div className="h-32 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <BackToHome />
      
      <div className="max-w-6xl mx-auto mt-8 space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Conversion Funnel Analytics</h1>
          <p className="text-muted-foreground">Track user journey from landing to conversion</p>
        </div>

        {/* Funnel Visualization */}
        <div className="space-y-4">
          {funnelData.map((step, index) => {
            const dropOff = index > 0 ? funnelData[index - 1].completion_rate - step.completion_rate : 0;
            
            return (
              <Card key={step.step_name} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {step.step_order}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{step.step_name}</CardTitle>
                        <CardDescription>
                          Avg. Time: {Math.round(step.avg_time_seconds)}s
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-2xl font-bold">{step.total_users}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {step.completion_rate.toFixed(1)}% retention
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Progress Bar */}
                  <div className="relative w-full h-8 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                      style={{ width: `${step.completion_rate}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground">
                      {step.completion_rate.toFixed(1)}%
                    </div>
                  </div>

                  {/* Drop-off indicator */}
                  {index > 0 && dropOff > 0 && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
                      <TrendingDown className="w-4 h-4" />
                      <span>{dropOff.toFixed(1)}% drop-off from previous step</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {funnelData[0]?.total_users || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Overall Conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {funnelData[funnelData.length - 1]?.completion_rate.toFixed(1) || 0}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Avg. Journey Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.round(funnelData.reduce((sum, s) => sum + s.avg_time_seconds, 0))}s
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
