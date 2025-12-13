import { Helmet } from "react-helmet-async";
import BackToHome from "@/components/BackToHome";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Terrain Token</title>
        <meta name="description" content="Privacy Policy for Terrain Token - Learn how we collect, use, and protect your information." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <BackToHome />
          
          <article className="max-w-4xl mx-auto py-12 prose prose-invert">
            <h1 className="text-4xl font-bold font-display text-foreground mb-8">Privacy Policy</h1>
            <p className="text-muted-foreground mb-4">Last Updated: December 13, 2025</p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
              <p className="text-muted-foreground mb-4">
                Terrain Token ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. 
                This privacy policy explains how we collect, use, and safeguard your information when you visit our website 
                and use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
              <p className="text-muted-foreground mb-4">We may collect the following types of information:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Wallet Addresses:</strong> When you connect your Solana wallet to interact with our platform.</li>
                <li><strong>Email Addresses:</strong> When you join our waitlist or subscribe to updates.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our website (pages visited, time spent, etc.).</li>
                <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers.</li>
                <li><strong>Analytics Data:</strong> Aggregated, anonymized data to improve our services.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">We use collected information to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide and maintain our services</li>
                <li>Send you updates, notifications, and marketing communications (with your consent)</li>
                <li>Improve our website and user experience</li>
                <li>Process transactions and reward distributions</li>
                <li>Comply with legal obligations</li>
                <li>Detect and prevent fraud or abuse</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Sharing</h2>
              <p className="text-muted-foreground mb-4">
                We do not sell your personal data. We may share information with:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Service Providers:</strong> Third parties that help us operate our platform (hosting, analytics, email services).</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights.</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Security</h2>
              <p className="text-muted-foreground mb-4">
                We implement appropriate technical and organizational measures to protect your personal data against 
                unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over 
                the Internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Blockchain Data</h2>
              <p className="text-muted-foreground mb-4">
                Please note that transactions on the Solana blockchain are public and permanent. Wallet addresses 
                and transaction details are visible to anyone. We cannot modify or delete blockchain data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Cookies and Tracking</h2>
              <p className="text-muted-foreground mb-4">
                We use cookies and similar tracking technologies to enhance your experience. You can control cookies 
                through your browser settings. Disabling cookies may affect certain features of our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Your Rights</h2>
              <p className="text-muted-foreground mb-4">Depending on your location, you may have the right to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to or restrict processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To exercise these rights, please contact us at privacy@terraintoken.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Children's Privacy</h2>
              <p className="text-muted-foreground mb-4">
                Our services are not intended for individuals under 18 years of age. We do not knowingly collect 
                personal data from children.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to This Policy</h2>
              <p className="text-muted-foreground mb-4">
                We may update this privacy policy from time to time. We will notify you of significant changes by 
                posting a notice on our website or sending you an email.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions about this privacy policy, please contact us at:
              </p>
              <p className="text-muted-foreground">
                Email: privacy@terraintoken.com<br />
                Discord: <a href="https://discord.gg/rM8b6V5Ce" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">discord.gg/rM8b6V5Ce</a>
              </p>
            </section>
          </article>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
