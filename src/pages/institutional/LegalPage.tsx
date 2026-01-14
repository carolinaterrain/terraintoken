import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { InstitutionalLayout, PageHeader, Section } from "@/components/institutional/InstitutionalLayout";
import { DisclosureCallout } from "@/components/institutional/DisclosureCallout";
import { AlertTriangle, Shield, FileText, Lock } from "lucide-react";

const sections = [
  {
    id: "privacy",
    icon: Lock,
    title: "Privacy Policy",
    lastUpdated: "January 2026",
    content: [
      {
        heading: "Information We Collect",
        text: "We collect information you provide directly (account registration, contact forms), usage data (pages visited, features used), and technical data (device type, IP address). We use cookies and similar technologies for analytics and functionality."
      },
      {
        heading: "How We Use Information",
        text: "We use collected information to provide and improve our services, communicate with you about your account, send service-related announcements, and analyze usage patterns to improve user experience."
      },
      {
        heading: "Information Sharing",
        text: "We do not sell your personal information. We may share data with service providers who assist our operations, when required by law, or to protect our rights. Aggregated, anonymized data may be used for research and reporting."
      },
      {
        heading: "Data Retention",
        text: "We retain personal information as long as your account is active or as needed to provide services. You may request deletion of your data by contacting privacy@terraintoken.com."
      },
      {
        heading: "Your Rights",
        text: "Depending on your jurisdiction, you may have rights to access, correct, delete, or port your data. Contact us to exercise these rights."
      }
    ]
  },
  {
    id: "terms",
    icon: FileText,
    title: "Terms of Service",
    lastUpdated: "January 2026",
    content: [
      {
        heading: "Acceptance of Terms",
        text: "By accessing or using Terrain products and services, you agree to be bound by these terms. If you disagree with any part, you may not access our services."
      },
      {
        heading: "Service Description",
        text: "Terrain provides stormwater management software, AI analysis services, field operations, and educational content. TRN utility credits are an optional feature. All services are provided 'as is' without warranty of any kind."
      },
      {
        heading: "User Responsibilities",
        text: "You are responsible for maintaining the confidentiality of your account, all activities under your account, and ensuring your use complies with applicable laws and regulations."
      },
      {
        heading: "Intellectual Property",
        text: "All content, features, and functionality are owned by Terrain and protected by intellectual property laws. You may not copy, modify, or distribute our content without permission."
      },
      {
        heading: "Limitation of Liability",
        text: "Terrain shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services."
      },
      {
        heading: "Changes to Terms",
        text: "We may modify these terms at any time. Continued use after changes constitutes acceptance. Material changes will be communicated via email or platform notification."
      }
    ]
  },
  {
    id: "risk",
    icon: AlertTriangle,
    title: "Risk Disclosure",
    lastUpdated: "January 2026",
    content: [
      {
        heading: "No Guarantee of Compliance",
        text: "While Terrain products are designed to support stormwater compliance, we do not guarantee that use of our products will result in regulatory compliance. Users are responsible for ensuring their stormwater programs meet applicable requirements."
      },
      {
        heading: "Professional Judgment Required",
        text: "Terrain products provide tools and data to assist decision-making. They do not replace the professional judgment of licensed engineers, environmental consultants, or legal counsel."
      },
      {
        heading: "AI Limitations",
        text: "AI analysis provided by Terrain Vision has inherent limitations. Results should be verified by qualified professionals before making significant decisions. Confidence scores are estimates, not guarantees."
      },
      {
        heading: "Sensor Data Accuracy",
        text: "Terrain Guard sensor data depends on proper installation, calibration, and maintenance. Environmental factors may affect accuracy. Users should implement appropriate quality controls."
      },
      {
        heading: "Force Majeure",
        text: "We are not liable for failures or delays caused by circumstances beyond our control, including natural disasters, power outages, or third-party service disruptions."
      }
    ]
  },
  {
    id: "token",
    icon: Shield,
    title: "TRN Token Disclaimer",
    lastUpdated: "January 2026",
    content: [
      {
        heading: "Not an Investment",
        text: "TRN utility credits are NOT an investment, security, or financial instrument. They are utility credits that can be earned and redeemed within the Terrain ecosystem. Do not purchase TRN expecting to profit."
      },
      {
        heading: "No Guaranteed Value",
        text: "TRN has no guaranteed or inherent value. Its utility depends on the continued operation and development of the Terrain ecosystem. Market price, if any, is subject to extreme volatility."
      },
      {
        heading: "Not Required",
        text: "TRN is completely optional. All Terrain platform features work without TRN. You can be a full user of Carolina Terrain, Terrain Vision, Terrain Guard, Stormwater SCM, and Drainage Academy without ever acquiring TRN."
      },
      {
        heading: "No Promises",
        text: "Terrain makes no representations or warranties about future TRN value, utility expansion, exchange listings, or development milestones. Any forward-looking statements are subject to change."
      },
      {
        heading: "Regulatory Uncertainty",
        text: "The regulatory status of utility tokens varies by jurisdiction and may change. Users are responsible for compliance with local laws. Consult legal counsel if uncertain."
      },
      {
        heading: "Risk of Loss",
        text: "Acquiring TRN involves risk of total loss. Only participate with funds you can afford to lose entirely. This is not financial advice. Consult a qualified financial advisor before making any decisions."
      }
    ]
  }
];

export default function LegalPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <InstitutionalLayout>
      <Helmet>
        <title>Legal - Terrain</title>
        <meta name="description" content="Privacy policy, terms of service, risk disclosures, and token disclaimer for the Terrain ecosystem." />
      </Helmet>

      <PageHeader 
        title="Legal" 
        description="Privacy policy, terms of service, risk disclosures, and important disclaimers. Please read these documents carefully." 
      />

      {/* Quick Nav */}
      <div className="border-b bg-muted/30">
        <div className="container py-4">
          <div className="flex flex-wrap gap-4">
            {sections.map(section => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <section.icon className="h-4 w-4" />
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      {sections.map(section => (
        <Section key={section.id} id={section.id} className="border-b last:border-b-0">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <section.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{section.title}</h2>
                <p className="text-sm text-muted-foreground">Last updated: {section.lastUpdated}</p>
              </div>
            </div>

            <div className="space-y-6">
              {section.content.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-semibold">{item.heading}</h3>
                  <p className="text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>

            {section.id === 'token' && (
              <DisclosureCallout type="warning" title="Read Carefully">
                <p>
                  The above disclaimers are legally binding. By acquiring or using TRN, you 
                  acknowledge that you have read, understood, and agree to these terms.
                </p>
              </DisclosureCallout>
            )}
          </div>
        </Section>
      ))}

      <Section className="bg-muted/30">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <h2 className="text-xl font-bold">Questions?</h2>
          <p className="text-muted-foreground">
            For legal inquiries, contact <a href="mailto:legal@terraintoken.com" className="text-primary hover:underline">legal@terraintoken.com</a>
          </p>
        </div>
      </Section>
    </InstitutionalLayout>
  );
}
