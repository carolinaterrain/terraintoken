import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const LiveViewersCounter = () => {
  const [sessionId] = useState(() => {
    const existing = sessionStorage.getItem("viewer_session");
    if (existing) return existing;
    const newId = crypto.randomUUID();
    sessionStorage.setItem("viewer_session", newId);
    return newId;
  });

  // Register this viewer
  useEffect(() => {
    const registerViewer = async () => {
      await supabase.rpc("register_live_viewer", {
        p_session_id: sessionId,
        p_page_path: "/goblin-market",
      });
    };

    registerViewer();

    // Update every 30 seconds
    const interval = setInterval(registerViewer, 30000);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      supabase.rpc("remove_live_viewer", { p_session_id: sessionId });
    };
  }, [sessionId]);

  const { data: viewerCount } = useQuery({
    queryKey: ["live-viewers"],
    queryFn: async () => {
      // Cleanup old viewers first
      await supabase.rpc("cleanup_stale_viewers");

      // Count active viewers
      const { data: count } = await supabase.rpc("get_live_viewer_count", {
        p_page_path: "/goblin-market",
      });

      return count || 0;
    },
    refetchInterval: 30000,
  });

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-1 bg-goblin-green/20 px-3 py-1 rounded-full border border-goblin-green/30">
        <Eye className="w-4 h-4 text-goblin-green animate-pulse" />
        <span className="text-goblin-green font-bold">
          {viewerCount || 0}
        </span>
        <span className="text-muted-foreground text-xs">
          goblins watching
        </span>
      </div>
    </div>
  );
};