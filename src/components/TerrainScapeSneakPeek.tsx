import { useState } from "react";
import { GlassCard } from "./ui/glass-card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Gamepad2, 
  GraduationCap, 
  DollarSign, 
  Bot, 
  TrendingUp,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles
} from "lucide-react";

export const TerrainScapeSneakPeek = () => {
  const [activeTab, setActiveTab] = useState("earn");

  return (
    <section id="terrainscape-sneak-peek" className="py-20 md:py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary) / 0.15) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Banner with Glitch Effect */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/40 animate-pulse">
            🔒 CLASSIFIED - EARLY ACCESS 2026
          </Badge>
          
          <div className="relative inline-block">
            <h2 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-chart-3 to-chart-1 bg-clip-text text-transparent animate-fade-in">
              TerrainScape
            </h2>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-chart-3/20 blur-xl animate-pulse" />
          </div>
          
          <p className="text-xl md:text-3xl text-muted-foreground mb-4 font-semibold">
            Operation Goblin 🎮
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            The World's First Educational Play-to-Earn MMO
          </p>
          
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="w-3 h-3 rounded-full bg-chart-3 animate-pulse" />
            <span className="text-sm text-muted-foreground">Project Progress: 23% Complete</span>
          </div>
        </div>

        {/* 3-Panel Explainer */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <GlassCard className="p-8 hover" onClick={() => {}}>
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Gamepad2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">What Is It?</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              The world's first MMO where learning real skills = earning real money
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-chart-3 mt-0.5 flex-shrink-0" />
                <span>Learn drainage engineering through RuneScape-style quests</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-chart-3 mt-0.5 flex-shrink-0" />
                <span>Earn TRN tokens for completing training missions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-chart-3 mt-0.5 flex-shrink-0" />
                <span>Build portfolio of skills verified by achievements</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-chart-3 mt-0.5 flex-shrink-0" />
                <span>Get hired by real companies based on your rank</span>
              </li>
            </ul>
          </GlassCard>

          <GlassCard className="p-8 hover" onClick={() => {}}>
            <div className="w-12 h-12 rounded-full bg-chart-3/20 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-chart-3" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">The Vision</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              From $2/day to $300/month through gaming
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-chart-3 mt-0.5 flex-shrink-0" />
                <span>100,000 players in emerging markets earning income</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-chart-3 mt-0.5 flex-shrink-0" />
                <span>Families lifted out of poverty by playing games</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-chart-3 mt-0.5 flex-shrink-0" />
                <span>AI training data worth $36M+/year funding ecosystem</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-chart-3 mt-0.5 flex-shrink-0" />
                <span>"I got a job offer from playing a video game"</span>
              </li>
            </ul>
          </GlassCard>

          <GlassCard className="p-8 hover" onClick={() => {}}>
            <div className="w-12 h-12 rounded-full bg-chart-1/20 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-chart-1" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">The Connection</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Your TRN tokens unlock premium features
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-chart-3 mt-0.5 flex-shrink-0" />
                <span>Spend TRN on XP boosts, cosmetics, guild upgrades</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-chart-3 mt-0.5 flex-shrink-0" />
                <span>Trade items on Grand Exchange (2% TRN fee)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-chart-3 mt-0.5 flex-shrink-0" />
                <span>Cash out earnings to crypto wallet</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-chart-3 mt-0.5 flex-shrink-0" />
                <span>Early TRN holders get founding player priority access</span>
              </li>
            </ul>
          </GlassCard>
        </div>

        {/* Interactive Tabbed Showcase */}
        <GlassCard className="p-8 mb-20">
          <h3 className="text-3xl font-bold mb-8 text-center text-foreground">
            Interactive Feature Showcase
          </h3>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="earn">Play-to-Earn</TabsTrigger>
              <TabsTrigger value="career">Career Path</TabsTrigger>
              <TabsTrigger value="economy">Economy</TabsTrigger>
              <TabsTrigger value="ai">AI Training</TabsTrigger>
            </TabsList>
            
            <TabsContent value="earn" className="space-y-4">
              <div className="text-center py-8">
                <div className="flex items-center justify-center gap-4 flex-wrap text-lg font-semibold">
                  <span className="px-4 py-2 bg-primary/20 rounded-lg">Complete Quest</span>
                  <ArrowRight className="w-5 h-5 text-primary" />
                  <span className="px-4 py-2 bg-chart-3/20 rounded-lg">Earn 50 TRN</span>
                  <ArrowRight className="w-5 h-5 text-primary" />
                  <span className="px-4 py-2 bg-chart-1/20 rounded-lg">Spend on Cosmetics</span>
                  <ArrowRight className="w-5 h-5 text-primary" />
                  <span className="px-4 py-2 bg-chart-2/20 rounded-lg">AI Learns</span>
                  <ArrowRight className="w-5 h-5 text-primary" />
                  <span className="px-4 py-2 bg-primary/20 rounded-lg">Better Quests</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="career" className="space-y-6">
              <div className="space-y-4">
                {[
                  { rank: 1, title: "Apprentice", color: "bg-muted" },
                  { rank: 2, title: "Installer", color: "bg-chart-4/30" },
                  { rank: 3, title: "Designer", color: "bg-chart-2/30" },
                  { rank: 4, title: "Engineer", color: "bg-chart-1/30" },
                  { rank: 5, title: "Master", color: "bg-chart-3/30" }
                ].map((level) => (
                  <div key={level.rank} className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${level.color} flex items-center justify-center font-bold`}>
                      {level.rank}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{level.title} (Rank {level.rank})</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="font-semibold text-foreground mb-2">At Master Rank:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✅ "Certified" badge visible to employers</li>
                  <li>✅ Portfolio: 100+ completed projects</li>
                  <li>✅ Job Offers: Auto-matched with hiring partners</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="economy" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-3xl font-bold text-foreground">2,847</p>
                      <p className="text-sm text-muted-foreground">Active Players</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-chart-3/10 rounded-lg border border-chart-3/20">
                  <div className="flex items-center gap-3 mb-4">
                    <DollarSign className="w-8 h-8 text-chart-3" />
                    <div>
                      <p className="text-3xl font-bold text-foreground">1.2M TRN</p>
                      <p className="text-sm text-muted-foreground">Total Earned</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-chart-1/10 rounded-lg border border-chart-1/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-8 h-8 text-chart-1" />
                    <div>
                      <p className="text-3xl font-bold text-foreground">127</p>
                      <p className="text-sm text-muted-foreground">Jobs Placed</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-chart-2/10 rounded-lg border border-chart-2/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Bot className="w-8 h-8 text-chart-2" />
                    <div>
                      <p className="text-3xl font-bold text-foreground">850k</p>
                      <p className="text-sm text-muted-foreground">AI Training Data</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="ai" className="space-y-4">
              <div className="text-center py-8">
                <div className="flex items-center justify-center gap-4 flex-wrap text-sm md:text-base font-semibold">
                  <span className="px-4 py-2 bg-primary/20 rounded-lg">Player Actions</span>
                  <ArrowRight className="w-5 h-5 text-primary" />
                  <span className="px-4 py-2 bg-chart-2/20 rounded-lg">Labeled Training Data</span>
                  <ArrowRight className="w-5 h-5 text-primary" />
                  <span className="px-4 py-2 bg-chart-1/20 rounded-lg">Construction AI</span>
                  <ArrowRight className="w-5 h-5 text-primary" />
                  <span className="px-4 py-2 bg-chart-3/20 rounded-lg">License to Companies</span>
                  <ArrowRight className="w-5 h-5 text-primary" />
                  <span className="px-4 py-2 bg-primary/20 rounded-lg">Revenue → Fund TRN</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </GlassCard>

        {/* Comparison Table */}
        <GlassCard className="p-8 mb-20">
          <h3 className="text-3xl font-bold mb-8 text-center text-foreground">
            Traditional Education vs TerrainScape
          </h3>
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-foreground">Feature</th>
                  <th className="text-left py-4 px-4 text-foreground">Traditional Education</th>
                  <th className="text-left py-4 px-4 text-foreground">TerrainScape</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Cost", traditional: "$5,000+ tuition", terrainscape: "FREE (earn while learning)", tIcon: XCircle, tsIcon: CheckCircle2 },
                  { feature: "Time", traditional: "6-12 months", terrainscape: "Learn at your own pace", tIcon: XCircle, tsIcon: CheckCircle2 },
                  { feature: "Job Guarantee", traditional: "None", terrainscape: "Auto-matching with employers", tIcon: XCircle, tsIcon: CheckCircle2 },
                  { feature: "Engagement", traditional: "😴 Boring lectures", terrainscape: "🎮 Gamified, addictive", tIcon: XCircle, tsIcon: CheckCircle2 },
                  { feature: "Portfolio", traditional: "Theory only", terrainscape: "100+ completed projects", tIcon: XCircle, tsIcon: CheckCircle2 },
                  { feature: "Global Access", traditional: "Location-locked", terrainscape: "Smartphone + internet", tIcon: XCircle, tsIcon: CheckCircle2 },
                ].map((row) => (
                  <tr key={row.feature} className="border-b border-border/50">
                    <td className="py-4 px-4 font-semibold text-foreground">{row.feature}</td>
                    <td className="py-4 px-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <row.tIcon className="w-4 h-4 text-destructive flex-shrink-0" />
                        <span>{row.traditional}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <row.tsIcon className="w-4 h-4 text-chart-3 flex-shrink-0" />
                        <span>{row.terrainscape}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {[
              { feature: "Cost", traditional: "$5,000+ tuition", terrainscape: "FREE (earn while learning)" },
              { feature: "Time", traditional: "6-12 months", terrainscape: "Learn at your own pace" },
              { feature: "Job Guarantee", traditional: "None", terrainscape: "Auto-matching with employers" },
              { feature: "Engagement", traditional: "😴 Boring lectures", terrainscape: "🎮 Gamified, addictive" },
              { feature: "Portfolio", traditional: "Theory only", terrainscape: "100+ completed projects" },
              { feature: "Global Access", traditional: "Location-locked", terrainscape: "Smartphone + internet" },
            ].map((row) => (
              <div key={row.feature} className="p-4 bg-card/40 rounded-lg border border-border/50">
                <h4 className="font-bold text-foreground mb-3">{row.feature}</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Traditional:</p>
                      <p className="text-sm text-foreground">{row.traditional}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-chart-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">TerrainScape:</p>
                      <p className="text-sm text-foreground">{row.terrainscape}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Three Pillars */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <GlassCard className="p-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 mx-auto">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center text-foreground">Educational</h3>
            <p className="text-center text-muted-foreground mb-4">Learn Real Skills</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Drainage engineering curriculum by Master Alex Purden</li>
              <li>• Quiz-based skill verification</li>
              <li>• Hands-on project simulations</li>
              <li>• Industry certification upon Master rank</li>
            </ul>
          </GlassCard>

          <GlassCard className="p-8">
            <div className="w-16 h-16 rounded-full bg-chart-3/20 flex items-center justify-center mb-6 mx-auto">
              <DollarSign className="w-8 h-8 text-chart-3" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center text-foreground">Economic</h3>
            <p className="text-center text-muted-foreground mb-4">Earn Real Money</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 50-100 TRN per week (casual play)</li>
              <li>• $50-300/month potential income</li>
              <li>• Marketplace trading (buy low, sell high)</li>
              <li>• Cash out to crypto wallet anytime</li>
            </ul>
          </GlassCard>

          <GlassCard className="p-8">
            <div className="w-16 h-16 rounded-full bg-chart-2/20 flex items-center justify-center mb-6 mx-auto">
              <Bot className="w-8 h-8 text-chart-2" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center text-foreground">Technological</h3>
            <p className="text-center text-muted-foreground mb-4">Train AI, Get Paid</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Every action generates AI training data</li>
              <li>• Sell datasets to construction tech companies</li>
              <li>• $36M+/year passive revenue (projected Year 3)</li>
              <li>• Funds TRN reward pools forever</li>
            </ul>
          </GlassCard>
        </div>

        {/* Roadmap Teaser */}
        <GlassCard className="p-8 mb-20">
          <h3 className="text-3xl font-bold mb-8 text-center text-foreground">
            Development Timeline
          </h3>
          
          <div className="space-y-6">
            {[
              {
                phase: "Phase 1 (Q3 2025)",
                status: "complete",
                title: "Core engine complete",
                items: ["Tick-based multiplayer system (600ms)", "30+ database tables", "Quest system, NPCs, skills tracking"]
              },
              {
                phase: "Phase 2 (Q4 2025)",
                status: "progress",
                title: "Beta Launch",
                items: ["50 academy quests playable", "TRN earning system live", "Marketplace beta (Grand Exchange)", "1,000 beta testers"]
              },
              {
                phase: "Phase 3 (Q1 2026)",
                status: "future",
                title: "Public Launch",
                items: ["Mobile app (iOS + Android)", "10 languages (target emerging markets)", "Job placement partnerships", "Leaderboard competitions"]
              },
              {
                phase: "Phase 4 (Q2-Q4 2026)",
                status: "future",
                title: "Expansion",
                items: ["Landscaping, concrete, electrical modules", "AI data marketplace launch", "Corporate training white-label", "100k+ active players"]
              },
              {
                phase: "Phase 5 (2027+)",
                status: "future",
                title: "Global Scale",
                items: ["1M+ players worldwide", "Partnership with World Bank/NGOs", "Expansion to 20+ industries", '"The LinkedIn of skilled trades"']
              }
            ].map((phase) => (
              <div key={phase.phase} className="flex gap-4">
                <div className="flex-shrink-0">
                  {phase.status === "complete" && <CheckCircle2 className="w-6 h-6 text-chart-3" />}
                  {phase.status === "progress" && <TrendingUp className="w-6 h-6 text-primary animate-pulse" />}
                  {phase.status === "future" && <div className="w-6 h-6 rounded-full border-2 border-primary/40" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-foreground mb-2">{phase.phase}: {phase.title}</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {phase.items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Founder's Message */}
        <GlassCard className="p-8 mb-20">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-center text-foreground">
              Founder's Message
            </h3>
            <div className="prose prose-invert max-w-none">
              <blockquote className="text-lg text-muted-foreground italic border-l-4 border-primary pl-6 py-4">
                "I started Carolina Terrain with a shovel and a dream. Now we're creating a platform where anyone, anywhere can learn drainage engineering and earn a living - just by playing a game.
                <br /><br />
                This isn't about getting rich quick. This is about changing lives through education and opportunity.
                <br /><br />
                If we can help 100,000 families escape poverty while building the world's best construction AI, then TRN will have achieved something no meme coin has ever done.
                <br /><br />
                Let's dig in. ⛏️"
              </blockquote>
              <p className="text-right text-sm text-muted-foreground mt-4">
                — Alex Purden, Founder<br />
                Carolina Terrain LLC & TerrainScape
              </p>
            </div>
          </div>
        </GlassCard>

        {/* CTA Buttons */}
        <div className="text-center mb-20">
          <GlassCard className="p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              🎮 Join the Waitlist
            </h3>
            <p className="text-muted-foreground mb-6">
              Priority Access for TRN Holders
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-chart-3" />
                <span>500 TRN welcome bonus</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-chart-3" />
                <span>Exclusive founder cosmetics</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-chart-3" />
                <span>Early access to Grand Exchange marketplace</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Join Waitlist
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 justify-center mt-6">
              <Button variant="ghost" size="sm">
                📖 Read Full Vision
              </Button>
              <Button variant="ghost" size="sm">
                💬 Join Discord
              </Button>
            </div>
          </GlassCard>
        </div>

        {/* FAQ Accordion */}
        <GlassCard className="p-8 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold mb-8 text-center text-foreground">
            Frequently Asked Questions
          </h3>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                Is this real or just a roadmap promise?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Real. Core engine complete. 30+ database tables live. Beta Q4 2025. This isn't vaporware - we're actively developing and testing the platform.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                How much can I actually earn?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Casual: 50-100 TRN/week (~$5-10 at current price)<br />
                Active: 200-500 TRN/week (~$20-50)<br />
                Pro trader: 500-1,000 TRN/week (~$50-100)<br />
                (Earnings increase as TRN price rises)
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                Do I need TRN tokens to play?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                No. Game is FREE. You EARN TRN by playing. TRN holders get priority access + bonuses, but the game is designed to be accessible to everyone.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                Can I really get a job from playing this?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes. Carolina Terrain already committed to hiring top players. 50+ drainage companies expressing interest in partnership. Master Rank = industry certification.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">
                How does the AI training work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Every quest completion, tool selection, and project decision trains AI. Data anonymized and licensed to construction tech companies. Revenue funds TRN reward pools (sustainable forever).
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </GlassCard>

        {/* Disclaimer */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="p-6 bg-muted/50 rounded-lg border border-border/50">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              ⚠️ IMPORTANT: TerrainScape is in active development. Features subject to change. 
              Earning potential varies by effort, skill, and market conditions. TRN token price is volatile. 
              Never invest more than you can afford to lose. This is not financial advice. DYOR.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
