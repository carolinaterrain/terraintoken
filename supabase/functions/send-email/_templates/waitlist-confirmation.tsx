import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface WaitlistConfirmationEmailProps {
  referral_code: string;
  position: number;
  site_url: string;
}

export const WaitlistConfirmationEmail = ({
  referral_code,
  position,
  site_url,
}: WaitlistConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to the TerrainScape Waitlist! 🎮</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>You're on the List! 🎉</Heading>
        <Text style={text}>
          Welcome to the TerrainScape waitlist! You're #{position.toLocaleString()} in line to experience the world's first educational play-to-earn MMO.
        </Text>
        
        <Section style={codeBox}>
          <Text style={codeLabel}>Your Referral Code:</Text>
          <Text style={code}>{referral_code}</Text>
        </Section>

        <Text style={text}>
          <strong>Move up the waitlist faster:</strong> Share your referral code! For every 5 friends who join using your code, you'll skip 100 spots in line.
        </Text>

        <Link
          href={`${site_url}/?ref=${referral_code}`}
          target="_blank"
          style={button}
        >
          Share Your Referral Link
        </Link>

        <Text style={text}>
          <strong>TRN Holders get Priority Access!</strong> Connect your wallet to move to the front of the line and receive a 500 TRN bonus when TerrainScape launches.
        </Text>

        <Text style={footer}>
          <Link
            href={site_url}
            target="_blank"
            style={{ ...link, color: '#898989' }}
          >
            Terrain Token (TRN)
          </Link>
          {' '}- The meme coin with real-world utility
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WaitlistConfirmationEmail;

const main = {
  backgroundColor: '#0f0f0f',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const h1 = {
  color: '#22c55e',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#e5e5e5',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const codeBox = {
  backgroundColor: '#1a1a1a',
  borderRadius: '8px',
  border: '1px solid #22c55e',
  padding: '24px',
  margin: '32px 0',
  textAlign: 'center' as const,
};

const codeLabel = {
  color: '#a3a3a3',
  fontSize: '14px',
  margin: '0 0 8px 0',
};

const code = {
  color: '#22c55e',
  fontSize: '28px',
  fontWeight: 'bold',
  letterSpacing: '2px',
  margin: '0',
};

const button = {
  backgroundColor: '#22c55e',
  borderRadius: '8px',
  color: '#0f0f0f',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '16px 32px',
  margin: '24px 0',
};

const link = {
  color: '#22c55e',
  textDecoration: 'underline',
};

const footer = {
  color: '#898989',
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '48px',
  textAlign: 'center' as const,
};
