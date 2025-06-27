'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Square, AlertCircle, CircleDot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  onRecordingComplete: (audioDataUrl: string) => void;
  disabled?: boolean;
}

type RecordingState = 'idle' | 'permission_pending' | 'recording' | 'error';

export function VoiceRecorder({ onRecordingComplete, disabled }: VoiceRecorderProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);
  

  const handleStartRecording = async () => {
    if (recordingState === 'recording') {
      stopRecording();
      return;
    }

    setRecordingState('permission_pending');
    setError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Media Devices API not supported in this browser.');
      setRecordingState('error');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setRecordingState('recording');
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          onRecordingComplete(reader.result as string);
          setRecordingState('idle');
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setError('Microphone access was denied. Please enable it in your browser settings.');
        } else {
            setError('Could not access the microphone. Please check your hardware and permissions.');
        }
      } else {
        setError('An unknown error occurred while accessing the microphone.');
      }
      setRecordingState('error');
    }
  };

  const isRecording = recordingState === 'recording';

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={handleStartRecording}
        disabled={disabled || recordingState === 'permission_pending'}
        className={cn(
          'relative rounded-full w-24 h-24 p-0 shadow-lg transition-all duration-300 transform hover:scale-105',
          isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
        )}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording && <span className="absolute inset-0 bg-white/30 rounded-full animate-pulse-ring" />}
        {isRecording ? <Square className="w-10 h-10 text-white fill-white" /> : <Mic className="w-10 h-10 text-primary-foreground" />}
      </Button>
      <div className="text-center h-10">
        {recordingState === 'error' && error && (
          <p className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
        {recordingState !== 'error' && (
          <p className="text-sm text-muted-foreground">
            {isRecording ? 'Recording...' : 'Tap the microphone to start recording'}
          </p>
        )}
      </div>
    </div>
  );
}
