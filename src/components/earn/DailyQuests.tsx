import { GlassCard } from "@/components/ui/glass-card";
import { Upload, ThumbsUp, Share2, Flame, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Static evergreen quests that are always available
const everGreenQuests = [
  {
    id: 'daily_upload',
    quest_type: 'upload',
    description: 'Upload a terrain photo today',
    trn_reward: 10,
    target_count: 1
  },
  {
    id: 'upload_3',
    quest_type: 'upload',
    description: 'Upload 3 photos in a day',
    trn_reward: 35,
    target_count: 3
  },
  {
    id: 'ai_training',
    quest_type: 'validate',
    description: 'Allow AI training on your upload',
    trn_reward: 50,
    target_count: 1
  },
  {
    id: 'categorize',
    quest_type: 'streak',
    description: 'Complete all upload fields',
    trn_reward: 15,
    target_count: 1
  }
];

const questIcons = {
  upload: Upload,
  validate: ThumbsUp,
  share: Share2,
  streak: Flame
};

export default function DailyQuests() {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl font-bold">Daily Quests</h3>
          <Badge variant="secondary" className="gap-1">
            <Clock className="w-3 h-3" />
            Resets Daily
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {everGreenQuests.map((quest) => {
            const Icon = questIcons[quest.quest_type as keyof typeof questIcons] || Upload;

            return (
              <GlassCard key={quest.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted">
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-display font-bold mb-1">{quest.description}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {quest.target_count === 1 ? "Complete once" : `Complete ${quest.target_count}x`}
                      </span>
                      <span className="font-bold text-primary">+{quest.trn_reward} TRN</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Complete quests by uploading at <a href="/upload-project" className="text-primary hover:underline">/upload-project</a>
        </p>
      </div>
    </section>
  );
}
