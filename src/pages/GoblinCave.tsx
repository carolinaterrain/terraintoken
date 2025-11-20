import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, Trophy, Zap, PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";

interface MemeSubmission {
  id: string;
  image_url: string;
  x_handle: string | null;
  caption: string | null;
  x_post_url: string | null;
  status: string;
  created_at: string;
  placement: number | null;
  prize: string | null;
}

const GoblinCave = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<MemeSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("pending");

  useEffect(() => {
    fetchSubmissions();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel("meme_submissions_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "meme_submissions"
        },
        () => {
          fetchSubmissions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filterStatus]);

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("meme_submissions")
      .select("*")
      .eq("status", filterStatus)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching submissions:", error);
    } else {
      setSubmissions(data || []);
    }
    setLoading(false);
  };

  const updateSubmissionStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("meme_submissions")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update submission",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Updated!",
        description: `Submission ${status}`,
      });
      fetchSubmissions();
    }
  };

  const addToHallOfFame = async (id: string, placement: number, prize: string) => {
    const { error } = await supabase
      .from("meme_submissions")
      .update({
        status: "approved",
        placement,
        prize,
        contest_date: "Contest #1 - Nov 2025"
      })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add to Hall of Fame",
        variant: "destructive"
      });
    } else {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast({
        title: "🏆 Added to Hall of Fame!",
        description: `Placement: ${placement}, Prize: ${prize}`,
        duration: 5000,
      });
      fetchSubmissions();
    }
  };

  const triggerGlobalEffect = (effect: string) => {
    const effects = {
      confetti: () => {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 }
        });
      },
      mud: () => {
        document.body.classList.add("animate-shake");
        setTimeout(() => document.body.classList.remove("animate-shake"), 3000);
      },
      rave: () => {
        document.body.classList.add("animate-disco");
        setTimeout(() => document.body.classList.remove("animate-disco"), 10000);
      },
      coinRain: () => {
        // Trigger coin rain confetti
        const duration = 5000;
        const animationEnd = Date.now() + duration;
        const coinColors = ['#10b981', '#059669', '#047857'];
        
        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) {
            clearInterval(interval);
            return;
          }
          
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: coinColors
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: coinColors
          });
        }, 100);
      }
    };
    
    effects[effect as keyof typeof effects]?.();
    
    toast({
      title: "🎉 Global Effect Triggered!",
      description: `${effect} activated across the site!`,
      duration: 4000,
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4 animate-bounce">🔐</div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Secret Goblin Cave
            </h1>
            <p className="text-muted-foreground">
              Admin dashboard for the Terrain Token erosion empire
            </p>
          </div>

          <Tabs defaultValue="moderation" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="moderation">🔍 Moderation</TabsTrigger>
              <TabsTrigger value="hall-of-fame">🏆 Hall of Fame</TabsTrigger>
              <TabsTrigger value="global">⚡ Global Effects</TabsTrigger>
            </TabsList>

            {/* Moderation Queue */}
            <TabsContent value="moderation" className="space-y-6">
              <div className="flex gap-2 mb-4">
                <Button
                  variant={filterStatus === "pending" ? "default" : "outline"}
                  onClick={() => setFilterStatus("pending")}
                >
                  Pending
                </Button>
                <Button
                  variant={filterStatus === "approved" ? "default" : "outline"}
                  onClick={() => setFilterStatus("approved")}
                >
                  Approved
                </Button>
                <Button
                  variant={filterStatus === "rejected" ? "default" : "outline"}
                  onClick={() => setFilterStatus("rejected")}
                >
                  Rejected
                </Button>
              </div>

              {loading ? (
                <p className="text-center text-muted-foreground">Loading submissions...</p>
              ) : submissions.length === 0 ? (
                <p className="text-center text-muted-foreground">No {filterStatus} submissions</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="bg-card border border-primary/20 rounded-lg p-4"
                    >
                      <img
                        src={submission.image_url}
                        alt="Submission"
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <div className="space-y-2 text-sm">
                        {submission.x_handle && (
                          <p><strong>X:</strong> {submission.x_handle}</p>
                        )}
                        {submission.caption && (
                          <p><strong>Caption:</strong> {submission.caption}</p>
                        )}
                        <p><strong>Status:</strong> {submission.status}</p>
                      </div>
                      
                      {filterStatus === "pending" && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => updateSubmissionStatus(submission.id, "approved")}
                          >
                            <Check className="w-4 h-4 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateSubmissionStatus(submission.id, "rejected")}
                          >
                            <X className="w-4 h-4 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                      
                      {filterStatus === "approved" && (
                        <Button
                          size="sm"
                          className="w-full mt-4"
                          onClick={() => {
                            const placement = prompt("Enter placement (1, 2, 3...):");
                            const prize = prompt("Enter prize (e.g., '2.5 SOL'):");
                            if (placement && prize) {
                              addToHallOfFame(submission.id, parseInt(placement), prize);
                            }
                          }}
                        >
                          <Trophy className="w-4 h-4 mr-1" /> Add to Hall of Fame
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Hall of Fame Manager */}
            <TabsContent value="hall-of-fame">
              <div className="bg-card border border-primary/20 rounded-lg p-8 text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h2 className="text-2xl font-bold mb-4">Hall of Fame Manager</h2>
                <p className="text-muted-foreground mb-6">
                  Approve a meme first, then click "Add to Hall of Fame" to assign placement and prize.
                </p>
                <Button onClick={() => setFilterStatus("approved")}>
                  View Approved Memes
                </Button>
              </div>
            </TabsContent>

            {/* Global Effects */}
            <TabsContent value="global" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card border border-primary/20 rounded-lg p-6 text-center">
                  <PartyPopper className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2">Coin Rain</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Trigger confetti celebration
                  </p>
                  <Button onClick={() => triggerGlobalEffect("confetti")}>
                    Activate
                  </Button>
                </div>

                <div className="bg-card border border-primary/20 rounded-lg p-6 text-center">
                  <Zap className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2">Screen Shake</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Earthquake across the site
                  </p>
                  <Button onClick={() => triggerGlobalEffect("mud")}>
                    Activate
                  </Button>
                </div>

                <div className="bg-card border border-primary/20 rounded-lg p-6 text-center">
                  <span className="text-5xl mb-4 block">🎉</span>
                  <h3 className="text-xl font-bold mb-2">Goblin Rave</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Full disco mode
                  </p>
                  <Button onClick={() => triggerGlobalEffect("rave")}>
                    Activate
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-12">
            <a href="/" className="text-primary hover:underline">
              ← Back to surface
            </a>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default GoblinCave;
