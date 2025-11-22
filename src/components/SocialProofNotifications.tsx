import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

interface Notification {
  id: string;
  activity_type: string;
  user_identifier: string;
  message: string;
  created_at: string;
}

export const SocialProofNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

  useEffect(() => {
    // Fetch initial notifications
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('activity_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (data) setNotifications(data);
    };

    fetchNotifications();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('activity_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_notifications'
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
          setCurrentNotification(newNotification);
          
          // Hide after 5 seconds
          setTimeout(() => setCurrentNotification(null), 5000);
        }
      )
      .subscribe();

    // Show random notification every 15 seconds
    const interval = setInterval(() => {
      if (notifications.length > 0) {
        const random = notifications[Math.floor(Math.random() * notifications.length)];
        setCurrentNotification(random);
        setTimeout(() => setCurrentNotification(null), 5000);
      }
    }, 15000);

    return () => {
      channel.unsubscribe();
      clearInterval(interval);
    };
  }, [notifications]);

  return (
    <AnimatePresence>
      {currentNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: -50 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 left-4 z-50 max-w-sm"
        >
          <div className="bg-card border border-border rounded-lg shadow-lg p-4 flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Bell className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {currentNotification.message}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(currentNotification.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
