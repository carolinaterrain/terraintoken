import { GlassCard } from "@/components/ui/glass-card";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToHome from "@/components/BackToHome";
import { Users, Target, Award, Shield, Linkedin, Twitter, Droplets, Globe, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import zachHyman from "@/assets/zac-hyman.jpg";
import alexPurdy from "@/assets/alex-purdy.jpg";
import terrainMascot from "@/assets/terrain-mascot.png";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  certifications: string[];
  linkedin?: string;
  twitter?: string;
}

const team: TeamMember[] = [
  {
    name: "Zac Hyman",
    role: "Co-Founder & CEO",
    bio: "Licensed NC Landscape Contractor with a passion for innovation. Zac founded Carolina Terrain LLC to bring professional-grade drainage solutions to homeowners. Now bridging traditional landscaping with blockchain technology through TRN.",
    image: zachHyman,
    certifications: [
      "Licensed NC Landscape Contractor (CL.1872)",
      "NDS Certified Property Drainage Contractor",
      "Keystone Certified Hardscape Contractor"
    ],
    linkedin: "https://www.linkedin.com/in/zachyman",
    twitter: "https://x.com/carolinaterrain"
  },
  {
    name: "Alex Purdy",
    role: "Co-Founder & CTO",
    bio: "Tech visionary and drainage expert. Alex combines deep technical expertise with hands-on field experience. Leads the development of TerrainVision AI and the integration of blockchain technology into Carolina Terrain's operations.",
    image: alexPurdy,
    certifications: [
      "NDS Certified Property Drainage Contractor",
      "SOX Erosion Control Certified",
      "Unilock Lifetime Warranty Certified"
    ],
    linkedin: "https://www.linkedin.com/in/alexpurdy"
  }
];

const companyStats = [
  {
    icon: Award,
    label: "Years in Business",
    value: "3+",
    description: "Serving North Carolina"
  },
  {
    icon: Users,
    label: "Happy Customers",
    value: "500+",
    description: "5-star reviews"
  },
  {
    icon: Shield,
    label: "Certifications",
    value: "8+",
    description: "Industry credentials"
  },
  {
    icon: Target,
    label: "Established Business",
    value: "Since 2022",
    description: "Real company backing"
  }
];

const Team = () => {
  return (
    <>
      <Helmet>
        <title>Team | Terrain Token (TRN)</title>
        <meta name="description" content="Meet the founders behind Terrain Token and Carolina Terrain LLC. Licensed contractors building the bridge between traditional landscaping and blockchain technology." />
      </Helmet>

      <ScrollProgress />
      <DesktopNav />

      <main id="main-content" className="min-h-screen bg-background pt-32 pb-20">
        <BackToHome />
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
              Meet the <span className="text-primary">Team</span>
            </h1>
            <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
              Real founders. Real business. Real transparency.
            </p>
          </div>

          {/* Company Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {companyStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <GlassCard key={index} className="p-6 text-center">
                  <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="font-display text-3xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="font-display text-sm font-semibold mb-1">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </GlassCard>
              );
            })}
          </div>

          {/* Team Members */}
          <div className="space-y-12 mb-16">
            {team.map((member, index) => (
              <GlassCard key={index} className="overflow-hidden">
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                  <div className={`${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                    <img 
                      src={member.image} 
                      alt={`${member.name} - ${member.role} of Terrain Token and Carolina Terrain LLC`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <h2 className="font-display text-3xl font-bold mb-2">{member.name}</h2>
                    <p className="text-primary font-semibold mb-4">{member.role}</p>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {member.bio}
                    </p>

                    {/* Certifications */}
                    <div className="mb-6">
                      <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        Certifications
                      </h3>
                      <ul className="space-y-2">
                        {member.certifications.map((cert, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {cert}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-3">
                      {member.linkedin && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="w-4 h-4 mr-2" />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      {member.twitter && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="w-4 h-4 mr-2" />
                            Twitter
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Origin Story Section */}
          <GlassCard className="p-8 md:p-12 mb-16">
            <div className="text-center mb-8">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Origin <span className="text-primary">Story</span>
              </h2>
              <p className="font-body text-lg text-muted-foreground">
                Where Engineering Meets Innovation
              </p>
            </div>

            {/* Mascot Icon */}
            <div className="flex justify-center mb-8">
              <img 
                src={terrainMascot} 
                alt="TRN mascot" 
                className="w-20 h-20 animate-float"
              />
            </div>

            {/* Main Narrative */}
            <div className="space-y-6 font-body text-lg text-muted-foreground max-w-3xl mx-auto">
              <p className="text-center">
                TerrainToken began as a spark from Alex — an intersection of engineering, AI, and blockchain.
              </p>

              {/* First Quote */}
              <div className="border-l-4 border-primary bg-primary/5 pl-6 py-4 rounded-r my-6">
                <p className="italic text-foreground">
                  "After years of fixing land failures, erosion, and stormwater problems, I recognized a simple truth..."
                </p>
              </div>

              {/* Three Truths */}
              <div className="grid md:grid-cols-3 gap-6 my-8">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Droplets className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground">Crypto had energy.</p>
                </div>
                
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground">Stormwater had consequences.</p>
                </div>
                
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <LinkIcon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground">No one had fused them into something real.</p>
                </div>
              </div>

              {/* Second Quote */}
              <div className="border-l-4 border-primary bg-primary/5 pl-6 py-4 rounded-r my-6">
                <p className="italic text-foreground">
                  "What if a token could be backed by real measurable land data, real work, and real environmental outcomes?"
                </p>
              </div>

              {/* Conclusion */}
              <p className="text-center text-lg">
                That question became the foundation of TerrainToken — a digital ecosystem built from the ground up <span className="italic">(literally)</span>, integrating AI models, decentralized incentives, and authentic field data.
              </p>

              {/* Final Statement */}
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-center text-xl font-semibold text-primary">
                  This is what happens when a drainage contractor builds a crypto project that actually means something.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Mission Statement */}
          <GlassCard className="p-8 md:p-12 bg-gradient-to-br from-primary/20 to-primary/5 text-center mb-16">
            <h2 className="font-display text-3xl font-bold mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              "We started Carolina Terrain to solve drainage problems. We launched Terrain Token to prove that meme coins can be more than speculation—they can be backed by real work, real revenue, and real people."
            </p>
            <p className="text-sm text-primary italic">
              — Zac Hyman & Alex Purdy, Co-Founders
            </p>
          </GlassCard>

          {/* CTA */}
          <div className="text-center">
            <h3 className="font-display text-2xl font-bold mb-4">Want to Learn More?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/whitepaper">Read Our Whitepaper</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary" asChild>
                <a href="https://carolinaterrain.com" target="_blank" rel="noopener noreferrer">
                  Visit Carolina Terrain
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};


export default Team;
