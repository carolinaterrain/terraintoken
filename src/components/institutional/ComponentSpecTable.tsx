import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, ArrowLeft, FileText } from "lucide-react";

interface ComponentSpecTableProps {
  inputs: string[];
  outputs: string[];
  evidence: string[];
  className?: string;
}

export function ComponentSpecTable({ inputs, outputs, evidence, className }: ComponentSpecTableProps) {
  const maxRows = Math.max(inputs.length, outputs.length, evidence.length);
  
  const rows = Array.from({ length: maxRows }, (_, i) => ({
    input: inputs[i] || "",
    output: outputs[i] || "",
    evidence: evidence[i] || ""
  }));

  return (
    <div className={cn("rounded-lg border bg-card overflow-hidden", className)}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-1/3">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                Inputs
              </div>
            </TableHead>
            <TableHead className="w-1/3">
              <div className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 text-primary" />
                Outputs
              </div>
            </TableHead>
            <TableHead className="w-1/3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Evidence
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index} className="hover:bg-muted/50">
              <TableCell className="text-sm text-muted-foreground">{row.input}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{row.output}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{row.evidence}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface CompactSpecListProps {
  title: string;
  items: string[];
  icon: React.ReactNode;
  className?: string;
}

export function CompactSpecList({ title, items, icon, className }: CompactSpecListProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <h4 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
        {icon}
        {title}
      </h4>
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-sm text-foreground/80 pl-6 relative before:content-['•'] before:absolute before:left-2 before:text-primary">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
