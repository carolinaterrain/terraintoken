import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Coins, TrendingUp, Award, Upload } from "lucide-react";

export const InteractiveRewardCalculator = () => {
  const [uploads, setUploads] = useState(10);
  const [shares, setShares] = useState(5);
  const [validations, setValidations] = useState(7);
  const [streakDays, setStreakDays] = useState(7);

  const calculateRewards = () => {
    const uploadReward = uploads * 25;
    const shareReward = shares * 10;
    const validationReward = validations * 15;
    const streakBonus = streakDays >= 7 ? 200 : 0;
    const total = uploadReward + shareReward + validationReward + streakBonus;
    
    return {
      upload: uploadReward,
      share: shareReward,
      validation: validationReward,
      streak: streakBonus,
      total
    };
  };

  const rewards = calculateRewards();

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-card via-card to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Coins className="w-6 h-6 text-primary" />
          TRN Reward Calculator
        </CardTitle>
        <CardDescription>
          See how much TRN you can earn with your activity level
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Uploads */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" />
              Project Uploads
            </Label>
            <span className="text-sm font-bold text-primary">
              {uploads} uploads = {rewards.upload} TRN
            </span>
          </div>
          <Slider
            value={[uploads]}
            onValueChange={(v) => setUploads(v[0])}
            min={0}
            max={50}
            step={1}
            className="w-full"
          />
        </div>

        {/* Shares */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Social Shares
            </Label>
            <span className="text-sm font-bold text-primary">
              {shares} shares = {rewards.share} TRN
            </span>
          </div>
          <Slider
            value={[shares]}
            onValueChange={(v) => setShares(v[0])}
            min={0}
            max={30}
            step={1}
            className="w-full"
          />
        </div>

        {/* Validations */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              Validated Projects
            </Label>
            <span className="text-sm font-bold text-primary">
              {validations} validations = {rewards.validation} TRN
            </span>
          </div>
          <Slider
            value={[validations]}
            onValueChange={(v) => setValidations(v[0])}
            min={0}
            max={50}
            step={1}
            className="w-full"
          />
        </div>

        {/* Streak */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              🔥 Daily Streak
            </Label>
            <span className="text-sm font-bold text-primary">
              {streakDays} days {streakDays >= 7 ? `= ${rewards.streak} TRN Bonus!` : ''}
            </span>
          </div>
          <Slider
            value={[streakDays]}
            onValueChange={(v) => setStreakDays(v[0])}
            min={0}
            max={30}
            step={1}
            className="w-full"
          />
        </div>

        {/* Total */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Total Monthly Earnings</span>
            <span className="text-3xl font-bold text-primary">
              {rewards.total} TRN
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Based on current reward rates. Actual earnings may vary.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
