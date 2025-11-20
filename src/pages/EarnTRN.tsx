import { Helmet } from "react-helmet-async";
import EarnHero from "@/components/earn/EarnHero";
import HowItWorks from "@/components/earn/HowItWorks";
import DailyQuests from "@/components/earn/DailyQuests";
import Leaderboard from "@/components/earn/Leaderboard";
import MyRewardsDashboard from "@/components/earn/MyRewardsDashboard";
import AchievementBadges from "@/components/earn/AchievementBadges";
import WeeklyContests from "@/components/earn/WeeklyContests";
import LegalDisclaimers from "@/components/earn/LegalDisclaimers";

const EarnTRN = () => {
  return (
    <>
      <Helmet>
        <title>Earn TRN - Turn Your Yard Problems Into Rewards | Terrain Token</title>
        <meta 
          name="description" 
          content="Upload terrain photos, train our AI, and earn TRN tokens. Get rewarded for contributing to the world's first terrain-data intelligence network." 
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
        <EarnHero />
        <HowItWorks />
        <DailyQuests />
        <Leaderboard />
        <MyRewardsDashboard />
        <AchievementBadges />
        <WeeklyContests />
        <LegalDisclaimers />
      </div>
    </>
  );
};

export default EarnTRN;
