import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  RefreshCw, 
  Wallet,
  Flame,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  useEcosystemHealth, 
  useWebhookInbox, 
  useEcosystemEvents,
  useMonthlyReportPipeline 
} from '@/hooks/useEcosystemHealth';
import { formatDistanceToNow } from 'date-fns';

export default function EcosystemAdmin() {
  const { data: health, isLoading: healthLoading, refetch: refetchHealth } = useEcosystemHealth();
  const { data: webhooks, isLoading: webhooksLoading } = useWebhookInbox(20);
  const { data: events, isLoading: eventsLoading } = useEcosystemEvents(50);
  const { data: reports, isLoading: reportsLoading } = useMonthlyReportPipeline();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchHealth();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <>
      <Helmet>
        <title>Ecosystem Admin | Terrain Token</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Ecosystem Admin</h1>
                <p className="text-muted-foreground">TRN ↔ TerrainVision Integration Dashboard</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Events (1h)</p>
                    <p className="text-2xl font-bold">{health?.events_last_hour ?? '—'}</p>
                  </div>
                  <Activity className="h-8 w-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Webhooks Failed</p>
                    <p className="text-2xl font-bold text-destructive">{health?.webhooks_failed ?? '—'}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-destructive opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">In Flight</p>
                    <p className="text-2xl font-bold">{health?.webhooks_in_flight ?? '—'}</p>
                  </div>
                  <Clock className="h-8 w-8 text-amber-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Reports Finalized</p>
                    <p className="text-2xl font-bold text-primary">{health?.reports_finalized ?? '—'}</p>
                  </div>
                  <FileCheck className="h-8 w-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">TRN Burned</p>
                    <p className="text-2xl font-bold text-orange-500">
                      {health?.total_trn_burned?.toLocaleString() ?? '—'}
                    </p>
                  </div>
                  <Flame className="h-8 w-8 text-orange-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="events" className="space-y-4">
            <TabsList>
              <TabsTrigger value="events">Event Stream</TabsTrigger>
              <TabsTrigger value="webhooks">Webhook Inbox</TabsTrigger>
              <TabsTrigger value="reports">Monthly Reports</TabsTrigger>
              <TabsTrigger value="wallets">Wallets</TabsTrigger>
            </TabsList>

            {/* Event Stream Tab */}
            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Ecosystem Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    {eventsLoading ? (
                      <div className="text-center py-8 text-muted-foreground">Loading...</div>
                    ) : events?.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No events yet</div>
                    ) : (
                      <div className="space-y-2">
                        {events?.map((event) => (
                          <div 
                            key={event.id} 
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <Badge variant={event.source_app === 'terrainvision' ? 'default' : 'secondary'}>
                              {event.source_app}
                            </Badge>
                            <div className="flex-1 min-w-0">
                              <p className="font-mono text-sm truncate">{event.event_type}</p>
                              {event.correlation_id && (
                                <p className="text-xs text-muted-foreground">
                                  Correlation: {event.correlation_id.slice(0, 8)}...
                                </p>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Webhook Inbox Tab */}
            <TabsContent value="webhooks">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
                    Webhook Inbox
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    {webhooksLoading ? (
                      <div className="text-center py-8 text-muted-foreground">Loading...</div>
                    ) : webhooks?.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No webhooks received</div>
                    ) : (
                      <div className="space-y-2">
                        {webhooks?.map((webhook) => (
                          <div 
                            key={webhook.id} 
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                          >
                            {webhook.processed_at ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            ) : webhook.error_message ? (
                              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                            ) : webhook.claimed_at ? (
                              <Clock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                            ) : (
                              <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-mono text-sm truncate">{webhook.event_type}</p>
                              <p className="text-xs text-muted-foreground">
                                From: {webhook.producer} | Key: {webhook.idempotency_key.slice(0, 12)}...
                              </p>
                              {webhook.error_message && (
                                <p className="text-xs text-destructive mt-1">
                                  Error: {webhook.error_message}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(webhook.received_at), { addSuffix: true })}
                              </span>
                              {webhook.retry_count > 0 && (
                                <Badge variant="outline" className="ml-2">
                                  Retry {webhook.retry_count}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Monthly Reports Tab */}
            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5" />
                    Monthly Report Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    {reportsLoading ? (
                      <div className="text-center py-8 text-muted-foreground">Loading...</div>
                    ) : reports?.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No reports yet</div>
                    ) : (
                      <div className="space-y-3">
                        {reports?.map((report: any) => (
                          <div 
                            key={report.id} 
                            className="p-4 rounded-lg border bg-card"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{report.report_month}</h4>
                              <Badge variant={report.is_finalized ? 'default' : 'outline'}>
                                {report.is_finalized ? 'Finalized' : 'Pending'}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Gross Revenue</span>
                                <p className="font-mono">${report.gross_ai_revenue?.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Net Revenue</span>
                                <p className="font-mono">${report.net_ai_revenue?.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Burn Rate</span>
                                <p className="font-mono">{((report.final_burn_rate || 0) * 100).toFixed(1)}%</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">TRN Burned</span>
                                <p className="font-mono text-orange-500">
                                  {report.trn_burned?.toLocaleString() || '—'}
                                </p>
                              </div>
                            </div>
                            {report.burn_tx_hash && (
                              <p className="text-xs text-muted-foreground mt-2 font-mono truncate">
                                Burn TX: {report.burn_tx_hash}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wallets Tab */}
            <TabsContent value="wallets">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Verified Wallets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-12 text-muted-foreground">
                    <div className="text-center">
                      <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>{health?.wallets_verified || 0} wallets verified</p>
                      <p className="text-sm mt-2">
                        Wallet verification ensures cryptographic proof of ownership
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
