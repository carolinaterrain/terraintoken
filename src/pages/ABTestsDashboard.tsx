import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { FlaskConical, Trophy, TrendingUp, Eye } from "lucide-react";
import { toast } from "sonner";
import SmartHeader from "@/components/SmartHeader";
import Footer from "@/components/Footer";

const ABTestsDashboard = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Fetch all A/B tests
  const { data: tests, refetch } = useQuery({
    queryKey: ['ab-tests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ab_tests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Fetch test results
  const { data: results } = useQuery({
    queryKey: ['ab-test-results'],
    queryFn: async () => {
      const testResults = [];

      for (const test of tests || []) {
        const variants = Object.keys(test.variants as Record<string, string>);
        const variantStats = [];

        for (const variant of variants) {
          const { count: views } = await supabase
            .from('ab_test_events')
            .select('*', { count: 'exact', head: true })
            .eq('test_id', test.id)
            .eq('variant', variant)
            .eq('event_type', 'view');

          const { count: clicks } = await supabase
            .from('ab_test_events')
            .select('*', { count: 'exact', head: true })
            .eq('test_id', test.id)
            .eq('variant', variant)
            .eq('event_type', 'click');

          const { count: conversions } = await supabase
            .from('ab_test_events')
            .select('*', { count: 'exact', head: true })
            .eq('test_id', test.id)
            .eq('variant', variant)
            .eq('event_type', 'conversion');

          variantStats.push({
            variant,
            views: views || 0,
            clicks: clicks || 0,
            conversions: conversions || 0,
            ctr: views ? ((clicks || 0) / views * 100).toFixed(2) : '0.00',
            conversionRate: views ? ((conversions || 0) / views * 100).toFixed(2) : '0.00'
          });
        }

        testResults.push({
          testId: test.id,
          testName: test.name,
          status: test.status,
          variants: variantStats
        });
      }

      return testResults;
    },
    enabled: !!tests?.length
  });

  const createTest = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const variants = {
      A: String(formData.get('variantA')),
      B: String(formData.get('variantB'))
    };

    const { error } = await supabase
      .from('ab_tests')
      .insert([{
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        variants: variants as any,
        traffic_split: { A: 50, B: 50 } as any,
        status: 'draft'
      }]);

    if (error) {
      toast.error("Failed to create test");
    } else {
      toast.success("Test created!");
      setIsCreateOpen(false);
      refetch();
      form.reset();
    }
  };

  const activateTest = async (id: string) => {
    const { error } = await supabase
      .from('ab_tests')
      .update({ 
        status: 'active',
        start_date: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      toast.error("Failed to activate");
    } else {
      toast.success("Test activated!");
      refetch();
    }
  };

  const pauseTest = async (id: string) => {
    const { error } = await supabase
      .from('ab_tests')
      .update({ status: 'paused' })
      .eq('id', id);

    if (error) {
      toast.error("Failed to pause");
    } else {
      toast.success("Test paused!");
      refetch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SmartHeader />
      
      <main className="container mx-auto px-4 py-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">A/B Testing Dashboard</h1>
            <p className="text-muted-foreground">Optimize conversion through experiments</p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <FlaskConical className="w-4 h-4 mr-2" />
                Create Test
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New A/B Test</DialogTitle>
              </DialogHeader>
              <form onSubmit={createTest} className="space-y-4">
                <div>
                  <Label htmlFor="name">Test Name</Label>
                  <Input id="name" name="name" placeholder="waitlist_cta_text" required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" name="description" placeholder="Test different CTA copy" />
                </div>
                <div>
                  <Label htmlFor="variantA">Variant A (Control)</Label>
                  <Input id="variantA" name="variantA" placeholder="Join the Waitlist" required />
                </div>
                <div>
                  <Label htmlFor="variantB">Variant B</Label>
                  <Input id="variantB" name="variantB" placeholder="Get Early Access" required />
                </div>
                <Button type="submit" className="w-full">Create Test</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {tests?.map((test) => {
            const testResults = results?.find(r => r.testId === test.id);
            const winner = testResults?.variants.reduce((prev, current) => 
              parseFloat(current.conversionRate) > parseFloat(prev.conversionRate) ? current : prev
            );

            return (
              <Card key={test.id} className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{test.name}</h3>
                    <p className="text-muted-foreground">{test.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={test.status === 'active' ? 'default' : 'outline'}>
                      {test.status}
                    </Badge>
                    {test.status === 'draft' && (
                      <Button size="sm" onClick={() => activateTest(test.id)}>
                        Activate
                      </Button>
                    )}
                    {test.status === 'active' && (
                      <Button size="sm" variant="outline" onClick={() => pauseTest(test.id)}>
                        Pause
                      </Button>
                    )}
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Variant</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Clicks</TableHead>
                      <TableHead>Conversions</TableHead>
                      <TableHead>CTR</TableHead>
                      <TableHead>Conversion Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testResults?.variants.map((variant) => (
                      <TableRow key={variant.variant}>
                        <TableCell className="font-semibold">
                          Variant {variant.variant}
                          {winner?.variant === variant.variant && (
                            <Trophy className="inline w-4 h-4 ml-2 text-chart-3" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                            {variant.views.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>{variant.clicks.toLocaleString()}</TableCell>
                        <TableCell>{variant.conversions.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{variant.ctr}%</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={winner?.variant === variant.variant ? 'default' : 'outline'}
                            className="font-bold"
                          >
                            {variant.conversionRate}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {winner && testResults && testResults.variants.length > 1 && (
                  <div className="mt-4 p-4 bg-chart-3/10 rounded-lg border border-chart-3/20">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-chart-3" />
                      <span className="font-semibold">
                        Variant {winner.variant} is leading with a {winner.conversionRate}% conversion rate
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}

          {tests?.length === 0 && (
            <Card className="p-12 text-center">
              <FlaskConical className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">No tests yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first A/B test to start optimizing conversions
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                Create Your First Test
              </Button>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ABTestsDashboard;
