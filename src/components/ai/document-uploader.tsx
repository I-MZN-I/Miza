'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '../ui/dialog';
import { Upload, CheckCircle, Clock, Loader } from 'lucide-react';
import { Progress } from '../ui/progress';

type DocumentUploaderProps = {
  triggerButtonText: string;
  dialogTitle: string;
  dialogDescription: string;
  icon: React.ElementType;
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
  triggerButtonText,
  dialogTitle,
  dialogDescription,
  icon: Icon,
  feature,
}: DocumentUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = () => {
    setIsUploading(true);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsProcessing(true);
          // Simulate AI processing
          setTimeout(() => {
            setIsProcessing(false);
            setIsComplete(true);
          }, 2000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  const handleReset = () => {
    setIsUploading(false);
    setIsProcessing(false);
    setIsComplete(false);
    setProgress(0);
  }

  const dataToDisplay = feature === 'lease' ? mockLeaseData : mockExpenseData;

  return (
    <Dialog onOpenChange={(open) => !open && handleReset()}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Icon className="mr-2 h-4 w-4" />
          {triggerButtonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glassmorphism">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {!isUploading && !isProcessing && !isComplete && (
            <div
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-8 text-center"
              onClick={handleUpload}
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="font-semibold">Click to upload a file</p>
              <p className="text-xs text-muted-foreground">PDF, PNG, or JPG</p>
            </div>
          )}
          {isUploading && (
            <div className="space-y-2 text-center">
                <Loader className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p>Uploading...</p>
                <Progress value={progress} />
            </div>
          )}
          {isProcessing && (
            <div className="space-y-2 text-center">
                 <Clock className="mx-auto h-8 w-8 text-accent" />
                <p>AI is processing the document...</p>
            </div>
          )}
          {isComplete && (
            <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-primary">
                    <CheckCircle className="h-8 w-8" />
                    <p className="font-semibold">Processing Complete!</p>
                </div>
                <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                    {Object.entries(dataToDisplay).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{key}:</span>
                            <span className="font-medium">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
          )}
        </div>
        <DialogFooter>
            {isComplete && <Button onClick={handleReset}>Upload Another</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
