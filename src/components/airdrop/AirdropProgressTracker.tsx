import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2, XCircle, Clock } from "lucide-react";

export interface BatchStatus {
  batchIndex: number;
  status: "pending" | "processing" | "success" | "error";
  signature?: string;
  error?: string;
  addresses: string[];
}

interface AirdropProgressTrackerProps {
  batches: BatchStatus[];
  currentBatch: number;
  totalBatches: number;
  isRunning: boolean;
}

export function AirdropProgressTracker({
  batches,
  currentBatch,
  totalBatches,
  isRunning,
}: AirdropProgressTrackerProps) {
  const completedBatches = batches.filter(b => b.status === "success").length;
  const failedBatches = batches.filter(b => b.status === "error").length;
  const progress = totalBatches > 0 ? (completedBatches / totalBatches) * 100 : 0;

  const truncateSig = (sig: string) => `${sig.slice(0, 8)}...${sig.slice(-8)}`;

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Overall Progress</span>
          <span className="font-mono">
            {completedBatches} / {totalBatches} batches
          </span>
        </div>
        <Progress value={progress} className="h-3" />
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1 text-green-500">
            <CheckCircle className="w-3 h-3" /> {completedBatches} completed
          </span>
          {failedBatches > 0 && (
            <span className="flex items-center gap-1 text-red-500">
              <XCircle className="w-3 h-3" /> {failedBatches} failed
            </span>
          )}
          {isRunning && (
            <span className="flex items-center gap-1 text-primary">
              <Loader2 className="w-3 h-3 animate-spin" /> Processing...
            </span>
          )}
        </div>
      </div>

      {/* Batch Details */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {batches.map((batch) => (
          <div
            key={batch.batchIndex}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              batch.status === "success"
                ? "border-green-500/30 bg-green-500/5"
                : batch.status === "error"
                ? "border-red-500/30 bg-red-500/5"
                : batch.status === "processing"
                ? "border-primary/30 bg-primary/5"
                : "border-muted bg-muted/5"
            }`}
          >
            <div className="flex items-center gap-3">
              {batch.status === "pending" && <Clock className="w-4 h-4 text-muted-foreground" />}
              {batch.status === "processing" && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
              {batch.status === "success" && <CheckCircle className="w-4 h-4 text-green-500" />}
              {batch.status === "error" && <XCircle className="w-4 h-4 text-red-500" />}
              
              <div>
                <span className="text-sm font-medium">
                  Batch {batch.batchIndex + 1}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({batch.addresses.length} addresses)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {batch.signature && (
                <a
                  href={`https://solscan.io/tx/${batch.signature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-primary hover:underline"
                >
                  {truncateSig(batch.signature)}
                </a>
              )}
              {batch.error && (
                <Badge variant="destructive" className="text-xs">
                  {batch.error.slice(0, 30)}...
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
