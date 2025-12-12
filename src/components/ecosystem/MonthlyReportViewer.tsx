import React from 'react';
import { format } from 'date-fns';
import { 
  FileText, 
  ExternalLink, 
  Check, 
  Clock, 
  Flame, 
  DollarSign,
  Users,
  TrendingUp,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useMonthlyReports, useBurnBands, type MonthlyReport } from '@/hooks/useEcosystemData';
import { PoweredByTerrainVision } from './PoweredByTerrainVision';

interface MonthlyReportViewerProps {
  className?: string;
  limit?: number;
}

export const MonthlyReportViewer: React.FC<MonthlyReportViewerProps> = ({
  className = '',
  limit = 6,
}) => {
  const { data: reports, isLoading: reportsLoading } = useMonthlyReports(limit);
  const { data: bands } = useBurnBands();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  
  const formatNumber = (value: number) =>
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);

  const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;

  const getBandLabel = (bandId: string | null) => {
    if (!bandId || !bands) return 'N/A';
    const band = bands.find(b => b.id === bandId);
    if (!band) return 'N/A';
    return `${formatCurrency(band.min_revenue)}${band.max_revenue ? ` - ${formatCurrency(band.max_revenue)}` : '+'}`;
  };

  const truncateHash = (hash: string | null) => {
    if (!hash) return 'N/A';
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  if (reportsLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(j => (
                  <Skeleton key={j} className="h-16" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">No Reports Yet</h3>
          <p className="text-muted-foreground text-sm">
            Monthly ecosystem reports will appear here once finalized.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Monthly Ecosystem Reports</h2>
        <PoweredByTerrainVision showAnalysisCount={false} />
      </div>

      {reports.map((report) => (
        <ReportCard 
          key={report.id} 
          report={report}
          formatCurrency={formatCurrency}
          formatNumber={formatNumber}
          formatPercent={formatPercent}
          getBandLabel={getBandLabel}
          truncateHash={truncateHash}
        />
      ))}
    </div>
  );
};

interface ReportCardProps {
  report: MonthlyReport;
  formatCurrency: (value: number) => string;
  formatNumber: (value: number) => string;
  formatPercent: (value: number) => string;
  getBandLabel: (bandId: string | null) => string;
  truncateHash: (hash: string | null) => string;
}

const ReportCard: React.FC<ReportCardProps> = ({
  report,
  formatCurrency,
  formatNumber,
  formatPercent,
  getBandLabel,
  truncateHash,
}) => {
  const reportDate = new Date(report.report_month);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {format(reportDate, 'MMMM yyyy')} Report
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Data source: {report.data_source} (verified)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {report.is_finalized ? (
              <Badge variant="default" className="bg-green-600">
                <Check className="h-3 w-3 mr-1" />
                Finalized
              </Badge>
            ) : (
              <Badge variant="secondary">
                <Clock className="h-3 w-3 mr-1" />
                Pending
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <MetricBox
            icon={<DollarSign className="h-4 w-4 text-green-500" />}
            label="Net AI Revenue"
            value={formatCurrency(report.net_ai_revenue)}
          />
          <MetricBox
            icon={<Users className="h-4 w-4 text-blue-500" />}
            label="Verified Analyses"
            value={formatNumber(report.verified_analyses)}
          />
          <MetricBox
            icon={<TrendingUp className="h-4 w-4 text-primary" />}
            label="Burn Rate"
            value={formatPercent(report.final_burn_rate || 0)}
            badge={report.usage_bonus_applied ? '+Bonus' : undefined}
          />
          <MetricBox
            icon={<Flame className="h-4 w-4 text-orange-500" />}
            label="TRN Burned"
            value={report.trn_burned ? formatNumber(report.trn_burned) : 'Pending'}
          />
        </div>

        <Separator className="my-4" />

        {/* Details */}
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium text-muted-foreground">Revenue Breakdown</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Gross AI Revenue</span>
                <span className="font-medium">{formatCurrency(report.gross_ai_revenue)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Variable AI Costs</span>
                <span>-{formatCurrency(report.variable_ai_costs)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Net AI Revenue</span>
                <span className="text-green-600">{formatCurrency(report.net_ai_revenue)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-muted-foreground">Burn Details</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Band</span>
                <span className="font-medium">{getBandLabel(report.determined_band_id)}</span>
              </div>
              <div className="flex justify-between">
                <span>USD for Buyback</span>
                <span className="font-medium">{formatCurrency(report.usd_for_buyback || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Users</span>
                <span className="font-medium">{formatNumber(report.active_users)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Verification */}
        {(report.buyback_tx_hash || report.burn_tx_hash) && (
          <>
            <Separator className="my-4" />
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">On-chain verification:</span>
              {report.buyback_tx_hash && (
                <Button variant="link" size="sm" className="h-auto p-0" asChild>
                  <a
                    href={`https://solscan.io/tx/${report.buyback_tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buyback Tx <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              )}
              {report.burn_tx_hash && (
                <Button variant="link" size="sm" className="h-auto p-0" asChild>
                  <a
                    href={`https://solscan.io/tx/${report.burn_tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Burn Tx <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              )}
            </div>
          </>
        )}

        {report.finalized_at && (
          <p className="text-xs text-muted-foreground mt-4">
            Finalized on {format(new Date(report.finalized_at), 'PPp')}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

interface MetricBoxProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: string;
}

const MetricBox: React.FC<MetricBoxProps> = ({ icon, label, value, badge }) => (
  <div className="bg-muted/30 rounded-lg p-3">
    <div className="flex items-center gap-1.5 mb-1">
      {icon}
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="font-semibold">{value}</span>
      {badge && (
        <Badge variant="secondary" className="text-[10px] px-1.5">
          {badge}
        </Badge>
      )}
    </div>
  </div>
);
