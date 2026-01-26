import { CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { TRN_MINT_ADDRESS } from "@/lib/airdropConstants";

const ContractVerificationBadge = () => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2 text-primary hover:text-primary-glow hover:bg-primary/10"
      asChild
    >
      <a
        href={`https://solscan.io/token/${TRN_MINT_ADDRESS}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <CheckCircle className="h-4 w-4" />
        <span className="text-xs font-medium">Verified on Solscan</span>
      </a>
    </Button>
  );
};

export default ContractVerificationBadge;
