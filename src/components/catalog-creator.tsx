'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { VoiceRecorder } from '@/components/voice-recorder';
import { ProductForm } from '@/components/product-form';
import { LoadingSpinner } from '@/components/loading-spinner';
import { handleTranscribe, handleGenerate } from '@/app/actions';
import type { GenerateProductDescriptionOutput } from '@/ai/flows/generate-product-description';
import { FileText, Sparkles, Wand2, RefreshCw } from 'lucide-react';

type Step = 'record' | 'review_transcription' | 'review_listing';

export function CatalogCreator() {
  const [step, setStep] = useState<Step>('record');
  const [transcribedText, setTranscribedText] = useState('');
  const [productListing, setProductListing] = useState<GenerateProductDescriptionOutput | null>(null);
  
  const [isTranscribing, startTranscribeTransition] = useTransition();
  const [isGenerating, startGenerateTransition] = useTransition();

  const { toast } = useToast();

  const onRecordingComplete = (audioDataUrl: string) => {
    startTranscribeTransition(async () => {
      const result = await handleTranscribe({ audioDataUri: audioDataUrl });
      if (result.success && result.transcription) {
        setTranscribedText(result.transcription);
        setStep('review_transcription');
      } else {
        toast({
          title: 'Transcription Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    });
  };

  const handleGenerateListing = () => {
    startGenerateTransition(async () => {
      const result = await handleGenerate({ transcribedText });
      if (result.success && result.product) {
        setProductListing(result.product);
        setStep('review_listing');
      } else {
        toast({
          title: 'Generation Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    });
  };

  const reset = () => {
    setStep('record');
    setTranscribedText('');
    setProductListing(null);
  };
  
  const isLoading = isTranscribing || isGenerating;

  if (step === 'review_listing' && productListing) {
    return <ProductForm productData={productListing} onRestart={reset} />;
  }

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader>
        {step === 'record' && (
          <>
            <CardTitle className="font-headline">Describe Your Product</CardTitle>
            <CardDescription>Press the button and speak clearly. We'll turn your words into a professional product listing.</CardDescription>
          </>
        )}
        {step === 'review_transcription' && (
          <>
            <CardTitle className="flex items-center gap-2 font-headline">
                <FileText className="w-6 h-6 text-primary"/>
                Review Your Transcription
            </CardTitle>
            <CardDescription>Check the transcribed text for any errors. You can edit it before we generate the listing.</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent>
        {isTranscribing && (
            <div className="flex flex-col items-center justify-center gap-4 min-h-[200px]">
                <LoadingSpinner className="w-10 h-10 text-primary" />
                <p className="text-muted-foreground">AI is listening... Transcribing your audio.</p>
            </div>
        )}
        {!isTranscribing && step === 'record' && (
          <div className="flex justify-center py-8">
            <VoiceRecorder onRecordingComplete={onRecordingComplete} disabled={isLoading} />
          </div>
        )}

        {step === 'review_transcription' && (
          <div className="space-y-4">
            <Textarea
              value={transcribedText}
              onChange={(e) => setTranscribedText(e.target.value)}
              className="min-h-[150px] text-base"
              aria-label="Transcribed product description"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleGenerateListing} disabled={isLoading || transcribedText.length < 10} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                {isGenerating ? (
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Listing
              </Button>
              <Button variant="outline" onClick={reset} disabled={isLoading} className="w-full sm:w-auto">
                <RefreshCw className="mr-2 h-4 w-4" />
                Re-record
              </Button>
            </div>
            {isGenerating && (
                <div className="flex items-center justify-center gap-2 pt-4 text-muted-foreground">
                    <LoadingSpinner className="w-5 h-5" />
                    <p>Crafting your listing with AI...</p>
                </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
