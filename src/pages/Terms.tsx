import { Helmet } from "react-helmet-async";
import BackToHome from "@/components/BackToHome";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Terrain Token</title>
        <meta name="description" content="Terms of Service for Terrain Token - Please read these terms carefully before using our services." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <BackToHome />
          
          <article className="max-w-4xl mx-auto py-12 prose prose-invert">
            <h1 className="text-4xl font-bold font-display text-foreground mb-8">Terms of Service</h1>
            <p className="text-muted-foreground mb-4">Last Updated: December 13, 2025</p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing or using the Terrain Token website and services, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Services</h2>
              <p className="text-muted-foreground mb-4">
                Terrain Token (TRN) is a utility token on the Solana blockchain. Our platform provides:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Access to TerrainVision AI analysis tools</li>
                <li>Participation in the terrain data contribution ecosystem</li>
                <li>Governance participation for token holders</li>
                <li>Access to exclusive collector drops and merchandise</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Eligibility</h2>
              <p className="text-muted-foreground mb-4">
                You must be at least 18 years old and legally able to enter into contracts to use our services. 
                By using our services, you represent that you meet these requirements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. TRN Token Nature</h2>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                <p className="text-yellow-400 font-semibold mb-2">⚠️ Important Notice</p>
                <p className="text-muted-foreground">
                  TRN is a utility token. It is NOT an investment, security, or financial instrument. TRN does not 
                  represent equity, ownership, or any promise of profit, appreciation, or yield. The value of TRN 
                  may fluctuate significantly and you could lose your entire purchase.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. User Responsibilities</h2>
              <p className="text-muted-foreground mb-4">You agree to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide accurate information when required</li>
                <li>Maintain the security of your wallet and private keys</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not engage in any fraudulent, abusive, or illegal activities</li>
                <li>Not attempt to manipulate or exploit our systems</li>
                <li>Not use automated systems or bots without authorization</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                All content on our website, including text, graphics, logos, and software, is the property of 
                Terrain Token or its licensors. You may not reproduce, distribute, or create derivative works 
                without our express permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. User-Generated Content</h2>
              <p className="text-muted-foreground mb-4">
                When you submit content (terrain photos, data, memes, etc.), you grant us a non-exclusive, 
                royalty-free license to use, display, and distribute that content in connection with our services. 
                You represent that you have the right to submit such content.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Risk Disclosure</h2>
              <p className="text-muted-foreground mb-4">
                Cryptocurrency and blockchain technologies involve significant risks, including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Price volatility and potential total loss of value</li>
                <li>Regulatory uncertainty</li>
                <li>Technical vulnerabilities and smart contract risks</li>
                <li>Loss of access due to lost private keys</li>
                <li>Market manipulation and liquidity risks</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Please read our full <a href="/risk-disclosure" className="text-primary hover:underline">Risk Disclosure</a> for more information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, TERRAIN TOKEN AND ITS AFFILIATES SHALL NOT BE LIABLE FOR 
                ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, 
                DATA, OR OTHER INTANGIBLE LOSSES, REGARDLESS OF THE CAUSE OF ACTION.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground mb-4">
                OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR 
                IMPLIED. WE DO NOT WARRANT THAT OUR SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Indemnification</h2>
              <p className="text-muted-foreground mb-4">
                You agree to indemnify and hold harmless Terrain Token and its affiliates from any claims, damages, 
                or expenses arising from your use of our services or violation of these terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">12. Termination</h2>
              <p className="text-muted-foreground mb-4">
                We reserve the right to suspend or terminate your access to our services at any time for any reason, 
                including violation of these terms. Upon termination, your right to use our services ceases immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">13. Governing Law</h2>
              <p className="text-muted-foreground mb-4">
                These terms shall be governed by and construed in accordance with the laws of the State of North Carolina, 
                United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">14. Changes to Terms</h2>
              <p className="text-muted-foreground mb-4">
                We may modify these terms at any time. Continued use of our services after changes constitutes 
                acceptance of the modified terms. We will notify you of material changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">15. Contact</h2>
              <p className="text-muted-foreground mb-4">
                For questions about these terms, please contact us at:
              </p>
              <p className="text-muted-foreground">
                Email: legal@terraintoken.com<br />
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

export default Terms;
