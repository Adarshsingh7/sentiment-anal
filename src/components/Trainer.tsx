"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mic, MicOff, Download } from "lucide-react";

import { Progress } from "@/components/ui/progress";

interface TimerProps {
  duration: number;
  isRunning: boolean;
  onComplete: () => void;
}

function Timer({ duration, isRunning, onComplete }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(duration);
      setProgress(100);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, duration, onComplete]);

  useEffect(() => {
    setProgress((timeLeft / duration) * 100);
  }, [timeLeft, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Card className="w-[140px]">
      <CardContent className="p-4">
        <div className="text-center mb-2 font-mono text-xl">
          {formatTime(timeLeft)}
        </div>
        <Progress value={progress} className="h-2" />
      </CardContent>
    </Card>
  );
}

function SpeechInsights() {
  // This is static data for now as requested
  const insights = [
    { name: "Clarity", value: 85 },
    { name: "Pace", value: 72 },
    { name: "Filler Words", value: 32 },
    { name: "Confidence", value: 78 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Speech Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.name} className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{insight.name}</span>
                <span className="text-sm text-muted-foreground">
                  {insight.value}%
                </span>
              </div>
              <Progress value={insight.value} className="h-2" />
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-md text-sm">
          <h4 className="font-semibold mb-2">Tips for Improvement</h4>
          <ul className="list-disc pl-4 space-y-1">
            <li>Speak more slowly to improve clarity</li>
            <li>Reduce filler words like "um" and "uh"</li>
            <li>Practice breathing techniques for better pacing</li>
            <li>Record yourself regularly to track progress</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SpeechPractice() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [downloadUrl, setDownloadUrl] = useState("");

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const sampleText =
    "The quick brown fox jumps over the lazy dog. Public speaking is an important skill that can be improved with regular practice. Clear articulation and proper pacing are key elements of effective communication.";

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join("");

          setTranscript(transcript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Handle microphone toggle
  const toggleMicrophone = async () => {
    if (isListening) {
      stopListening();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        startListening(stream);
      } catch (error) {
        console.error("Error accessing microphone", error);
      }
    }
  };

  const startListening = (stream: MediaStream) => {
    // Start speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }

    // Start audio recording
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      setRecordedAudio(audioBlob);
      const url = URL.createObjectURL(audioBlob);
      setDownloadUrl(url);
    };

    mediaRecorderRef.current.start();
    setIsListening(true);
    setIsTimerRunning(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    setIsListening(false);
    setIsTimerRunning(false);
  };

  // Highlight correctly spoken words
  const renderHighlightedText = () => {
    if (!transcript) return sampleText;

    const sampleWords = sampleText.toLowerCase().split(/\s+/);
    const spokenWords = transcript.toLowerCase().split(/\s+/);

    return sampleText.split(/\s+/).map((word, index) => {
      const isCorrect = spokenWords.includes(
        word.toLowerCase().replace(/[.,!?;:]/g, ""),
      );
      return (
        <span
          key={index}
          className={`${isCorrect ? "bg-green-200 dark:bg-green-900" : ""}`}
        >
          {word}{" "}
        </span>
      );
    });
  };

  // Handle timer completion
  const handleTimerComplete = () => {
    stopListening();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Speech Practice App
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Practice Text</CardTitle>
              <CardDescription>Read the text below aloud</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-lg mb-6 leading-relaxed p-4 bg-muted rounded-md">
                {renderHighlightedText()}
              </div>

              <div className="flex flex-wrap gap-4 justify-between items-center">
                <div className="flex gap-2">
                  <Button
                    onClick={toggleMicrophone}
                    variant={isListening ? "destructive" : "default"}
                  >
                    {isListening ? (
                      <MicOff className="mr-2 h-4 w-4" />
                    ) : (
                      <Mic className="mr-2 h-4 w-4" />
                    )}
                    {isListening ? "Stop" : "Start"} Recording
                  </Button>

                  {recordedAudio && (
                    <Button variant="outline" asChild>
                      <a href={downloadUrl} download="speech-practice.wav">
                        <Download className="mr-2 h-4 w-4" />
                        Download Recording
                      </a>
                    </Button>
                  )}
                </div>

                <Timer
                  duration={60}
                  isRunning={isTimerRunning}
                  onComplete={handleTimerComplete}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <SpeechInsights />
        </div>
      </div>
    </div>
  );
}
