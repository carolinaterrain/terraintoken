import { motion } from 'framer-motion';
import { Shield, Lock, Clock, Wallet, ExternalLink, CheckCircle2, Ban, AlertTriangle, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { differenceInDays, format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Correct TRN token address (from pump.fun)
const TRN_MINT_ADDRESS = "2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump";
const TRN_TREASURY_WALLET = "H3WwWaX1Afj2kpCsCsawZqxk5CHpXDHz9FzLgZmyPecu";

// Constraint verification status
type VerificationStatus = 'verified' | 'unverified' | 'loading' | 'error';

interface OnChainConstraints {
  mintAuthority: {
    status: 'revoked' | 'active' | 'unknown';
    verifiedAt: Date | null;
    proofUrl: string;
  };
  freezeAuthority: {
    status: 'revoked' | 'active' | 'unknown';
    verifiedAt: Date | null;
  };
  supply: {
    current: number;
    decimals: number;
  };
  lpLock: {
    isLocked: boolean;
    lockedUntil: Date | null;
    platform: string;
    verificationStatus: VerificationStatus;
  };
  treasuryRules: {
    monthlySpendCapPercent: number;
    multisigRequired: boolean;
    verificationStatus: VerificationStatus;
  };
}

// Fetch on-chain constraint data
async function fetchConstraintData(): Promise<OnChainConstraints> {
  try {
    const { data, error } = await supabase.functions.invoke('verify-token-constraints', {
      body: { tokenMint: TRN_MINT_ADDRESS }
    });
    
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Failed to fetch constraint data:', err);
    // Return default unverified state
    return {
      mintAuthority: {
        status: 'unknown',
        verifiedAt: null,
        proofUrl: `https://solscan.io/token/${TRN_MINT_ADDRESS}#metadata`
      },
      freezeAuthority: {
        status: 'unknown',
        verifiedAt: null
      },
      supply: {
        current: 0,
        decimals: 6
      },
      lpLock: {
        isLocked: false,
        lockedUntil: null,
        platform: 'Unknown',
        verificationStatus: 'unverified'
      },
      treasuryRules: {
        monthlySpendCapPercent: 5,
        multisigRequired: false,
        verificationStatus: 'unverified'
      }
    };
  }
}

interface ConstraintCardProps {
  icon: React.ReactNode;
  title: string;
  status: 'verified' | 'locked' | 'revoked' | 'active' | 'unverified';
  statusLabel: string;
  details: React.ReactNode;
  proofUrl: string;
  index: number;
  verificationStatus: VerificationStatus;
}

function ConstraintCard({ icon, title, status, statusLabel, details, proofUrl, index, verificationStatus }: ConstraintCardProps) {
  const statusColors = {
    verified: 'bg-green-500/20 text-green-400 border-green-500/30',
    locked: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    revoked: 'bg-green-500/20 text-green-400 border-green-500/30',
    active: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    unverified: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  };

  const StatusIcon = () => {
    if (verificationStatus === 'loading') return <Loader2 className="w-3 h-3 mr-1 animate-spin" />;
    if (verificationStatus === 'error' || verificationStatus === 'unverified') return <AlertTriangle className="w-3 h-3 mr-1" />;
    if (status === 'revoked') return <Ban className="w-3 h-3 mr-1" />;
    return <CheckCircle2 className="w-3 h-3 mr-1" />;
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
              <Badge className={`mt-1 ${statusColors[verificationStatus === 'unverified' ? 'unverified' : status]}`}>
                <StatusIcon />
                {verificationStatus === 'unverified' ? 'UNVERIFIED' : statusLabel}
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
  const { data: constraints, isLoading, error } = useQuery({
    queryKey: ['token-constraints', TRN_MINT_ADDRESS],
    queryFn: fetchConstraintData,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });

  const now = new Date();

  // Default values with proper verification status
  const lpLockDate = constraints?.lpLock?.lockedUntil ? new Date(constraints.lpLock.lockedUntil) : null;
  const lpDaysRemaining = lpLockDate ? differenceInDays(lpLockDate, now) : 0;
  
  // Team vesting - these are planned but not yet on-chain
  const teamVestingStart = new Date('2024-11-01');
  const teamVestingEnd = new Date('2026-11-01');
  const vestingDaysRemaining = differenceInDays(teamVestingEnd, now);
  const vestingProgress = Math.min(100, Math.max(0, 
    ((now.getTime() - teamVestingStart.getTime()) / 
    (teamVestingEnd.getTime() - teamVestingStart.getTime())) * 100
  ));

  const getVerificationStatus = (field: string): VerificationStatus => {
    if (isLoading) return 'loading';
    if (error) return 'error';
    if (!constraints) return 'unverified';
    
    switch (field) {
      case 'mintAuthority':
        return constraints.mintAuthority.status !== 'unknown' ? 'verified' : 'unverified';
      case 'lpLock':
        return constraints.lpLock.verificationStatus;
      case 'treasuryRules':
        return constraints.treasuryRules.verificationStatus;
      default:
        return 'unverified';
    }
  };

  const constraintCards = [
    {
      icon: <Lock className="w-5 h-5" />,
      title: 'LP Lock Status',
      status: constraints?.lpLock?.isLocked ? 'locked' as const : 'active' as const,
      statusLabel: lpLockDate ? `Locked ${lpDaysRemaining}+ days` : 'Status Pending',
      verificationStatus: getVerificationStatus('lpLock'),
      details: (
        <>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className={`font-medium ${constraints?.lpLock?.isLocked ? 'text-green-400' : 'text-yellow-400'}`}>
              {constraints?.lpLock?.isLocked ? 'LOCKED' : 'UNVERIFIED'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Platform:</span>
            <span className="font-medium text-foreground">{constraints?.lpLock?.platform || 'Raydium'}</span>
          </div>
          {lpLockDate && (
            <div className="flex justify-between">
              <span>Unlocks:</span>
              <span className="font-medium text-foreground">{format(lpLockDate, 'MMM d, yyyy')}</span>
            </div>
          )}
          <p className="text-xs mt-2 text-muted-foreground/70">
            {constraints?.lpLock?.isLocked 
              ? 'LP tokens cannot be withdrawn until unlock date.'
              : 'LP lock status requires manual verification on Solscan.'}
          </p>
        </>
      ),
      proofUrl: `https://solscan.io/account/${TRN_TREASURY_WALLET}`
    },
    {
      icon: <Ban className="w-5 h-5" />,
      title: 'Mint Authority',
      status: constraints?.mintAuthority?.status === 'revoked' ? 'revoked' as const : 'active' as const,
      statusLabel: constraints?.mintAuthority?.status === 'revoked' ? 'Permanently Revoked' : 'Check On-Chain',
      verificationStatus: getVerificationStatus('mintAuthority'),
      details: (
        <>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className={`font-medium ${constraints?.mintAuthority?.status === 'revoked' ? 'text-green-400' : 'text-yellow-400'}`}>
              {constraints?.mintAuthority?.status === 'revoked' ? 'REVOKED' : 'VERIFY ON-CHAIN'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Token:</span>
            <span className="font-medium text-foreground font-mono text-xs">{TRN_MINT_ADDRESS.slice(0, 8)}...</span>
          </div>
          {constraints?.mintAuthority?.verifiedAt && (
            <div className="flex justify-between">
              <span>Verified:</span>
              <span className="font-medium text-foreground">
                {format(new Date(constraints.mintAuthority.verifiedAt), 'MMM d, yyyy h:mm a')}
              </span>
            </div>
          )}
          <p className="text-xs mt-2 text-muted-foreground/70">
            {constraints?.mintAuthority?.status === 'revoked'
              ? 'No new tokens can ever be minted. Supply is permanently fixed.'
              : 'Click "Verify On-Chain" to check mint authority status on Solscan.'}
          </p>
        </>
      ),
      proofUrl: `https://solscan.io/token/${TRN_MINT_ADDRESS}#metadata`
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Team Vesting',
      status: 'active' as const,
      statusLabel: `${vestingDaysRemaining} days remaining`,
      verificationStatus: 'unverified' as VerificationStatus, // Team vesting is off-chain currently
      details: (
        <>
          <div className="flex justify-between">
            <span>Team Allocation:</span>
            <span className="font-medium text-foreground">10%</span>
          </div>
          <div className="flex justify-between">
            <span>Vesting Period:</span>
            <span className="font-medium text-foreground">24 months</span>
          </div>
          <div className="flex justify-between">
            <span>Monthly Unlock:</span>
            <span className="font-medium text-foreground">4.17%</span>
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
          <p className="text-xs mt-2 text-yellow-400/80">
            ⚠️ Team vesting is currently off-chain. On-chain vesting contract planned.
          </p>
        </>
      ),
      proofUrl: `https://solscan.io/account/${TRN_TREASURY_WALLET}`
    },
    {
      icon: <Wallet className="w-5 h-5" />,
      title: 'Treasury Rules',
      status: 'active' as const,
      statusLabel: 'Database Enforced',
      verificationStatus: getVerificationStatus('treasuryRules'),
      details: (
        <>
          <div className="flex justify-between">
            <span>Monthly Spend Cap:</span>
            <span className="font-medium text-foreground">{constraints?.treasuryRules?.monthlySpendCapPercent || 5}% max</span>
          </div>
          <div className="flex justify-between">
            <span>Burn Mechanism:</span>
            <span className="font-medium text-foreground">Usage-driven</span>
          </div>
          <div className="flex justify-between">
            <span>Multisig:</span>
            <span className="font-medium text-foreground">
              {constraints?.treasuryRules?.multisigRequired ? 'Required' : 'Not Yet Implemented'}
            </span>
          </div>
          <p className="text-xs mt-2 text-yellow-400/80">
            ⚠️ Treasury rules are database-enforced, not smart-contract enforced.
          </p>
        </>
      ),
      proofUrl: `https://solscan.io/account/${TRN_TREASURY_WALLET}`
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
            Click any card to verify independently on Solscan. Items marked 
            <Badge className="mx-1 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              <AlertTriangle className="w-3 h-3 mr-1" />UNVERIFIED
            </Badge>
            require manual on-chain verification.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {constraintCards.map((constraint, index) => (
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
          className="mt-8 text-center space-y-2"
        >
          <p className="text-xs text-muted-foreground/60">
            Token: {TRN_MINT_ADDRESS.slice(0, 12)}...{TRN_MINT_ADDRESS.slice(-8)} • 
            Last checked: {format(new Date(), 'MMM d, yyyy h:mm a')}
          </p>
          <p className="text-xs text-yellow-400/80">
            ⚠️ Some constraints are database-enforced, not smart-contract enforced. Always verify on-chain.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
