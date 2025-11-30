import { Helmet } from "react-helmet-async";
import ScrollProgress from "@/components/ScrollProgress";
import BackToHome from "@/components/BackToHome";
import EarnHero from "@/components/earn/EarnHero";
import HowItWorks from "@/components/earn/HowItWorks";
import DailyQuests from "@/components/earn/DailyQuests";
import Leaderboard from "@/components/earn/Leaderboard";
import MyRewardsDashboard from "@/components/earn/MyRewardsDashboard";
import AchievementBadges from "@/components/earn/AchievementBadges";
import LegalDisclaimers from "@/components/earn/LegalDisclaimers";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";

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

      <ScrollProgress />
      <DesktopNav />
      
      <main id="main-content" className="min-h-screen bg-gradient-to-b from-background to-background/50 pt-16">
        <BackToHome />
        <EarnHero />
        <HowItWorks />
        <DailyQuests />
        <Leaderboard />
        <MyRewardsDashboard />
        <AchievementBadges />
        <LegalDisclaimers />
      </main>

      <Footer />
    </>
  );
};

export default EarnTRN;
