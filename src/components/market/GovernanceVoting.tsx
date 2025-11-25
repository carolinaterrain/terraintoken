import { useState } from "react";
import { Vote, Plus, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { DataBadge } from "./DataBadge";

export const GovernanceVoting = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toast } = useToast();

  const { data: proposals, refetch } = useQuery({
    queryKey: ["governance-proposals"],
    queryFn: async () => {
      const { data } = await supabase
        .from("governance_proposals")
        .select("*")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const handleVote = async (proposalId: string, choice: "for" | "against") => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please enter your wallet address to vote",
        variant: "destructive",
      });
      return;
    }

    // Mock voting power based on wallet (in production, fetch from blockchain)
    const votingPower = 10000;

    const { error } = await supabase.from("governance_votes").insert({
      proposal_id: proposalId,
      voter_wallet: walletAddress,
      vote_choice: choice,
      voting_power: votingPower,
    });

    if (error) {
      if (error.message.includes("duplicate")) {
        toast({
          title: "Already Voted",
          description: "You have already voted on this proposal",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit vote",
          variant: "destructive",
        });
      }
      return;
    }

    // Update proposal vote counts
    const { data: proposal } = await supabase
      .from("governance_proposals")
      .select("*")
      .eq("id", proposalId)
      .maybeSingle();

    if (proposal) {
      await supabase
        .from("governance_proposals")
        .update({
          votes_for: choice === "for" ? proposal.votes_for + 1 : proposal.votes_for,
          votes_against: choice === "against" ? proposal.votes_against + 1 : proposal.votes_against,
          total_voting_power: proposal.total_voting_power + votingPower,
        })
        .eq("id", proposalId);
    }

    toast({
      title: "Vote Submitted! 🗳️",
      description: `Your vote has been recorded`,
    });

    refetch();
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-terrain-purple/60">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Vote className="w-5 h-5 text-terrain-purple" />
            Governance Proposals
          </h3>
          <DataBadge type={proposals && proposals.length > 0 ? "live" : "coming-soon"} />
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-terrain-purple">
              <Plus className="w-4 h-4 mr-1" />
              New Proposal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Governance Proposal</DialogTitle>
            </DialogHeader>
            <CreateProposalForm onSuccess={() => { setShowCreateModal(false); refetch(); }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Your wallet address (to vote)"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="bg-terrain-shadow border-border"
        />
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {!proposals || proposals.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No active proposals. Create the first one!
          </p>
        ) : (
          proposals.map((proposal: any) => {
            const totalVotes = proposal.votes_for + proposal.votes_against;
            const forPercentage = totalVotes > 0 ? (proposal.votes_for / totalVotes) * 100 : 0;
            const isActive = proposal.status === "active" && new Date(proposal.end_date) > new Date();

            return (
              <div
                key={proposal.id}
                className="p-4 bg-terrain-shadow rounded-lg border border-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{proposal.title}</h4>
                    <p className="text-xs text-muted-foreground">{proposal.category}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      isActive
                        ? "bg-goblin-green/20 text-goblin-green"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {proposal.status}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{proposal.description}</p>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-goblin-green">For: {proposal.votes_for}</span>
                    <span className="text-destructive">Against: {proposal.votes_against}</span>
                  </div>
                  <Progress value={forPercentage} className="h-2" />
                </div>

                {isActive && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-goblin-green text-goblin-green hover:bg-goblin-green/10"
                      onClick={() => handleVote(proposal.id, "for")}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Vote For
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                      onClick={() => handleVote(proposal.id, "against")}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Vote Against
                    </Button>
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Ends: {new Date(proposal.end_date).toLocaleDateString()}
                </p>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

const CreateProposalForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("feature");
  const [walletAddress, setWalletAddress] = useState("");
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!title || !description || !walletAddress) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // 7 days from now

    const { error } = await supabase.from("governance_proposals").insert({
      title,
      description,
      category,
      created_by_wallet: walletAddress,
      end_date: endDate.toISOString(),
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create proposal",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Proposal Created! 📜",
      description: "Your governance proposal is now live",
    });

    onSuccess();
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Proposal title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        placeholder="Detailed description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full px-3 py-2 bg-terrain-shadow border border-border rounded-md text-foreground"
      >
        <option value="feature">Feature Request</option>
        <option value="tokenomics">Tokenomics Change</option>
        <option value="partnership">Partnership Proposal</option>
        <option value="other">Other</option>
      </select>
      <Input
        placeholder="Your wallet address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
      />
      <Button onClick={handleCreate} className="w-full bg-terrain-purple">
        Create Proposal
      </Button>
    </div>
  );
};
