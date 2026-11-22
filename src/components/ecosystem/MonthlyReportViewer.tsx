import React from 'react';
import { format } from 'date-fns';
import { 
  FileText, 
  ExternalLink, 
  Check, 
  Clock, 
  Flame, 
  Users,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useMonthlyReports, type MonthlyReport } from '@/hooks/useEcosystemData';
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
  const formatNumber = (value: number) =>
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);

  if (reportsLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(j => (
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
          formatNumber={formatNumber}
        />
      ))}
    </div>
  );
};

interface ReportCardProps {
  report: MonthlyReport;
  formatNumber: (value: number) => string;
}

const ReportCard: React.FC<ReportCardProps> = ({
  report,
  formatNumber,
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
        {/* Key Metrics Grid — on-chain and usage data only (no business financials) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <MetricBox
            icon={<Users className="h-4 w-4 text-blue-500" />}
            label="Verified Analyses"
            value={formatNumber(report.verified_analyses)}
          />
          <MetricBox
            icon={<Users className="h-4 w-4 text-primary" />}
            label="Active Users"
            value={formatNumber(report.active_users)}
          />
          <MetricBox
            icon={<Flame className="h-4 w-4 text-orange-500" />}
            label="TRN Burned"
            value={report.trn_burned ? formatNumber(report.trn_burned) : 'Pending'}
          />
        </div>

        {/* Transaction Verification */}
        {report.burn_tx_hash && (
          <>
            <Separator className="my-4" />
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">On-chain verification:</span>
              <Button variant="link" size="sm" className="h-auto p-0" asChild>
                <a
                  href={`https://solscan.io/tx/${report.burn_tx_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Burn Tx <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
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
