'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import { FileText, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';

export function ReportGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowPreview(true);
    }, 3000);
  };

  return (
    <>
      <Button onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FileText className="mr-2 h-4 w-4" />
        )}
        Generate AI Report
      </Button>
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl h-[80dvh] flex flex-col glassmorphism">
          <DialogHeader>
            <DialogTitle>Report Preview</DialogTitle>
            <DialogDescription>
              Here is a preview of your AI-generated report.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 rounded-md bg-muted/50 p-4 overflow-y-auto">
            <div className="bg-background p-6 rounded shadow-sm text-sm">
                <h2 className="text-lg font-bold font-headline mb-4 border-b pb-2">Property Performance Report</h2>
                <h3 className="font-semibold mb-2">Property Summary</h3>
                <p className="text-muted-foreground mb-4">This report covers all properties, showing a positive net income for the last period.</p>
                <h3 className="font-semibold mb-2">Key Financials</h3>
                <ul className="list-disc list-inside text-muted-foreground mb-4">
                    <li>Total Income: <span className="font-medium text-foreground">₹24,500</span></li>
                    <li>Total Expenses: <span className="font-medium text-foreground">₹8,500</span></li>
                    <li>Net Profit: <span className="font-medium text-primary">₹16,000</span></li>
                </ul>
                <h3 className="font-semibold mb-2">AI Insights</h3>
                <p className="italic text-muted-foreground">"Expense allocation for maintenance is slightly above average. Consider preventative measures to reduce costs."</p>
                <div className="mt-4 border-t pt-4 text-xs text-muted-foreground text-center">
                    End of Report
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPreview(false)}>Close</Button>
            <Button variant="default">Download PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
