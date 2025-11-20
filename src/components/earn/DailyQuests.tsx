import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { CheckCircle, Upload, ThumbsUp, Share2, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const questIcons = {
  upload: Upload,
  validate: ThumbsUp,
  share: Share2,
  streak: Flame
};

interface Quest {
  id: string;
  quest_type: string;
  description: string;
  trn_reward: number;
  target_count: number;
}

interface QuestProgress {
  quest_id: string;
  progress: number;
  completed: boolean;
}

export default function DailyQuests({ walletAddress }: { walletAddress?: string }) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [progress, setProgress] = useState<Record<string, QuestProgress>>({});

  useEffect(() => {
    async function fetchQuests() {
      const { data } = await supabase
        .from('daily_quests')
        .select('*')
        .eq('quest_date', new Date().toISOString().split('T')[0])
        .eq('active', true);
      
      setQuests(data || []);

      // Fetch user progress if wallet provided
      if (walletAddress) {
        const { data: progressData } = await supabase
          .from('user_quest_progress')
          .select('*')
          .eq('user_wallet_address', walletAddress);
        
        // Map progress by quest_id
        const progressMap: Record<string, QuestProgress> = {};
        progressData?.forEach(p => {
          progressMap[p.quest_id] = p;
        });
        setProgress(progressMap);
      }
    }

    fetchQuests();
  }, [walletAddress]);

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h3 className="font-display text-2xl font-bold mb-6">Daily Quests</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quests.map((quest) => {
          const Icon = questIcons[quest.quest_type as keyof typeof questIcons] || Upload;
          const userProgress = progress[quest.id];
          const isCompleted = userProgress?.completed || false;
          const currentProgress = userProgress?.progress || 0;

          return (
            <GlassCard key={quest.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-display font-bold mb-1">{quest.description}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {currentProgress}/{quest.target_count}
                    </span>
                    <span className="font-bold text-primary">+{quest.trn_reward} TRN</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${Math.min((currentProgress / quest.target_count) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
        </div>
      </div>
    </section>
  );
}
