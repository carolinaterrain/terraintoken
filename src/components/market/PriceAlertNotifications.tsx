import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, BellOff, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export const PriceAlertNotifications = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const { toast } = useToast();

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
      setNotificationsEnabled(Notification.permission === "granted");
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Not Supported",
        description: "Your browser doesn't support notifications",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        setNotificationsEnabled(true);
        
        // Show test notification
        new Notification("🟢 Price Alerts Enabled!", {
          body: "You'll be notified when your price targets are hit",
          icon: "/terrain-mascot.png",
          badge: "/icon-192.png",
        });

        toast({
          title: "Notifications Enabled!",
          description: "You'll receive alerts for price changes",
        });
      } else {
        toast({
          title: "Permission Denied",
          description: "Enable notifications in your browser settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  const disableNotifications = () => {
    setNotificationsEnabled(false);
    toast({
      title: "Notifications Disabled",
      description: "You won't receive price alerts anymore",
    });
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-goblin-gold/30">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Browser Notifications
          </h3>
          {notificationsEnabled && (
            <Badge variant="outline" className="bg-goblin-green/20 text-goblin-green border-goblin-green">
              <Check className="w-3 h-3 mr-1" />
              Active
            </Badge>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Get instant alerts when TRN hits your target price or when whales make moves
        </p>

        {!notificationsEnabled ? (
          <Button
            onClick={requestNotificationPermission}
            className="w-full bg-gradient-to-r from-goblin-green to-terrain-purple"
            size="sm"
          >
            <Bell className="w-4 h-4 mr-2" />
            Enable Notifications
          </Button>
        ) : (
          <Button
            onClick={disableNotifications}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <BellOff className="w-4 h-4 mr-2" />
            Disable Notifications
          </Button>
        )}

        {permission === "denied" && (
          <div className="text-xs text-muted-foreground bg-terrain-shadow/50 p-2 rounded">
            ⚠️ Notifications blocked. Enable them in your browser settings.
          </div>
        )}
      </div>
    </Card>
  );
};
