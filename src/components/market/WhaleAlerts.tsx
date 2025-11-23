import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Waves, TrendingUp, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface WhaleAlert {
  id: string;
  wallet_address: string;
  amount_trn: number;
  alert_type: string;
  metadata: any;
  created_at: string;
}

const WHALE_THRESHOLD = 5000000; // 5M TRN

export const WhaleAlerts = () => {
  const [alerts, setAlerts] = useState<WhaleAlert[]>([]);

  useEffect(() => {
    // Fetch initial alerts
    fetchWhaleAlerts();

    // Subscribe to real-time whale alerts
    const channel = supabase
      .channel("whale-alerts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "whale_alerts",
        },
        (payload) => {
          const newAlert = payload.new as WhaleAlert;
          setAlerts((prev) => [newAlert, ...prev.slice(0, 9)]);
          
          // Show browser notification if permitted
          if (Notification.permission === "granted") {
            new Notification("🐋 Whale Alert!", {
              body: `Whale bought ${(newAlert.amount_trn / 1000000).toFixed(2)}M TRN!`,
              icon: "/terrain-mascot.png",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchWhaleAlerts = async () => {
    const { data, error } = await supabase
      .from("whale_alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error && data) {
      setAlerts(data);
    }
  };

  const formatWallet = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getAlertColor = (amount: number) => {
    if (amount >= 10000000) return "text-purple-500";
    if (amount >= 5000000) return "text-blue-500";
    return "text-cyan-500";
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-blue-500/40">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
            <Waves className="w-5 h-5 animate-pulse" />
            Whale Alerts
          </h3>
          <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500">
            {alerts.length} spotted
          </Badge>
        </div>

        <div className="text-xs text-muted-foreground">
          <AlertCircle className="w-3 h-3 inline mr-1" />
          Tracking purchases over {(WHALE_THRESHOLD / 1000000).toFixed(1)}M TRN
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              No whale activity detected yet
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-terrain-shadow/50 p-3 rounded-lg border border-blue-500/30 hover:border-blue-500/60 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">🐋</div>
                    <div>
                      <div className="font-mono text-xs text-muted-foreground">
                        {formatWallet(alert.wallet_address)}
                      </div>
                      <div className={`text-sm font-bold ${getAlertColor(alert.amount_trn)}`}>
                        Bought {(alert.amount_trn / 1000000).toFixed(2)}M TRN
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <TrendingUp className="w-4 h-4 text-goblin-green mx-auto" />
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(alert.created_at), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center text-xs text-muted-foreground pt-2 border-t border-blue-500/20">
          Real-time whale tracking • Updates instantly
        </div>
      </div>
    </Card>
  );
};
