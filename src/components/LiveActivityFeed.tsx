import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  activity_type: string;
  user_identifier: string;
  message: string;
  created_at: string;
  metadata?: any;
}

export const LiveActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Fetch initial activities
    const fetchActivities = async () => {
      const { data } = await supabase
        .from('activity_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (data) setActivities(data);
    };

    fetchActivities();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('live_activity_feed')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_notifications'
        },
        (payload) => {
          const newActivity = payload.new as ActivityItem;
          setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      meme_approved: '🎨',
      project_approved: '📸',
      achievement_earned: '🏆',
      referral_signup: '👥',
      contest_entry: '🎯',
      trn_earned: '💰',
    };
    return icons[type] || '🔔';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Live Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <AnimatePresence mode="popLayout">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="mb-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl" role="img" aria-label="activity">
                    {getActivityIcon(activity.activity_type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground break-words">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {activities.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No recent activity</p>
              <p className="text-xs mt-1">Be the first to contribute!</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
