import { useState } from "react";
import { Bell, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export const PriceAlerts = ({ currentPrice }: { currentPrice: number }) => {
  const [email, setEmail] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [alertType, setAlertType] = useState<"above" | "below">("above");
  const { toast } = useToast();

  const { data: alerts, refetch } = useQuery({
    queryKey: ["price-alerts", email],
    queryFn: async () => {
      if (!email) return [];
      const { data } = await supabase
        .from("price_alerts")
        .select("*")
        .eq("user_email", email)
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!email,
  });

  const handleCreateAlert = async () => {
    if (!email || !targetPrice) {
      toast({
        title: "Missing fields",
        description: "Please enter your email and target price",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("price_alerts").insert({
      user_email: email,
      target_price: parseFloat(targetPrice),
      alert_type: alertType,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create price alert",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Alert Created! 🔔",
      description: `We'll email you when TRN goes ${alertType} $${targetPrice}`,
    });

    setTargetPrice("");
    refetch();
  };

  const handleDeleteAlert = async (id: string) => {
    const { error } = await supabase
      .from("price_alerts")
      .update({ is_active: false })
      .eq("id", id);

    if (!error) {
      toast({ title: "Alert deleted" });
      refetch();
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-terrain-purple/60">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-terrain-purple" />
        <h3 className="text-lg font-bold text-foreground">Price Alerts</h3>
      </div>

      <div className="space-y-3">
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-terrain-shadow border-border"
        />

        <div className="flex gap-2">
          <select
            value={alertType}
            onChange={(e) => setAlertType(e.target.value as "above" | "below")}
            className="px-3 py-2 bg-terrain-shadow border border-border rounded-md text-foreground"
          >
            <option value="above">Above</option>
            <option value="below">Below</option>
          </select>

          <Input
            type="number"
            step="0.00000001"
            placeholder="Target price"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="bg-terrain-shadow border-border"
          />

          <Button onClick={handleCreateAlert} className="bg-terrain-purple">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Current: ${currentPrice.toFixed(8)}
        </p>
      </div>

      {alerts && alerts.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-muted-foreground">Your active alerts:</p>
          {alerts.map((alert: any) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-2 bg-terrain-shadow rounded-lg"
            >
              <span className="text-sm">
                {alert.alert_type === "above" ? "📈" : "📉"} ${alert.target_price}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteAlert(alert.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
