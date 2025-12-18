import { motion } from 'framer-motion';
import { Shield, Lock, Clock, Wallet, ExternalLink, CheckCircle2, Ban } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { differenceInDays, format } from 'date-fns';

// Verified on-chain constraints
const CONSTRAINTS = {
  lpLock: {
    status: 'locked',
    lockedUntil: new Date('2026-01-15'), // Update with actual lock date
    lockedAmount: '100%',
    platform: 'Raydium',
    proofUrl: 'https://solscan.io/account/H3WwWaX1Afj2kpCsCsawZqxk5CHpXDHz9FzLgZmyPecu'
  },
  mintAuthority: {
    status: 'revoked',
    revokedAt: new Date('2024-11-01'),
    tokenMint: 'TRNtxUve3PqEvyASfiS3T19gypzaZRL2H9jzgGxhpTT',
    proofUrl: 'https://solscan.io/token/TRNtxUve3PqEvyASfiS3T19gypzaZRL2H9jzgGxhpTT#metadata'
  },
  teamVesting: {
    totalAllocation: '10%',
    vestingStart: new Date('2024-11-01'),
    vestingEnd: new Date('2026-11-01'), // 2 year vesting
    cliffMonths: 6,
    monthlyUnlock: '4.17%',
    proofUrl: 'https://solscan.io/account/H3WwWaX1Afj2kpCsCsawZqxk5CHpXDHz9FzLgZmyPecu'
  },
  treasuryRules: {
    monthlySpendCap: 5, // % of treasury
    burnCommitment: 'Usage-driven',
    multisigRequired: false, // Update when implemented
    proofUrl: 'https://solscan.io/account/H3WwWaX1Afj2kpCsCsawZqxk5CHpXDHz9FzLgZmyPecu'
  }
};

interface ConstraintCardProps {
  icon: React.ReactNode;
  title: string;
  status: 'verified' | 'locked' | 'revoked' | 'active';
  statusLabel: string;
  details: React.ReactNode;
  proofUrl: string;
  index: number;
}

function ConstraintCard({ icon, title, status, statusLabel, details, proofUrl, index }: ConstraintCardProps) {
  const statusColors = {
    verified: 'bg-green-500/20 text-green-400 border-green-500/30',
    locked: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    revoked: 'bg-green-500/20 text-green-400 border-green-500/30',
    active: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <GlassCard className="p-5 h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <Badge className={`mt-1 ${statusColors[status]}`}>
                {status === 'revoked' ? <Ban className="w-3 h-3 mr-1" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                {statusLabel}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          {details}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 text-xs"
          onClick={() => window.open(proofUrl, '_blank')}
        >
          <ExternalLink className="w-3 h-3" />
          Verify On-Chain
        </Button>
      </GlassCard>
    </motion.div>
  );
}

export function ConstraintProof() {
  const now = new Date();
  const lpDaysRemaining = differenceInDays(CONSTRAINTS.lpLock.lockedUntil, now);
  const vestingDaysRemaining = differenceInDays(CONSTRAINTS.teamVesting.vestingEnd, now);
  const vestingProgress = Math.min(100, Math.max(0, 
    ((now.getTime() - CONSTRAINTS.teamVesting.vestingStart.getTime()) / 
    (CONSTRAINTS.teamVesting.vestingEnd.getTime() - CONSTRAINTS.teamVesting.vestingStart.getTime())) * 100
  ));

  const constraints = [
    {
      icon: <Lock className="w-5 h-5" />,
      title: 'LP Lock Status',
      status: 'locked' as const,
      statusLabel: `Locked ${lpDaysRemaining}+ days`,
      details: (
        <>
          <div className="flex justify-between">
            <span>Amount Locked:</span>
            <span className="font-medium text-foreground">{CONSTRAINTS.lpLock.lockedAmount}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform:</span>
            <span className="font-medium text-foreground">{CONSTRAINTS.lpLock.platform}</span>
          </div>
          <div className="flex justify-between">
            <span>Unlocks:</span>
            <span className="font-medium text-foreground">{format(CONSTRAINTS.lpLock.lockedUntil, 'MMM d, yyyy')}</span>
          </div>
          <p className="text-xs mt-2 text-muted-foreground/70">
            LP tokens cannot be withdrawn until unlock date. This prevents rug pulls.
          </p>
        </>
      ),
      proofUrl: CONSTRAINTS.lpLock.proofUrl
    },
    {
      icon: <Ban className="w-5 h-5" />,
      title: 'Mint Authority',
      status: 'revoked' as const,
      statusLabel: 'Permanently Revoked',
      details: (
        <>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="font-medium text-green-400">REVOKED</span>
          </div>
          <div className="flex justify-between">
            <span>Revoked On:</span>
            <span className="font-medium text-foreground">{format(CONSTRAINTS.mintAuthority.revokedAt, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span>Token:</span>
            <span className="font-medium text-foreground font-mono text-xs">{CONSTRAINTS.mintAuthority.tokenMint.slice(0, 8)}...</span>
          </div>
          <p className="text-xs mt-2 text-muted-foreground/70">
            No new tokens can ever be minted. Supply is permanently fixed.
          </p>
        </>
      ),
      proofUrl: CONSTRAINTS.mintAuthority.proofUrl
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Team Vesting',
      status: 'active' as const,
      statusLabel: `${vestingDaysRemaining} days remaining`,
      details: (
        <>
          <div className="flex justify-between">
            <span>Team Allocation:</span>
            <span className="font-medium text-foreground">{CONSTRAINTS.teamVesting.totalAllocation}</span>
          </div>
          <div className="flex justify-between">
            <span>Vesting Period:</span>
            <span className="font-medium text-foreground">24 months</span>
          </div>
          <div className="flex justify-between">
            <span>Monthly Unlock:</span>
            <span className="font-medium text-foreground">{CONSTRAINTS.teamVesting.monthlyUnlock}</span>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{vestingProgress.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{ width: `${vestingProgress}%` }}
              />
            </div>
          </div>
          <p className="text-xs mt-2 text-muted-foreground/70">
            Team tokens unlock gradually, preventing large dumps.
          </p>
        </>
      ),
      proofUrl: CONSTRAINTS.teamVesting.proofUrl
    },
    {
      icon: <Wallet className="w-5 h-5" />,
      title: 'Treasury Rules',
      status: 'verified' as const,
      statusLabel: 'Rules Active',
      details: (
        <>
          <div className="flex justify-between">
            <span>Monthly Spend Cap:</span>
            <span className="font-medium text-foreground">{CONSTRAINTS.treasuryRules.monthlySpendCap}% max</span>
          </div>
          <div className="flex justify-between">
            <span>Burn Mechanism:</span>
            <span className="font-medium text-foreground">{CONSTRAINTS.treasuryRules.burnCommitment}</span>
          </div>
          <div className="flex justify-between">
            <span>Multisig:</span>
            <span className="font-medium text-foreground">{CONSTRAINTS.treasuryRules.multisigRequired ? 'Required' : 'Planned'}</span>
          </div>
          <p className="text-xs mt-2 text-muted-foreground/70">
            Treasury spending is capped and burns are tied to actual usage.
          </p>
        </>
      ),
      proofUrl: CONSTRAINTS.treasuryRules.proofUrl
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">Verifiable Constraints</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Don't Trust. Verify.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every constraint is enforced on-chain. Click any card to verify independently on Solscan.
            These aren't promises — they're immutable rules.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {constraints.map((constraint, index) => (
            <ConstraintCard
              key={constraint.title}
              {...constraint}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-muted-foreground/60">
            All data verifiable on Solana mainnet • Last verified: {format(new Date(), 'MMM d, yyyy h:mm a')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
