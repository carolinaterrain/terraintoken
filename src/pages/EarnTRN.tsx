import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import EarnHero from "@/components/earn/EarnHero";
import HowItWorks from "@/components/earn/HowItWorks";
import DailyQuests from "@/components/earn/DailyQuests";
import Leaderboard from "@/components/earn/Leaderboard";
import MyRewardsDashboard from "@/components/earn/MyRewardsDashboard";
import AchievementBadges from "@/components/earn/AchievementBadges";
import WeeklyContests from "@/components/earn/WeeklyContests";
import LegalDisclaimers from "@/components/earn/LegalDisclaimers";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import DesktopNav from "@/components/DesktopNav";

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

      <AnnouncementBanner />
      <DesktopNav />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50 pt-16">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            asChild
          >
            <a href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </a>
          </Button>
        </div>
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
