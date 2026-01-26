'use client';

import { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Upload, CheckCircle, Loader2, File, AlertTriangle, Sparkles } from 'lucide-react';
import { Progress } from '../ui/progress';
import { useToast } from '@/hooks/use-toast';
import { extractLeaseDetails, type ExtractLeaseDetailsOutput } from '@/ai/flows/document-intelligence';
import { categorizeExpense, type CategorizeExpenseOutput } from '@/ai/flows/smart-expense-categorization';

type DocumentUploaderProps = {
  title: string;
  description: string;
  feature: 'lease' | 'expense';
};

export function DocumentUploader({
  title,
  description,
  feature,
}: DocumentUploaderProps) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [extractedData, setExtractedData] = useState<ExtractLeaseDetailsOutput | CategorizeExpenseOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit for data URI
      toast({ variant: 'destructive', title: 'File too large', description: 'Please upload a file smaller than 10MB.' });
      return;
    }

    setFileName(file.name);
    setStatus('uploading');

    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = (event.loaded / event.total) * 100;
        setProgress(percentage);
      }
    };
    reader.onload = async (e) => {
      setProgress(100);
      setStatus('processing');
      const dataUri = e.target?.result as string;

      try {
        if (feature === 'lease') {
          const result = await extractLeaseDetails({ leaseDocumentDataUri: dataUri });
          setExtractedData(result);
        } else {
          const result = await categorizeExpense({ receiptDataUri: dataUri, description: file.name });
          setExtractedData(result);
        }
        setStatus('complete');
      } catch (error) {
        console.error('AI processing failed', error);
        setStatus('error');
        toast({ variant: 'destructive', title: 'Processing Failed', description: 'The AI could not process this document.' });
      }
    };
    reader.onerror = () => {
      setStatus('error');
      toast({ variant: 'destructive', title: 'File Read Error', description: 'Could not read the selected file.' });
    };

    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setStatus('idle');
    setProgress(0);
    setFileName('');
    setExtractedData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const dataToDisplay = feature === 'lease'
    ? extractedData as ExtractLeaseDetailsOutput
    : extractedData as CategorizeExpenseOutput;

  return (
    <div className="glassmorphism rounded-xl p-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, application/pdf"
      />
      <h4 className="font-semibold text-foreground flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" /> {title}
      </h4>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      
      <div className="py-4">
        {status === 'idle' && (
          <div
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-8 text-center hover:bg-white/5 transition-colors"
            onClick={handleUploadClick}
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="font-semibold">Click to upload a file</p>
            <p className="text-xs text-muted-foreground">PDF, PNG, or JPG (Max 10MB)</p>
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
        {status === 'complete' && extractedData && (
          <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-primary">
                  <CheckCircle className="h-8 w-8" />
                  <p className="font-semibold text-lg">Processing Complete!</p>
              </div>
              <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                  <h5 className="font-semibold text-center mb-2">Extracted Data</h5>
                  {Object.entries(dataToDisplay).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                          <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="font-medium">{String(value)}</span>
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
