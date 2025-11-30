import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Table } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { monthlyRevenue, balanceSheet, equipmentInventory, calculateMetrics } from "@/lib/financialData";
import { toast } from "sonner";

export const DownloadReports = () => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const metrics = calculateMetrics();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(66, 135, 245);
    doc.text("Carolina Terrain", 105, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Financial Transparency Report", 105, 30, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 37, { align: "center" });
    doc.text("2022 - 2025", 105, 42, { align: "center" });

    // Key Metrics
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Key Financial Metrics", 14, 55);
    
    autoTable(doc, {
      startY: 60,
      head: [['Metric', 'Value']],
      body: [
        ['Total Revenue', `$${metrics.totalRevenue.toLocaleString()}`],
        ['Total Net Income', `$${metrics.totalNetIncome.toLocaleString()}`],
        ['Avg Monthly Revenue', `$${metrics.avgMonthlyRevenue.toLocaleString()}`],
        ['Net Profit Margin', `${metrics.netProfitMargin.toFixed(1)}%`],
        ['2024 Revenue', `$${metrics.revenue2024.toLocaleString()}`],
        ['2025 Revenue (YTD)', `$${metrics.revenue2025YTD.toLocaleString()}`],
        ['Growth Rate', `${metrics.growthRate.toFixed(1)}%`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [66, 135, 245] },
    });

    // Balance Sheet
    doc.addPage();
    doc.setFontSize(14);
    doc.text("Balance Sheet Snapshot", 14, 20);
    
    autoTable(doc, {
      startY: 25,
      head: [['Account', 'Amount']],
      body: [
        ['Total Assets', `$${balanceSheet.totalAssets.toLocaleString()}`],
        ['Current Assets', `$${balanceSheet.currentAssets.toLocaleString()}`],
        ['Fixed Assets', `$${balanceSheet.fixedAssets.toLocaleString()}`],
        ['Total Liabilities', `$${balanceSheet.totalLiabilities.toLocaleString()}`],
        ['Equity', `$${balanceSheet.equity.toLocaleString()}`],
        ['Cash Balance', `$${balanceSheet.cashBalance.toLocaleString()}`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [66, 135, 245] },
    });

    // Equipment Inventory
    const previousY = (doc as any).lastAutoTable?.finalY || 100;
    doc.setFontSize(14);
    doc.text("Equipment Inventory", 14, previousY + 15);
    
    autoTable(doc, {
      startY: previousY + 20,
      head: [['Equipment', 'Purchase Price', 'Year']],
      body: equipmentInventory.map(eq => [
        eq.name,
        `$${eq.purchasePrice.toLocaleString()}`,
        eq.purchaseDate
      ]),
      theme: 'striped',
      headStyles: { fillColor: [66, 135, 245] },
    });

    // Disclaimer
    doc.addPage();
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Important Disclosure", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    const disclaimer = "TRN is a community-driven meme token inspired by the real-world work we do every day at Carolina Terrain. It is not tied to company equity, profits, or revenue. The operational data shown above demonstrates the legitimacy and real-world foundation behind the TRN community, but TRN tokens themselves do not represent ownership, investment returns, or financial claims of any kind.";
    
    const splitDisclaimer = doc.splitTextToSize(disclaimer, 180);
    doc.text(splitDisclaimer, 14, 30);

    doc.setFontSize(8);
    doc.text("Financials sourced from QuickBooks accounting records", 14, 60);
    doc.text("For verification inquiries, contact Carolina Terrain", 14, 65);

    // Save
    doc.save("Carolina_Terrain_Financial_Report.pdf");
    toast.success("Financial report downloaded successfully!");
  };

  const downloadCSV = () => {
    const csvContent = [
      ["Month", "Revenue", "Expenses", "Net Income"],
      ...monthlyRevenue.map(m => [
        m.month,
        m.revenue.toFixed(2),
        m.expenses.toFixed(2),
        m.netIncome.toFixed(2)
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Carolina_Terrain_Monthly_Data.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("CSV data exported successfully!");
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <h3 className="font-display text-2xl font-bold mb-4">Download Financial Reports</h3>
      <p className="text-muted-foreground mb-6">
        Access complete financial transparency data in multiple formats
      </p>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Button 
          onClick={generatePDF}
          className="h-auto py-4 flex-col items-start gap-2"
          variant="outline"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <span className="font-semibold">Full Transparency Report</span>
          </div>
          <span className="text-xs text-muted-foreground">
            PDF with all metrics, balance sheet, and equipment inventory
          </span>
        </Button>

        <Button 
          onClick={downloadCSV}
          className="h-auto py-4 flex-col items-start gap-2"
          variant="outline"
        >
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5" />
            <span className="font-semibold">Raw Monthly Data</span>
          </div>
          <span className="text-xs text-muted-foreground">
            CSV export for your own analysis
          </span>
        </Button>
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-muted">
        <div className="flex items-start gap-2">
          <Download className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">Data Accuracy Statement</p>
            <p>All financial data sourced from QuickBooks accounting records. Last updated: November 2025.</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
