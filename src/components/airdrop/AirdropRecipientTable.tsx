import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Search, ExternalLink } from "lucide-react";
import type { AirdropRecipient } from "@/hooks/useAirdropRecipients";

interface AirdropRecipientTableProps {
  recipients: AirdropRecipient[];
  title: string;
  showFilterReason?: boolean;
}

export function AirdropRecipientTable({ 
  recipients, 
  title, 
  showFilterReason = false 
}: AirdropRecipientTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const filtered = recipients.filter(r => 
    r.address.toLowerCase().includes(search.toLowerCase())
  );

  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const truncateAddress = (addr: string) => 
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <Badge variant="outline" className="text-xs">
          {filtered.length} addresses
        </Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by address..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="pl-9 bg-background/50"
        />
      </div>

      <div className="border rounded-lg overflow-hidden bg-card/30">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Wallet Address</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">%</TableHead>
              <TableHead className="text-center">Status</TableHead>
              {showFilterReason && <TableHead>Reason</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((recipient, idx) => (
              <TableRow key={recipient.address} className="hover:bg-muted/20">
                <TableCell className="text-muted-foreground text-xs">
                  {page * pageSize + idx + 1}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  <a
                    href={`https://solscan.io/account/${recipient.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    {truncateAddress(recipient.address)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {formatNumber(recipient.quantity)}
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {recipient.percentage.toFixed(2)}%
                </TableCell>
                <TableCell className="text-center">
                  {recipient.isSafe ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 mx-auto" />
                  )}
                </TableCell>
                {showFilterReason && (
                  <TableCell className="text-xs text-red-400">
                    {recipient.filterReason}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
