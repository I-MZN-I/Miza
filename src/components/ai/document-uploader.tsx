'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Upload, CheckCircle, Clock, Loader2, File, AlertTriangle } from 'lucide-react';
import { Progress } from '../ui/progress';

type DocumentUploaderProps = {
  title: string;
  description: string;
  feature: 'lease' | 'expense';
};

const mockLeaseData = {
  'Tenant Name': 'Alice Johnson',
  'Rent Amount': '₹2,500',
  'Lease Duration': '12 months',
  'Renewal Date': '2024-12-31',
};

const mockExpenseData = {
  Category: 'Maintenance',
  'Confidence': '92%',
};

export function DocumentUploader({
  title,
  description,
  feature,
}: DocumentUploaderProps) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');

  const handleFileSelect = () => {
    // This would typically open a file picker
    // For this mock, we'll simulate a file being chosen
    setFileName('document.pdf');
    setStatus('uploading');
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('processing');
          // Simulate AI processing
          setTimeout(() => {
            if (Math.random() > 0.1) { // 90% success rate
              setStatus('complete');
            } else {
              setStatus('error');
            }
          }, 2000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  const handleReset = () => {
    setStatus('idle');
    setProgress(0);
    setFileName('');
  }

  const dataToDisplay = feature === 'lease' ? mockLeaseData : mockExpenseData;

  return (
    <div className="glassmorphism rounded-xl p-4">
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        <div className="py-4">
          {status === 'idle' && (
            <div
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-8 text-center hover:bg-white/5 transition-colors"
              onClick={handleFileSelect}
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="font-semibold">Click to upload a file</p>
              <p className="text-xs text-muted-foreground">PDF, PNG, or JPG</p>
            </div>
          )}
          {status === 'uploading' && (
            <div className="space-y-3 text-center">
                <div className="flex items-center justify-center gap-3">
                    <File className="h-6 w-6 text-primary" />
                    <p className="font-medium">{fileName}</p>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          )}
          {status === 'processing' && (
            <div className="space-y-4 text-center flex flex-col items-center">
                 <Loader2 className="mx-auto h-8 w-8 text-accent animate-spin" />
                <p className="font-semibold">AI is processing the document...</p>
                <p className="text-sm text-muted-foreground">This may take a moment.</p>
            </div>
          )}
          {status === 'complete' && (
            <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-primary">
                    <CheckCircle className="h-8 w-8" />
                    <p className="font-semibold text-lg">Processing Complete!</p>
                </div>
                <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                    <h5 className="font-semibold text-center mb-2">Extracted Data</h5>
                    {Object.entries(dataToDisplay).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{key}:</span>
                            <span className="font-medium">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
          )}
          {status === 'error' && (
             <div className="space-y-4 text-center flex flex-col items-center">
                <AlertTriangle className="mx-auto h-8 w-8 text-destructive" />
                <p className="font-semibold text-destructive">Processing Failed</p>
                <p className="text-sm text-muted-foreground">Could not read the document. Please try a different file.</p>
            </div>
          )}
        </div>
        
        <div className="mt-2 flex justify-end">
            {(status === 'complete' || status === 'error') && <Button onClick={handleReset} variant="ghost" size="sm">Upload Another</Button>}
        </div>
    </div>
  );
}
